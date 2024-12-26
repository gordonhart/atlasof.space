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
import { HOVER_SCALE_FACTOR, MIN_SIZE, SCALE_FACTOR } from './constants.ts';
import { mul3 } from '../physics.ts';
import { getCircleTexture } from './utils.ts';
import { CelestialBody } from '../types.ts';

export class SphericalBody {
  private readonly scene: Scene;
  private readonly body: CelestialBody;
  private readonly sphere: Mesh;
  private readonly dot: Points;
  public readonly dotPosition: BufferAttribute;

  private readonly spherePoints: number = 36;

  constructor(scene: Scene, body: CelestialBody, position: Vector3, color: Color) {
    this.scene = scene;
    this.body = body;

    // Create the main sphere geometry for the celestial body
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = new MeshBasicMaterial({ color });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const positionScaled = mul3(1 / SCALE_FACTOR, position.toArray());
    this.sphere.position.set(...positionScaled);
    scene.add(this.sphere);

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(positionScaled), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    const map = getCircleTexture(body.color);
    const dotMaterial = new PointsMaterial({ size: MIN_SIZE, color, map, sizeAttenuation: false });
    // TODO: debug issue where these points mysteriously disappear at certain zooms (sphere+ellipse are still visible)
    dotMaterial.depthTest = true;
    this.dot = new Points(dotGeometry, dotMaterial);
    scene.add(this.dot);
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
    } else {
      this.sphere.geometry.dispose(); // toggle hover off
      this.sphere.geometry = new SphereGeometry(this.body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
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
