import {
  DoubleSide,
  Material,
  MeshStandardMaterial,
  Mesh,
  RingGeometry,
  Scene,
  Vector2,
  TextureLoader,
  Vector3,
  MeshBasicMaterial,
  Color,
} from 'three';
import { asCdnUrl } from '../images.ts';
import { degreesToRadians } from '../physics.ts';
import { CelestialBody, Ring } from '../types.ts';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';

export class RingObject {
  private readonly scene: Scene;
  private readonly ring: Mesh;

  private readonly nSegments = 64;

  constructor(scene: Scene, body: CelestialBody, ring: Ring, position: Vector3) {
    this.scene = scene;

    const [r0, r1] = [ring.start / SCALE_FACTOR, ring.end / SCALE_FACTOR];
    const geometry = new RingGeometry(r0, r1, this.nSegments);

    // modify UV coordinates for radial texture mapping
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const vertex = new Vector2(pos.getX(i), pos.getY(i));
      const v = (vertex.length() - r0) / (r1 - r0);
      uv.setXY(i, (vertex.angle() + Math.PI) / (2 * Math.PI), v);
    }

    let material: Material;
    if (ring.texture != null) {
      const textureMap = new TextureLoader().load(asCdnUrl(ring.texture));
      material = new MeshStandardMaterial({ map: textureMap, side: DoubleSide });
    } else {
      material = new MeshBasicMaterial({ color: new Color(body.style.fgColor) });
    }
    this.ring = new Mesh(geometry, material);
    this.ring.rotation.x =
      degreesToRadians(body.elements.inclination) + degreesToRadians(body.elements.rotation?.axialTilt ?? 0);
    this.ring.position.copy(position).divideScalar(SCALE_FACTOR);
    scene.add(this.ring);
  }

  update(position: Vector3, visible: boolean) {
    this.ring.position.copy(position).divideScalar(SCALE_FACTOR);
    this.ring.visible = visible;
  }

  setHover(hovered: boolean) {
    if (hovered) {
      this.ring.scale.set(HOVER_SCALE_FACTOR, HOVER_SCALE_FACTOR, 1);
    } else {
      this.ring.scale.set(1, 1, 1);
    }
  }

  dispose() {
    this.ring.geometry.dispose();
    (this.ring.material as Material).dispose();
    this.scene.remove(this.ring);
  }
}
