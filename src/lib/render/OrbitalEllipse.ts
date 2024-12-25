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
      semiMajorAxis: a,
      eccentricity: e,
      longitudeAscending: OmegaDeg,
      argumentOfPeriapsis: omegaDeg,
      inclination: iDeg,
    } = elements;
    const b = semiMinorAxis(a, e);
    const focusDistance = Math.sqrt(a ** 2 - b ** 2);
    const omega = degreesToRadians(omegaDeg);
    const ellipseCurve = new EllipseCurve(
      -(Math.cos(omega) * focusDistance) / SCALE_FACTOR, // not sure why the sign is negative, seems consistent
      -(Math.sin(omega) * focusDistance) / SCALE_FACTOR,
      a / SCALE_FACTOR,
      b / SCALE_FACTOR,
      0,
      Math.PI * 2,
      false,
      omega
    );
    const ellipsePoints = ellipseCurve.getPoints(this.nPoints);
    const ellipseGeometry = new BufferGeometry().setFromPoints(ellipsePoints);
    const ellipseMaterial = new LineBasicMaterial({ color });
    this.ellipse = new Line(ellipseGeometry, ellipseMaterial);
    if (offset != null) {
      this.ellipse.translateX(offset.x / SCALE_FACTOR);
      this.ellipse.translateY(offset.y / SCALE_FACTOR);
      this.ellipse.translateZ(offset.z / SCALE_FACTOR);
    }
    this.ellipse.rotateZ(degreesToRadians(OmegaDeg));
    this.ellipse.rotateX(degreesToRadians(iDeg));
    scene.add(this.ellipse);

    const ellipseFocusGeometry = new LineGeometry();
    ellipseFocusGeometry.setPositions(ellipsePoints.flatMap(p => [p.x, p.y, 0]));
    const resolution = new Vector2(window.innerWidth, window.innerHeight);
    const ellipseFocusMaterial = new LineMaterial({ color, linewidth: 2, resolution, transparent: true, opacity: 0.5 });
    ellipseFocusMaterial.depthTest = false;
    this.ellipseFocus = new Line2(ellipseFocusGeometry, ellipseFocusMaterial);
    this.ellipseFocus.visible = false;
    if (offset != null) {
      this.ellipseFocus.translateX(offset.x / SCALE_FACTOR);
      this.ellipseFocus.translateY(offset.y / SCALE_FACTOR);
      this.ellipseFocus.translateZ(offset.z / SCALE_FACTOR);
    }
    this.ellipseFocus.rotateZ(degreesToRadians(OmegaDeg));
    this.ellipseFocus.rotateX(degreesToRadians(iDeg));
    scene.add(this.ellipseFocus);
  }

  update(visible: boolean, offset: Vector3 | null) {
    this.ellipse.visible = visible;

    // TODO: bug here where the ellipses of some moons fly away...?
    // move ellipse based on position of parent
    if (offset != null) {
      this.ellipse.translateX(offset.x / SCALE_FACTOR - this.ellipse.position.x);
      this.ellipse.translateY(offset.y / SCALE_FACTOR - this.ellipse.position.y);
      this.ellipse.translateZ(offset.z / SCALE_FACTOR - this.ellipse.position.z);
      this.ellipseFocus.translateX(offset.x / SCALE_FACTOR - this.ellipseFocus.position.x);
      this.ellipseFocus.translateY(offset.y / SCALE_FACTOR - this.ellipseFocus.position.y);
      this.ellipseFocus.translateZ(offset.z / SCALE_FACTOR - this.ellipseFocus.position.z);
    }
  }

  // TODO: these can be simplified away, probably
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
