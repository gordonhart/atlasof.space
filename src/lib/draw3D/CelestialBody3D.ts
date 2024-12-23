import * as THREE from 'three';
import { CelestialBodyState } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';
import { mul3 } from '../physics.ts';

const hoverScaleFactor = 5;

export class CelestialBody3D {
  readonly mesh: THREE.Mesh;
  readonly dot: THREE.Points;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, bodyState: CelestialBodyState) {
    this.scene = scene;

    // Create the main sphere geometry for the celestial body
    const geometry = new THREE.SphereGeometry(bodyState.radius / SCALE_FACTOR, 32, 32);
    const color = new THREE.Color(bodyState.color);
    const material = new THREE.MeshBasicMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(...mul3(1 / SCALE_FACTOR, bodyState.position));

    // add a fixed-size (in display-space) dot to ensure body is always visible, event at far zooms
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bodyState.position), 3));
    // TODO: smaller dot size
    const dotMaterial = new THREE.PointsMaterial({ size: 5, color });
    this.dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(this.dot);
    scene.add(this.mesh);
  }

  update(bodyState: CelestialBodyState, hover: string | null) {
    this.mesh.position.set(...mul3(1 / SCALE_FACTOR, bodyState.position));
    const scale = bodyState.name === hover ? hoverScaleFactor : 1;
    // const scaledRadius = bodyState.radius * scale;
    this.mesh.scale.set(scale, scale, scale);
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.dot.geometry.dispose();
    (this.dot.material as THREE.PointsMaterial).dispose();
    this.scene.remove(this.mesh);
  }
}

// Helper function to create and manage celestial bodies
export function createCelestialSystem(
  scene: THREE.Scene,
  systemState: CelestialBodyState,
  visibleTypes: Set<string>
): Map<string, CelestialBody3D> {
  const bodies = new Map<string, CelestialBody3D>();

  function createBodyRecursive(body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) return;
    bodies.set(body.name, new CelestialBody3D(scene, body));
    body.satellites.forEach(createBodyRecursive);
  }

  createBodyRecursive(systemState);
  return bodies;
}
