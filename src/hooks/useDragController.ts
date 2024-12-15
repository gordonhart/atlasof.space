import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { CelestialBody, CelestialBodyState, CelestialBodyType, KeplerianElements, Point2 } from '../lib/types.ts';
import { findCelestialBody } from '../lib/constants.ts';
import { degreesToRadians, orbitalEllipseAtTheta, magnitude, subtract3, semiMinorAxis } from '../lib/physics.ts';
import { deepMerge } from '@mantine/core';
import { inc, of } from 'ramda';
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
  [positionXm, positionYm]: [number, number],
  threshold: number
): CelestialBody | null {
  if (magnitude(subtract3([positionXm, positionYm, 0], body.position)) < threshold) {
    return body;
  }
  return body.satellites.reduce<CelestialBody | null>((closest, child) => {
    return visibleTypes.has(child.type) && isPointOnEllipse(positionXm, positionYm, child, threshold) ? child : closest;
  }, null);
}

export function isPointOnEllipse(x: number, y: number, ellipse: KeplerianElements, tolerance: number): boolean {
  const { eccentricity, semiMajorAxis, inclination, longitudeAscending, argumentOfPeriapsis } = ellipse;

  // Convert angles to radians
  const inc = (Math.PI / 180) * inclination;
  const lonAsc = (Math.PI / 180) * longitudeAscending;
  const argPeri = (Math.PI / 180) * argumentOfPeriapsis;

  // Precompute trigonometric values for transformations
  const cosLonAsc = Math.cos(lonAsc);
  const sinLonAsc = Math.sin(lonAsc);
  const cosInc = Math.cos(inc);
  const sinInc = Math.sin(inc);
  const cosArgPeri = Math.cos(argPeri);
  const sinArgPeri = Math.sin(argPeri);

  // Transform the point (x, y) into the orbital plane
  const xPrime = cosLonAsc * x + sinLonAsc * y;
  const yPrime = -sinLonAsc * x + cosLonAsc * y;

  const orbitalX = xPrime * cosArgPeri + yPrime * sinArgPeri;
  const orbitalY = -xPrime * sinArgPeri + yPrime * cosArgPeri;

  // Convert transformed point to polar coordinates
  const rPoint = Math.sqrt(orbitalX ** 2 + orbitalY ** 2);
  const thetaPoint = Math.atan2(orbitalY, orbitalX);

  // Function to compute the radial distance on the ellipse at a given theta
  const rEllipse = (theta: number) => {
    return (semiMajorAxis * (1 - eccentricity ** 2)) / (1 + eccentricity * Math.cos(theta));
  };

  // Function to minimize: squared distance between the point and the ellipse
  const distanceSquared = (theta: number) => {
    const r = rEllipse(theta);
    const xEllipse = r * Math.cos(theta);
    const yEllipse = r * Math.sin(theta);
    return (xEllipse - orbitalX) ** 2 + (yEllipse - orbitalY) ** 2;
  };

  // Use Newton's method to find the theta that minimizes the distance
  let theta = thetaPoint;
  for (let i = 0; i < 10; i++) {
    // 10 iterations for convergence
    const r = rEllipse(theta);
    const dr_dtheta =
      -(semiMajorAxis * (1 - eccentricity ** 2) * eccentricity * Math.sin(theta)) /
      (1 + eccentricity * Math.cos(theta)) ** 2;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const dx_dtheta = dr_dtheta * Math.cos(theta) - r * Math.sin(theta);
    const dy_dtheta = dr_dtheta * Math.sin(theta) + r * Math.cos(theta);

    const dDistSquared_dtheta = 2 * (x - orbitalX) * dx_dtheta + 2 * (y - orbitalY) * dy_dtheta;

    const d2DistSquared_dtheta2 =
      2 * (dx_dtheta ** 2 + dy_dtheta ** 2) +
      2 * (x - orbitalX) * (dr_dtheta * -Math.sin(theta) - r * Math.cos(theta)) +
      2 * (y - orbitalY) * (dr_dtheta * Math.cos(theta) - r * Math.sin(theta));

    // Update theta using Newton's method
    theta -= dDistSquared_dtheta / d2DistSquared_dtheta2;
  }

  // Compute the final closest distance
  const rClosest = rEllipse(theta);
  const xClosest = rClosest * Math.cos(theta);
  const yClosest = rClosest * Math.sin(theta);
  const distance = Math.sqrt((xClosest - orbitalX) ** 2 + (yClosest - orbitalY) ** 2);

  // Return whether the distance is within tolerance
  return distance <= tolerance;
}

