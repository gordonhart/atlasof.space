import * as THREE from 'three';
import { CelestialBodyState } from './types';

const hoverScaleFactor = 5;

export class CelestialBody3D {
  private mesh: THREE.Mesh;
  private rotationIndicator: THREE.Mesh | null = null;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, bodyState: CelestialBodyState) {
    this.scene = scene;

    // Create the main sphere geometry for the celestial body
    const geometry = new THREE.SphereGeometry(bodyState.radius / 1e6, 32, 32);
    /*
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bodyState.color),
      metalness: 0.1,
      roughness: 0.7,
      emmissive: new THREE.Color(bodyState.color).multiplyScalar(500),
    });
     */
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(bodyState.color),
      transparent: true,
      opacity: 1.0,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(...bodyState.position);
    if (bodyState.siderealRotationPeriod != null) {
      this.createRotationIndicator(bodyState);
    }

    console.log(this.mesh);
    scene.add(this.mesh);
  }

  private createRotationIndicator(bodyState: CelestialBodyState) {
    // TODO: remove
    return;

    // Create a small segment that indicates rotation
    const indicatorGeometry = new THREE.CircleGeometry(
      bodyState.radius + 1,
      32,
      bodyState.rotation * (Math.PI / 180) - Math.PI / 32,
      Math.PI / 16
    );
    const indicatorMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    this.rotationIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);

    // Position it at the same location as the main body
    this.rotationIndicator.position.copy(this.mesh.position);

    // Add to scene
    this.scene.add(this.rotationIndicator);
  }

  update(bodyState: CelestialBodyState, hover: string | null) {
    // Update position
    this.mesh.position.set(...bodyState.position);

    // Handle hover state scaling
    const scale = bodyState.name === hover ? hoverScaleFactor : 1;
    // const scaledRadius = bodyState.radius * scale;
    this.mesh.scale.set(scale, scale, scale);

    // Update rotation indicator if it exists
    if (this.rotationIndicator && bodyState.siderealRotationPeriod !== null) {
      this.rotationIndicator.position.copy(this.mesh.position);
      this.rotationIndicator.rotation.z = bodyState.rotation * (Math.PI / 180);
      this.rotationIndicator.scale.set(scale, scale, scale);
    }
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.scene.remove(this.mesh);

    if (this.rotationIndicator) {
      this.rotationIndicator.geometry.dispose();
      (this.rotationIndicator.material as THREE.Material).dispose();
      this.scene.remove(this.rotationIndicator);
    }
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
