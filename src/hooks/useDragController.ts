import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import {
  CelestialBody,
  CelestialBodyState,
  CelestialBodyType,
  KeplerianElements,
  Point2,
  Point3,
} from '../lib/types.ts';
import { findCelestialBody } from '../lib/constants.ts';
import {
  degreesToRadians,
  orbitalEllipseAtTheta,
  magnitude,
  subtract3,
  orbitalEllipseNormalVector,
  semiMinorAxis,
  radiansToDegrees,
} from '../lib/physics.ts';
import { matrix, multiply } from 'mathjs';

export function useDragController(
  { offset, metersPerPx, center, visibleTypes }: AppState,
  updateAppState: (state: Partial<AppState>) => void,
  systemState: CelestialBodyState
) {
  const [prevPosition, setPrevPosition] = useState<Point2 | undefined>();

  function updateFocusPlanet(event: MouseEvent<HTMLCanvasElement>) {
    const [eventXm, eventYm] = [event.clientX * metersPerPx, (window.innerHeight - event.clientY) * metersPerPx];
    const [panOffsetXm, panOffsetYm] = offset;
    const [focusOffsetXm, focusOffsetYm] = findCelestialBody(systemState, center)?.position ?? [0, 0];
    const [offsetXm, offsetYm] = [panOffsetXm - focusOffsetXm, panOffsetYm - focusOffsetYm];
    const [centerXm, centerYm] = [(metersPerPx * window.innerWidth) / 2, (metersPerPx * window.innerHeight) / 2];
    const [cursorXm, cursorYm] = [eventXm - offsetXm - centerXm, eventYm - offsetYm - centerYm];
    const closestPlanet = findClosestBody(systemState, visibleTypes, [cursorXm, cursorYm], metersPerPx * 10);
    updateAppState({ hover: closestPlanet != null ? closestPlanet.name : null });
  }

  function updateOffset(event: MouseEvent<HTMLCanvasElement>) {
    if (prevPosition == null) {
      updateFocusPlanet(event);
      return;
    }
    const newOffset: Point2 = [
      offset[0] - (prevPosition[0] - event.clientX) * metersPerPx,
      offset[1] + (prevPosition[1] - event.clientY) * metersPerPx,
    ];
    updateAppState({ offset: newOffset });
    setPrevPosition([event.clientX, event.clientY]);
  }

  function updateZoom(event: WheelEvent<HTMLCanvasElement>) {
    const zoomFactor = 1 + 0.01 * event.deltaY;
    updateAppState({ metersPerPx: Math.min(Math.max(metersPerPx * zoomFactor, 1000), 1e12) });
  }

  return {
    canvasProps: {
      onMouseDown: (e: MouseEvent<HTMLCanvasElement>) => setPrevPosition([e.clientX, e.clientY]),
      onMouseMove: updateOffset,
      onMouseLeave: () => setPrevPosition(undefined),
      onMouseUp: () => setPrevPosition(undefined),
      onWheel: updateZoom,
    },
  };
}

// TODO: how should moons function?
function findClosestBody(
  body: CelestialBodyState,
  visibleTypes: Set<CelestialBodyType>,
  position: [number, number],
  threshold: number
): CelestialBody | null {
  if (magnitude(subtract3([...position, 0], body.position)) < threshold) {
    return body;
  }
  return body.satellites.reduce<CelestialBody | null>((closest, child) => {
    return visibleTypes.has(child.type) && isPointCloseToEllipseAnalytical(position, child, threshold)
      ? child
      : closest;
  }, null);
}

// TODO: this numerical solution is quite lazy; would be better to solve analytically
function isPointCloseToEllipseNumericalSimple(
  [pointXm, pointYm]: [number, number], // in plane of ecliptic (viewport plane)
  ellipse: KeplerianElements,
  tolerance: number
) {
  const steps = 36;
  for (let step = 0; step < steps; step++) {
    const theta = (step / steps) * 2 * Math.PI;
    const [x, y] = orbitalEllipseAtTheta(ellipse, theta);
    const distance = magnitude([pointXm - x, pointYm - y]);
    if (distance < tolerance) {
      return true;
    }
  }
  return false;
}

function findMinTheta(
  [pointXm, pointYm]: [number, number], // in plane of ecliptic (viewport plane)
  ellipse: KeplerianElements
) {
  const steps = 360;
  let minTheta = Infinity;
  let minDistance = Infinity;
  for (let step = 0; step < steps; step++) {
    const theta = (step / steps) * 2 * Math.PI;
    const [x, y] = orbitalEllipseAtTheta(ellipse, theta);
    const distance = magnitude([pointXm - x, pointYm - y]);
    if (distance < minDistance) {
      minTheta = theta;
      minDistance = distance;
    }
  }
  return minTheta;
}

