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
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { getCircleTexture } from './utils.ts';
import { CelestialBody } from '../types.ts';
import { Textures } from '../images.ts';
import { degreesToRadians } from '../physics.ts';

export class SphericalBody {
  private readonly scene: Scene;
  private readonly body: CelestialBody;
  private readonly sphere: Mesh;
  private readonly dot: Points;
  public readonly dotPosition: BufferAttribute;

  private readonly spherePoints: number = 144;
  // TODO: dynamically set based on true size of body? e.g. between 2-6
  private readonly dotSize: number = 5;

  constructor(scene: Scene, body: CelestialBody, position: Vector3, color: Color, emissive = false) {
    this.scene = scene;
    this.body = body;

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

    // create the main sphere geometry for the celestial body
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const texture = Textures[body.name];
    let sphereMaterial: Material;
    if (texture != null) {
      sphereMaterial = new MeshBasicMaterial({ color });
      const textureLoader = new TextureLoader();
      const textureMap = textureLoader.load(texture);
      if (emissive) {
        // TODO: better parameterization of this?
        sphereMaterial = new MeshStandardMaterial({
          map: textureMap,
          emissive: color, // Emissive color (same as base for glow)
          emissiveIntensity: 0.5, // Intensity of the emissive glow
          roughness: 0.2, // Lower roughness for more shine
          metalness: 0.1, // Lower metalness for less reflection
        });
      } else {
        sphereMaterial = new MeshStandardMaterial({ map: textureMap, metalness: 0, roughness: 1 });
      }
    } else {
      sphereMaterial = new MeshBasicMaterial({ color });
    }
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const inclination = degreesToRadians(body.elements.inclination);
    const axialTilt = body.rotation != null ? degreesToRadians(body.rotation.axialTilt) : 0;
    this.sphere.rotation.x = Math.PI / 2 + inclination + axialTilt;
    this.sphere.position.set(positionScaled.x, positionScaled.y, positionScaled.z);
    this.sphere.renderOrder = 1;
    scene.add(this.sphere);
  }

  update(position: Vector3, rotation: number, visible: boolean) {
    this.sphere.updateWorldMatrix(true, false);
    this.sphere.position.set(...position.toArray()).multiplyScalar(1 / SCALE_FACTOR);
    this.sphere.rotation.y = degreesToRadians(rotation);
    this.sphere.visible = visible;
    this.dotPosition.array[0] = this.sphere.position.x;
    this.dotPosition.array[1] = this.sphere.position.y;
    this.dotPosition.array[2] = this.sphere.position.z;
    this.dotPosition.needsUpdate = true;
    this.dot.visible = visible;
  }

  setFocus(focus: boolean) {
    if (focus) {
      this.sphere.geometry.dispose(); // toggle hover on
      const radius = (HOVER_SCALE_FACTOR * this.body.radius) / SCALE_FACTOR;
      this.sphere.geometry = new SphereGeometry(radius, this.spherePoints, this.spherePoints);
      (this.dot.material as PointsMaterial).size = this.dotSize * 2;
    } else {
      this.sphere.geometry.dispose(); // toggle hover off
      this.sphere.geometry = new SphereGeometry(this.body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
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