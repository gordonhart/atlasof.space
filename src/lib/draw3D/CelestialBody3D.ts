import { CelestialBodyState, Point2 } from '../types.ts';
import { MIN_SIZE, SCALE_FACTOR } from './constants.ts';
import { mul3 } from '../physics.ts';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';

export class CelestialBody3D {
  readonly name: string;
  readonly mesh: Mesh;
  readonly dot: Points;
  readonly dotPosition: BufferAttribute;
  private scene: Scene;
  private screenPosition: Vector3;

  constructor(scene: Scene, bodyState: CelestialBodyState) {
    this.name = bodyState.name;
    this.scene = scene;
    this.screenPosition = new Vector3();

    // Create the main sphere geometry for the celestial body
    const geometry = new SphereGeometry(bodyState.radius / SCALE_FACTOR, 32, 32);
    const color = new Color(bodyState.color);
    const material = new MeshBasicMaterial({ color });
    this.mesh = new Mesh(geometry, material);
    const position = mul3(1 / SCALE_FACTOR, bodyState.position);
    this.mesh.position.set(...position);
    this.mesh.userData = { name: this.name };
    scene.add(this.mesh);

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const dotGeometry = new BufferGeometry();
    this.dotPosition = new BufferAttribute(new Float32Array(position), 3);
    dotGeometry.setAttribute('position', this.dotPosition);
    // TODO: smaller dot size
    const dotMaterial = new PointsMaterial({ size: MIN_SIZE, color });
    this.dot = new Points(dotGeometry, dotMaterial);
    scene.add(this.dot);
  }

  update(bodyState: CelestialBodyState) {
    const position = mul3(1 / SCALE_FACTOR, bodyState.position);
    this.mesh.position.set(...position);
    this.dotPosition.array[0] = position[0];
    this.dotPosition.array[1] = position[1];
    this.dotPosition.array[2] = position[2];
    this.dotPosition.needsUpdate = true;
    // this.dot.geometry.setAttribute('position', this.position);
    // const scale = bodyState.name === hover ? hoverScaleFactor : 1;
    // const scaledRadius = bodyState.radius * scale;
    // this.mesh.scale.set(scale, scale, scale);
  }

  getScreenPosition(camera: OrthographicCamera): Point2 {
    // Get world position
    this.mesh.updateWorldMatrix(true, false);
    this.screenPosition.setFromMatrixPosition(this.mesh.matrixWorld);

    // Project to screen space
    this.screenPosition.project(camera);

    // Convert to pixels
    const pixelX = ((this.screenPosition.x + 1) * window.innerWidth) / 2;
    const pixelY = ((-this.screenPosition.y + 1) * window.innerHeight) / 2;
    return [pixelX, pixelY];
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as Material).dispose();
    this.dot.geometry.dispose();
    (this.dot.material as Material).dispose();
    this.scene.remove(this.mesh);
  }
}

// Helper function to create and manage celestial bodies
export function createCelestialSystem(
  scene: Scene,
  systemState: CelestialBodyState,
  visibleTypes: Set<string>
): Array<CelestialBody3D> {
  const bodies: Array<CelestialBody3D> = [];

  function createBodyRecursive(body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) return;
    body.satellites.forEach(createBodyRecursive);
    bodies.push(new CelestialBody3D(scene, body));
  }

  createBodyRecursive(systemState);
  return bodies;
}
