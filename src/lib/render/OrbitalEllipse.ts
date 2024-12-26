import { BufferGeometry, Color, EllipseCurve, Line, LineBasicMaterial, Material, Scene, Vector2, Vector3 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { SCALE_FACTOR } from './constants.ts';
import { KeplerianElements } from '../types.ts';
import { degreesToRadians, semiMinorAxis } from '../physics.ts';

export class OrbitalEllipse {
  private readonly scene: Scene;
  private readonly ellipse: Line; // use a 1px-thick Line for normal rendering (fast)
  private readonly ellipseFocus: Line2; // use an Npx-thick Line2 for focus rendering (slower)
  private readonly nPoints: number = 3600;

  constructor(scene: Scene, elements: KeplerianElements, offset: Vector3 | null, color: Color) {
    this.scene = scene;

    const {
      semiMajorAxis,
      eccentricity: e,
      longitudeAscending: OmegaDeg,
      argumentOfPeriapsis: omegaDeg,
      inclination: iDeg,
    } = elements;
    const a = semiMajorAxis / SCALE_FACTOR;
    const b = semiMinorAxis(a, e);
    const focusDistance = Math.sqrt(a ** 2 - b ** 2);
    const omega = degreesToRadians(omegaDeg);
    const Omega = degreesToRadians(OmegaDeg);
    const i = degreesToRadians(iDeg);

    // not sure why the sign is negative, seems consistent
    const rA = -(Math.cos(omega) * focusDistance);
    const rB = -(Math.sin(omega) * focusDistance);
    const ellipseCurve = new EllipseCurve(rA, rB, a, b, 0, Math.PI * 2, false, omega);
    const ellipsePoints = ellipseCurve.getPoints(this.nPoints);

    const ellipseGeometry = new BufferGeometry().setFromPoints(ellipsePoints);
    const ellipseMaterial = new LineBasicMaterial({ color });
    this.ellipse = new Line(ellipseGeometry, ellipseMaterial);
    this.ellipse.rotateZ(Omega);
    this.ellipse.rotateX(i);
    if (offset != null) {
      this.ellipse.position.set(offset.x, offset.y, offset.z).divideScalar(SCALE_FACTOR);
    }
    scene.add(this.ellipse);

    const ellipseFocusGeometry = new LineGeometry();
    ellipseFocusGeometry.setPositions(ellipsePoints.flatMap(p => [p.x, p.y, 0]));
    const resolution = new Vector2(window.innerWidth, window.innerHeight);
    const ellipseFocusMaterial = new LineMaterial({ color, linewidth: 2, resolution });
    ellipseFocusMaterial.depthTest = false;
    this.ellipseFocus = new Line2(ellipseFocusGeometry, ellipseFocusMaterial);
    this.ellipseFocus.visible = false;
    this.ellipseFocus.rotateZ(Omega);
    this.ellipseFocus.rotateX(i);
    if (offset != null) {
      this.ellipse.position.set(offset.x, offset.y, offset.z).divideScalar(SCALE_FACTOR);
    }
    scene.add(this.ellipseFocus);
  }

  update(visible: boolean, offset: Vector3 | null) {
    this.ellipse.visible = visible;
    if (offset != null) {
      this.ellipse.position.set(offset.x, offset.y, offset.z).divideScalar(SCALE_FACTOR);
      this.ellipseFocus.position.set(offset.x, offset.y, offset.z).divideScalar(SCALE_FACTOR);
    }
  }

  setFocus(focus: boolean) {
    this.ellipseFocus.visible = focus;
  }

  dispose() {
    this.ellipse.geometry.dispose();
    (this.ellipse.material as Material).dispose();
    this.scene.remove(this.ellipse);
    this.ellipseFocus.geometry.dispose();
    (this.ellipseFocus.material as Material).dispose();
    this.scene.remove(this.ellipseFocus);
  }
}