function findIntersectionPoint(
  [pointXm, pointYm]: [number, number], // in plane of ecliptic (viewport plane)
  ellipse: KeplerianElements
) {
  const { inclination, longitudeAscending } = ellipse;
  // define z line through (x,y)
  const pointZm = 0;
  const [directionX, directionY, directionZ] = [0, 0, 1];

  const ellipseNormal = orbitalEllipseNormalVector(inclination, longitudeAscending);
  const [a, b, c, d] = [...ellipseNormal, 0]; // plane defining orbital ellipse

  const numerator = -(a * pointXm + b * pointYm + c * pointZm + d);
  const denominator = a * directionX + b * directionY + c * directionZ;
  const t = numerator / denominator;

  const intersectionXm = pointXm + t * directionX;
  const intersectionYm = pointYm + t * directionY;
  const intersectionZm = pointZm + t * directionZ;
  // console.log(intersectionXm, intersectionYm, intersectionZm);
  return [intersectionXm, intersectionYm, intersectionZm];
}

function isPointCloseToEllipseNumerical(
  [pointXm, pointYm]: [number, number], // in plane of ecliptic (viewport plane)
  ellipse: KeplerianElements,
  tolerance: number
) {
  const point = findIntersectionPoint([pointXm, pointYm], ellipse);
  console.log(point);
  function computeDistanceAtTheta(theta: number) {
    const pointTheta = orbitalEllipseAtTheta(ellipse, theta);
    console.log(`theta: ${theta.toFixed(3)}, point: ${pointTheta}`);
    return magnitude(subtract3(point, pointTheta));
  }

  const maxTries = 12; // down to <0.1º of true closest
  const distanceA = computeDistanceAtTheta(Math.PI / 2);
  const distanceB = computeDistanceAtTheta((3 * Math.PI) / 2);
  let [low, high] = distanceA < distanceB ? [0, Math.PI] : [Math.PI, 2 * Math.PI];
  let distance = Math.min(distanceA, distanceB);

  console.log('start', low, high);
  for (let i = 0; i < maxTries; i++) {
    const half = (high - low) / 2;
    const distanceLow = computeDistanceAtTheta(low);
    const distanceHigh = computeDistanceAtTheta(high);
    console.log(
      [low.toFixed(3), high.toFixed(3)],
      (distanceLow / tolerance).toFixed(1),
      (distanceHigh / tolerance).toFixed(1),
      half.toFixed(3)
    );
    if (distanceLow < distanceHigh) {
      high -= half;
    } else {
      low += half;
    }
    distance = Math.min(distanceLow, distanceHigh);
  }

  console.log(findMinTheta([pointXm, pointYm], ellipse));
  return distance < tolerance;
}

function isPointCloseToEllipseAnalytical(
  [pointXm, pointYm]: [number, number], // in plane of ecliptic (viewport plane)
  ellipse: KeplerianElements,
  tolerance: number
) {
  const { semiMajorAxis: a, semiMinorAxis: b, tilt: tiltDeg } = projectOrbitalEllipseOntoEcliptic(ellipse);
  const tilt = degreesToRadians(tiltDeg);
  console.log(a, b, tiltDeg);
  // TODO: rActual is measuring distance from the sun, rTheta is measuring distance from ellipse center,
  //  need to offset ellipse by C (of 3D ellipse, as it will have different foci from 2D ellipse)
  const rActual = magnitude([pointXm, pointYm]);
  const theta = Math.atan2(pointYm, pointXm) - tilt;
  const rTheta = (a * b) / Math.sqrt(b ** 2 * Math.cos(theta) ** 2 + a ** 2 * Math.sin(theta) ** 2);
  return Math.abs(rActual - rTheta) < tolerance;
}

// objective: determine if the point (x,y) in the ecliptic is within tolerance meters of the orbital ellipse when the
//  orbital ellipse is projected into the ecliptic
//
// steps:
// 1.
function isPointCloseToEllipse2(
  [pointXm, pointYm]: [number, number], // in plane of ecliptic (viewport plane)
  ellipse: KeplerianElements,
  tolerance: number
) {
  const { inclination, longitudeAscending } = ellipse;
  // define z line through (x,y)
  const pointZm = 0;
  const [directionX, directionY, directionZ] = [0, 0, 1];

  const ellipseNormal = orbitalEllipseNormalVector(inclination, longitudeAscending);
  const [a, b, c, d] = [...ellipseNormal, 0]; // plane defining orbital ellipse

  const numerator = -(a * pointXm + b * pointYm + c * pointZm + d);
  const denominator = a * directionX + b * directionY + c * directionZ;
  const t = numerator / denominator;

  const intersectionXm = pointXm + t * directionX;
  const intersectionYm = pointYm + t * directionY;
  const intersectionZm = pointZm + t * directionZ;
  // console.log(intersectionXm, intersectionYm, intersectionZm);
  const intersection = [intersectionXm, intersectionYm, intersectionZm];

  const theta = computeTrueAnomalyFromEclipticPosition(intersection, ellipse);
  // computeDistanceInOrbital(x, y, ellipse);
  // console.log('true anomaly', theta, theta2);
  const [xOrbit, yOrbit, zOrbit] = orbitalEllipseAtTheta(ellipse, theta);
  const rCursor = magnitude([intersectionXm, intersectionYm, intersectionZm]);
  const rOrbit = magnitude([xOrbit, yOrbit, zOrbit]); // in plane of ecliptic (no Z)
  return Math.abs(rOrbit - rCursor) < tolerance;
}

