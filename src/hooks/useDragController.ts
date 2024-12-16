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

type EclipticEllipse = {
  semiMajorAxis: number; // meters
  semiMinorAxis: number; // meters
  tilt: number; // degrees from +x reference direction
};
export function projectOrbitalEllipseOntoEcliptic(ellipse: KeplerianElements): EclipticEllipse {
  const { semiMajorAxis: a, eccentricity, longitudeAscending, argumentOfPeriapsis, inclination } = ellipse;
  const b = semiMinorAxis(a, eccentricity);

  const i = degreesToRadians(inclination);
  // TODO: these are backwards???
  const omega = degreesToRadians(longitudeAscending);
  const Omega = degreesToRadians(argumentOfPeriapsis);

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
    tilt: -radiansToDegrees(tiltRad), // TODO: negative??
  };
}
