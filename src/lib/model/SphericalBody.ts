import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { getCircleTexture } from './utils.ts';
import { CelestialBody } from '../types.ts';
import { Shapes, Textures } from '../images.ts';
import { degreesToRadians } from '../physics.ts';

export class SphericalBody {
  private readonly scene: Scene;
  private readonly body: CelestialBody;
  private sphere: Mesh;
  private readonly dot: Points;
  public readonly dotPosition: BufferAttribute;
  private readonly emissive: boolean;
  private hasShapeToLoad: boolean;
  private hovered = false;

  private readonly spherePoints: number = 144;
  // TODO: dynamically set based on true size of body? e.g. between 2-6
  private readonly dotSize: number = 5;

  constructor(scene: Scene, body: CelestialBody, position: Vector3, color: Color, emissive = false) {
    this.scene = scene;
    this.body = body;
    this.emissive = emissive;

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const positionScaled = position.clone().multiplyScalar(1 / SCALE_FACTOR);
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(positionScaled), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    const map = getCircleTexture('#ffffff');
    const dotMaterial = new PointsMaterial({
      size: this.dotSize,
      color,
      map,
      alphaMap: map, // ensure dark corners are not rendered as black
      transparent: true,
      sizeAttenuation: false,
      depthWrite: true,
    });
    this.dot = new Points(dotGeometry, dotMaterial);
    this.dot.frustumCulled = false;
    this.dot.renderOrder = 0;
    scene.add(this.dot);

    // note that this will be disposed+replaced if there is a .ply shape to load
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = this.getShapeMaterial();
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const inclination = degreesToRadians(body.elements.inclination);
    const axialTilt = body.rotation != null ? degreesToRadians(body.rotation.axialTilt) : 0;
    this.sphere.rotation.x = Math.PI / 2 + inclination + axialTilt;
    this.sphere.position.set(positionScaled.x, positionScaled.y, positionScaled.z);
    this.sphere.renderOrder = 1;
    scene.add(this.sphere);

    this.hasShapeToLoad = Shapes[this.body.name] != null;
  }

  private getShapeMaterial(): Material {
    const color = new Color(this.body.color);
    const ply = Shapes[this.body.name];
    const texture = Textures[this.body.name];

    // NOTE: objects with non-spherical shapes won't have textures applied; mostly due to common .ply files missing the
    //  uv mapping required to apply textures
    if (ply != null) {
      return new MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.8 });
    }

    if (texture != null) {
      const textureLoader = new TextureLoader();
      const textureMap = textureLoader.load(texture);
      if (this.emissive) {
        // TODO: better parameterization of this?
        return new MeshStandardMaterial({
          map: textureMap,
          emissive: color, // Emissive color (same as base for glow)
          emissiveIntensity: 0.5, // Intensity of the emissive glow
          roughness: 0.2, // Lower roughness for more shine
          metalness: 0.1, // Lower metalness for less reflection
        });
      }
      return new MeshStandardMaterial({ map: textureMap, metalness: 0, roughness: 1 });
    }

    return new MeshBasicMaterial({ color });
  }

  private lazyLoadShape(metersPerPx: number) {
    if (!this.hasShapeToLoad || !this.sphere.visible) return;

    // if this body is currently offscreen, bail
    // TODO

    // if the shape wouldn't be visible at this current zoom level, bail
    const hoverScaleFactor = this.hovered ? HOVER_SCALE_FACTOR : 1;
    const isGeometryVisible = (this.body.radius / metersPerPx) * hoverScaleFactor >= 2;
    if (!isGeometryVisible) return;

    const ply = Shapes[this.body.name];
    if (ply == null) return; // shouldn't happen
    this.hasShapeToLoad = false;
    const loader = new PLYLoader();
    loader.load(ply, this.onShapeLoad.bind(this));
  }

  private onShapeLoad(geometry: BufferGeometry) {
    geometry.computeVertexNormals(); // for proper shading
    const material = this.sphere.material as Material; // reuse the existing shape material

    // dispose the regular sphere
    this.sphere.geometry.dispose();
    this.scene.remove(this.sphere);

    this.sphere = new Mesh(geometry, material);
    const inclination = degreesToRadians(this.body.elements.inclination);
    const axialTilt = this.body.rotation != null ? degreesToRadians(this.body.rotation.axialTilt) : 0;
    this.sphere.rotation.x = Math.PI / 2 + inclination + axialTilt;
    this.sphere.position.copy(this.dot.position);
    this.sphere.renderOrder = 1;

    // scale the mesh -- 1 unit per km seems to be the standard scale for .ply files downloaded
    this.sphere.scale.divideScalar(SCALE_FACTOR / 1e3);

    this.scene.add(this.sphere);
  }

  update(position: Vector3, rotation: number, visible: boolean, metersPerPx: number) {
    this.sphere.updateWorldMatrix(true, false);
    this.sphere.position.copy(position).divideScalar(SCALE_FACTOR);
    this.sphere.rotation.y = degreesToRadians(rotation);
    this.sphere.visible = visible;
    this.dotPosition.array[0] = this.sphere.position.x;
    this.dotPosition.array[1] = this.sphere.position.y;
    this.dotPosition.array[2] = this.sphere.position.z;
    this.dotPosition.needsUpdate = true;
    this.dot.visible = visible;
    this.lazyLoadShape(metersPerPx);
  }

  setHover(hovered: boolean) {
    this.hovered = hovered;
    if (hovered) {
      this.sphere.scale.multiplyScalar(HOVER_SCALE_FACTOR);
      (this.dot.material as PointsMaterial).size = this.dotSize * 2;
    } else {
      this.sphere.scale.divideScalar(HOVER_SCALE_FACTOR);
      (this.dot.material as PointsMaterial).size = this.dotSize;
    }
  }

  dispose() {
    this.sphere.geometry.dispose();
    (this.sphere.material as Material).dispose();
    this.scene.remove(this.sphere);
    this.dot.geometry.dispose();
    (this.dot.material as Material).dispose();
    this.scene.remove(this.dot);
  }
}
