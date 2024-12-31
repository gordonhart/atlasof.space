import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  EllipseCurve,
  Euler,
  Group,
  Line,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector2,
  Vector3,
} from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { SCALE_FACTOR } from './constants.ts';
import { KeplerianElements } from '../types.ts';
import { degreesToRadians, semiMinorAxis } from '../physics.ts';

export class OrbitalEllipse {
  private readonly scene: Scene;
  private readonly parentGroup: Group; // e.g. position of Jupiter WRT Sol
  private readonly bodyGroup: Group; // e.g. position of Io WRT Jupiter
  private readonly ellipse: Line; // use a 1px-thick Line for normal rendering (fast)
  private readonly ellipseHover: Line2; // use an Npx-thick Line2 for hover rendering (slower)
  private readonly face: Mesh;
  private readonly nPoints: number = 3600;

  constructor(
    scene: Scene,
    resolution: Vector2,
    elements: KeplerianElements,
    parentPosition: Vector3 | null,
    bodyPosition: Vector3,
    color: Color
  ) {
    this.scene = scene;

    this.parentGroup = new Group();
    if (parentPosition != null) this.parentGroup.position.copy(parentPosition).divideScalar(SCALE_FACTOR);
    this.scene.add(this.parentGroup);

    this.bodyGroup = new Group();
    this.bodyGroup.position.copy(bodyPosition);
    if (parentPosition != null) this.bodyGroup.position.sub(parentPosition);
    this.bodyGroup.position.divideScalar(SCALE_FACTOR);
    this.parentGroup.add(this.bodyGroup);

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

    // not sure why the sign is negative, looks to be consistent though
    const rA = -(Math.cos(omega) * focusDistance);
    const rB = -(Math.sin(omega) * focusDistance);
    const ellipseCurve = new EllipseCurve(rA, rB, a, b, 0, Math.PI * 2, false, omega);
    const pointOffset = bodyPosition
      .sub(parentPosition ?? new Vector3())
      .clone()
      .divideScalar(SCALE_FACTOR);
    const ellipsePoints = ellipseCurve
      .getPoints(this.nPoints)
      .map(p => new Vector3(p.x, p.y, 0).applyEuler(new Euler(i, 0, Omega, 'ZYX')).sub(pointOffset));
    const ellipseSpline = new CatmullRomCurve3(ellipsePoints, true, 'catmullrom', 0.5);
    const ellipseSplinePoints = ellipseSpline.getPoints(this.nPoints * 2); // use 2x points for smoother interpolation

    const ellipseGeometry = new BufferGeometry().setFromPoints(ellipseSplinePoints);
    const ellipseMaterial = new LineBasicMaterial({ color });
    this.ellipse = new Line(ellipseGeometry, ellipseMaterial);
    this.ellipse.renderOrder = 0;
    this.bodyGroup.add(this.ellipse);

    const ellipseHoverGeometry = new LineGeometry().setFromPoints(ellipseSplinePoints);
    const ellipseHoverMaterial = new LineMaterial({ color, linewidth: 2, resolution, depthTest: true });
    this.ellipseHover = new Line2(ellipseHoverGeometry, ellipseHoverMaterial);
    this.ellipseHover.visible = false;
    this.ellipseHover.renderOrder = 0;
    this.bodyGroup.add(this.ellipseHover);

    const faceGeometry = new BufferGeometry().setFromPoints(ellipseSplinePoints);
    const indices = Array(ellipseSplinePoints.length - 2)
      .fill(null)
      .flatMap((_, i) => [0, i + 1, i + 2]);
    faceGeometry.setIndex(indices);
    const faceMaterial = new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.025,
      side: DoubleSide,
      depthWrite: true, // helps with transparency rendering
      depthTest: true,
    });
    this.face = new Mesh(faceGeometry, faceMaterial);
    this.face.renderOrder = 0;
    this.face.visible = false;
    this.bodyGroup.add(this.face);
  }

  // TODO: often the ellipse does not align perfectly with the simulated body. It should probably update its geometry
  //  live to reflect changes in the simulated orbit, or at least be fudged such that when you zoom in it always passes
  //  through the center of the body
  update(parentPosition: Vector3 | null, bodyPosition: Vector3, visible: boolean) {
    this.ellipse.visible = visible;
    if (parentPosition != null) this.parentGroup.position.copy(parentPosition).divideScalar(SCALE_FACTOR);
    /*
    this.bodyGroup.position.copy(bodyPosition);
    if (parentPosition != null) this.bodyGroup.position.sub(parentPosition);
    this.bodyGroup.position.divideScalar(SCALE_FACTOR);
    if (parentPosition != null) {
      console.log(this.parentGroup.position, this.bodyGroup.position);
    }
     */
  }

  setHover(hovered: boolean) {
    this.ellipseHover.visible = hovered;
    this.face.visible = hovered;
  }

  dispose() {
    this.ellipse.geometry.dispose();
    (this.ellipse.material as Material).dispose();
    this.ellipseHover.geometry.dispose();
    (this.ellipseHover.material as Material).dispose();
    this.face.geometry.dispose();
    (this.face.material as Material).dispose();
    this.scene.remove(this.parentGroup);
  }
}