function computeTrueAnomalyFromEclipticPosition([x, y, z]: Point3, ellipse: KeplerianElements) {
  const { longitudeAscending, argumentOfPeriapsis, inclination } = ellipse;
  const Omega = degreesToRadians(longitudeAscending);
  const omega = degreesToRadians(argumentOfPeriapsis);
  const i = degreesToRadians(inclination);
  const rOmega = matrix([
    [Math.cos(-Omega), Math.sin(-Omega), 0],
    [-Math.sin(-Omega), Math.cos(-Omega), 0],
    [0, 0, 1],
  ]);
  const ri = matrix([
    [1, 0, 0],
    [0, Math.cos(-i), Math.sin(-i)],
    [0, -Math.sin(-i), Math.cos(-i)],
  ]);
  const romega = matrix([
    [Math.cos(-omega), Math.sin(-omega), 0],
    [-Math.sin(-omega), Math.cos(-omega), 0],
    [0, 0, 1],
  ]);
  const r = multiply(romega, multiply(ri, rOmega));
  const pOrbital = multiply(r, matrix([x, y, z]));
  const [xOrbital, yOrbital, zOrbital] = [pOrbital.get([0]), pOrbital.get([1]), pOrbital.get([2])];
  const theta = Math.atan2(yOrbital, xOrbital);
  console.log(xOrbital, yOrbital, zOrbital);
  // console.log('true anomaly', theta, pOrbital._data);
  return theta;
}

type EclipticEllipse = {
  semiMajorAxis: number; // meters
  semiMinorAxis: number; // meters
  tilt: number; // degrees from +x reference direction
};
export function projectOrbitalEllipseOntoEcliptic(ellipse: KeplerianElements): EclipticEllipse {
  const { semiMajorAxis: a, eccentricity, longitudeAscending, argumentOfPeriapsis, inclination } = ellipse;
  const b = semiMinorAxis(a, eccentricity);

  const i = degreesToRadians(inclination);
  const Omega = degreesToRadians(longitudeAscending);
  const omega = degreesToRadians(argumentOfPeriapsis);

  const [cosw, sinw] = [Math.cos(omega), Math.sin(omega)];
  const [cosO, sinO] = [Math.cos(Omega), Math.sin(Omega)];
  const cosi = Math.cos(i);

  // elements of the transformation matrix [A B, C D] projecting from orbital plane onto the ecliptic
  const A = a * (cosw * cosO - sinw * cosi * sinO);
  const B = b * (-sinw * cosO - cosw * cosi * sinO);
  const C = a * (cosw * sinO + sinw * cosi * cosO);
  const D = b * (-sinw * sinO + cosw * cosi * cosO);

  // convenience definitions for M^T*M matrix to use in singular value decomposition
  // const mTm = [[A ** 2 + C ** 2, A * B + C * D], [A * B + C * D, B ** 2 + D ** 2]];
  const X = A ** 2 + C ** 2;
  const Y = B ** 2 + D ** 2;
  const Z = A * B + C * D;
  // const mTm = [[X, Z], [Z, Y]];

  // find eigenvalues lambda0, lambda1 representing semi-major and semi-minor axes of projected ellipse
  // const rad = Math.sqrt((X + Y) ** 2 - 4 * (X * Y - Z ** 2));
  const rad = Math.sqrt((X - Y) ** 2 + 4 * Z ** 2); // simplified
  const lambda0 = (X + Y + rad) / 2;
  const lambda1 = (X + Y - rad) / 2;

  // compute tilt as direction of eigenvector lambda1
  const tiltRad = Math.atan2(2 * Z, X - Y) / 2;

  return {
    semiMajorAxis: Math.sqrt(lambda0), // singular value is sqrt(eigenvalue)
    semiMinorAxis: Math.sqrt(lambda1),
    tilt: radiansToDegrees(tiltRad),
  };
}
