import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { getCircleTexture } from './utils.ts';
import { CelestialBody } from '../types.ts';

export class SphericalBody {
  private readonly scene: Scene;
  private readonly body: CelestialBody;
  private readonly sphere: Mesh;
  private readonly dot: Points;
  public readonly dotPosition: BufferAttribute;

  private readonly spherePoints: number = 36;
  // TODO: dynamically set based on true size of body? e.g. between 2-6
  private readonly dotSize: number = 5;

  constructor(scene: Scene, body: CelestialBody, position: Vector3, color: Color) {
    this.scene = scene;
    this.body = body;

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const positionScaled = position.clone().multiplyScalar(1 / SCALE_FACTOR);
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(positionScaled), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    const map = getCircleTexture(body.color);
    const dotMaterial = new PointsMaterial({ size: this.dotSize, color, map, sizeAttenuation: false });
    this.dot = new Points(dotGeometry, dotMaterial);
    this.dot.frustumCulled = false;
    scene.add(this.dot);

    // Create the main sphere geometry for the celestial body
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = new MeshBasicMaterial({ color });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.set(positionScaled.x, positionScaled.y, positionScaled.z);
    scene.add(this.sphere);
  }

  update(position: Vector3, visible: boolean) {
    this.sphere.updateWorldMatrix(true, false);
    this.sphere.position.set(...position.toArray()).multiplyScalar(1 / SCALE_FACTOR);
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