// objective: determine if the point (x,y) in the ecliptic is within tolerance meters of the orbital ellipse when the
//  orbital ellipse is projected into the ecliptic
//
// steps:
// 1.
function isPointOnEllipse2(x: number, y: number, ellipse: KeplerianElements, tolerance: number) {
  // TODO: this math isn't 100% correct, likely need to take into account inclination, center offset
  // const theta = Math.atan2(yPlane, x) - degreesToRadians(Omega) - degreesToRadians(omega);
  const theta2 = computeTrueAnomalyFromEclipticPosition(x, y, ellipse);
  const theta = computeTrueAnomaly(
    [x, y, 0],
    degreesToRadians(ellipse.argumentOfPeriapsis),
    degreesToRadians(ellipse.inclination),
    degreesToRadians(ellipse.longitudeAscending)
  );
  computeDistanceInOrbital(x, y, ellipse);
  // console.log('true anomaly', theta, theta2);
  const [xOrbit, yOrbit, zOrbit] = orbitalEllipseAtTheta(ellipse, theta);
  const rCursor = magnitude([x, y]);
  const rOrbit = magnitude([xOrbit, yOrbit]); // in plane of ecliptic (no Z)
  return Math.abs(rOrbit - rCursor) < tolerance;
}

/*
function computeDistanceInOrbital(x: number, y: number, ellipse: KeplerianElements) {
  const { longitudeAscending, argumentOfPeriapsis, inclination } = ellipse;
  const { semiMajorAxis: a, eccentricity: e } = ellipse;
  const Omega = degreesToRadians(longitudeAscending);
  const omega = degreesToRadians(argumentOfPeriapsis);
  const i = degreesToRadians(inclination);

  const [xOrbital, yOrbital, zOrbital] =
  const r = (a * (1 - e ** 2)) / (1 + e * Math.cos(theta));
  const rPoint = magnitude([xOrbital, yOrbital, zOrbital]);
  console.log(r, rPoint);

  // console.log('true anomaly', theta, pOrbital._data);
  return theta;
}e
 */

function computeTrueAnomalyFromEclipticPosition(x: number, y: number, ellipse: KeplerianElements) {
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
  const pOrbital = multiply(r, matrix([x, y, 0]));
  const [xOrbital, yOrbital] = [pOrbital.get([0]), pOrbital.get([1])];
  const theta = Math.atan2(yOrbital, xOrbital);
  // console.log('true anomaly', theta, pOrbital._data);
  return theta;
}

type Vector3 = [number, number, number];
type Matrix3x3 = [Vector3, Vector3, Vector3];

// Helper to multiply a 3x3 matrix with a 3D vector
function multiplyMatrixVector(matrix: Matrix3x3, vector: Vector3): Vector3 {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

// Create a rotation matrix around the Z-axis by angle (in radians)
function rotationZ(angle: number): Matrix3x3 {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  return [
    [cosA, sinA, 0],
    [-sinA, cosA, 0],
    [0, 0, 1],
  ];
}

// Create a rotation matrix around the X-axis by angle (in radians)
function rotationX(angle: number): Matrix3x3 {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  return [
    [1, 0, 0],
    [0, cosA, sinA],
    [0, -sinA, cosA],
  ];
}

// Perform the coordinate transformation
function transformToOrbitalPlane(
  point: Vector3,
  omega: number, // Argument of periapsis (radians)
  i: number, // Inclination (radians)
  Omega: number // Longitude of ascending node (radians)
): Vector3 {
  // Create the total transformation matrix R_total = R_omega * R_i * R_Omega
  const R_Omega = rotationZ(-Omega); // Rotate by -Omega around Z
  const R_i = rotationX(-i); // Rotate by -i around X
  const R_omega = rotationZ(-omega); // Rotate by -omega around Z

  // Combine the rotations: R_total = R_omega * R_i * R_Omega
  const R_total = multiplyMatrixMatrix(R_omega, multiplyMatrixMatrix(R_i, R_Omega));

  // Transform the point to the orbital plane
  return multiplyMatrixVector(R_total, point);
}

// Helper to multiply two 3x3 matrices
function multiplyMatrixMatrix(A: Matrix3x3, B: Matrix3x3): Matrix3x3 {
  const result: Matrix3x3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
    }
  }
  return result;
}

// Compute the true anomaly
function computeTrueAnomaly(pointEcliptic: Vector3, omega: number, i: number, Omega: number): number {
  // Transform the point to the orbital plane
  const pointOrbital = transformToOrbitalPlane(pointEcliptic, omega, i, Omega);

  // Extract x' and y' from the orbital plane coordinates
  const [xPrime, yPrime, _] = pointOrbital;

  // Compute theta using arctan2
  return Math.atan2(yPrime, xPrime);
}
