import {
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';
import { asCdnUrl } from '../images.ts';
import { degreesToRadians } from '../physics.ts';
import { CelestialBody, CelestialBodyType } from '../types.ts';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { RingObject } from './RingObject.ts';

export class SphericalBody {
  private readonly scene: Scene;
  private readonly body: CelestialBody;
  private readonly sphere: Mesh;
  private readonly rings: Array<RingObject>;

  private readonly spherePoints: number = 144;
  private hasLoadedTexture = false;

  constructor(scene: Scene, body: CelestialBody, position: Vector3) {
    this.scene = scene;
    this.body = body;

    const radius = body.radius ?? 1;
    const positionScaled = position.clone().divideScalar(SCALE_FACTOR);
    const sphereGeometry = new SphereGeometry(radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const color = new Color(this.body.style.fgColor);
    const sphereMaterial = new MeshBasicMaterial({ color }); // defer loading of texture until sufficiently zoomed in
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const inclination = degreesToRadians(body.elements.inclination);
    const axialTilt = body.elements.rotation != null ? degreesToRadians(body.elements.rotation.axialTilt) : 0;
    this.sphere.rotation.x = Math.PI / 2 + inclination + axialTilt;
    this.sphere.position.set(positionScaled.x, positionScaled.y, positionScaled.z);
    this.sphere.renderOrder = 1;
    scene.add(this.sphere);

    this.rings = (body.rings ?? []).map(ring => new RingObject(scene, body, ring, position));
  }

  update(position: Vector3, rotation: number, visible: boolean) {
    this.sphere.updateWorldMatrix(true, false);
    this.sphere.position.copy(position).divideScalar(SCALE_FACTOR);
    this.sphere.rotation.y = degreesToRadians(rotation);
    this.sphere.visible = visible;
    this.rings.forEach(ring => ring.update(position, visible));
  }

  setHover(hovered: boolean) {
    if (hovered) {
      this.sphere.scale.multiplyScalar(HOVER_SCALE_FACTOR);
    } else {
      this.sphere.scale.divideScalar(HOVER_SCALE_FACTOR);
    }
    this.rings.forEach(ring => ring.setHover(hovered));
  }

  dispose() {
    this.sphere.geometry.dispose();
    (this.sphere.material as Material).dispose();
    this.scene.remove(this.sphere);
    this.rings.forEach(ring => ring.dispose());
  }

  ensureTextureLoaded() {
    const texture = this.body.assets?.texture;
    if (texture == null || this.hasLoadedTexture) return;
    this.hasLoadedTexture = true;
    const textureMap = new TextureLoader().load(asCdnUrl(texture));
    const emissive = this.body.type === CelestialBodyType.STAR;
    if (emissive) {
      // TODO: better parameterization of this?
      this.sphere.material = new MeshStandardMaterial({
        map: textureMap,
        emissive: new Color(this.body.style.fgColor), // Emissive color (same as base for glow)
        emissiveIntensity: 0.5, // Intensity of the emissive glow
        roughness: 0.2, // Lower roughness for more shine
        metalness: 0.1, // Lower metalness for less reflection
      });
    } else {
      this.sphere.material = new MeshStandardMaterial({ map: textureMap, metalness: 0, roughness: 1 });
    }
  }
}
