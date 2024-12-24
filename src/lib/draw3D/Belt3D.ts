import { BufferAttribute, BufferGeometry, Material, Points, PointsMaterial, Scene } from 'three';
import { AppState } from '../state.ts';
import { Belt } from '../types.ts';
import { SCALE_FACTOR } from './constants.ts';

export class Belt3D {
  readonly belt: Belt;
  readonly scene: Scene;
  readonly particles: Points;

  constructor(scene: Scene, appState: AppState, belt: Belt) {
    this.belt = belt;
    this.scene = scene;

    const width = (belt.max - belt.min) / SCALE_FACTOR;
    const particleGeometry = new BufferGeometry();
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);

    // Randomly scatter particles around the torus
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = belt.min / SCALE_FACTOR + width / 2; // Slightly outside the torus
      const torusAngle = Math.random() * Math.PI * 2;
      const x = (radius + (width / 2) * Math.cos(torusAngle)) * Math.cos(angle);
      const y = (radius + (width / 2) * Math.cos(torusAngle)) * Math.sin(angle);
      const z = ((Math.random() * width) / 2) * Math.sin(torusAngle);
      positions.set([x, y, z], i * 3);
    }
    particleGeometry.setAttribute('position', new BufferAttribute(positions, 3));

    const particleMaterial = new PointsMaterial({
      color: 0x444444,
      size: 1,
      transparent: true,
      opacity: 0.25,
    });
    this.particles = new Points(particleGeometry, particleMaterial);
    scene.add(this.particles);
  }

  dispose() {
    this.particles.geometry.dispose();
    (this.particles.material as Material).dispose();
    this.scene.remove(this.particles);
  }
}
