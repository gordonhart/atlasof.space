import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { CelestialBody, CelestialBodyState, KeplerianElements, Point2 } from '../lib/types.ts';
import { findCelestialBody, SOL } from '../lib/constants.ts';
import { degreesToRadians, magnitude } from '../lib/physics.ts';

export function useDragController(
  { offset, metersPerPx, center }: AppState,
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
    const closestPlanet = findClosestPlanet(cursorXm, cursorYm, metersPerPx * 10);
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

function findClosestPlanet(positionXm: number, positionYm: number, threshold: number): CelestialBody | null {
  if (magnitude([positionXm, positionYm]) < threshold) {
    return SOL;
  }
  return SOL.satellites.reduce<CelestialBody | null>((closest, body) => {
    return isPointOnEllipse(positionXm, positionYm, body, threshold) ? body : closest;
  }, null);
}

function isPointOnEllipse(x: number, y: number, ellipse: KeplerianElements, tolerance: number) {
  const {
    semiMajorAxis: a,
    eccentricity: e,
    inclination: i,
    argumentOfPeriapsis: omega,
    longitudeAscending: Omega,
  } = ellipse;
  // Step 1: Rotate the point by -omega
  const cosOmega = Math.cos(-omega);
  const sinOmega = Math.sin(-omega);
  const xPrime = x * cosOmega - y * sinOmega;
  const yPrime = x * sinOmega + y * cosOmega;

  // Step 2: Convert to polar coordinates
  const rPrime = magnitude([xPrime, yPrime]);
  const thetaPrime = Math.atan2(yPrime, xPrime);

  // Step 3: Calculate expected r
  const r = (a * (1 - e ** 2)) / (1 + e * Math.cos(thetaPrime));

  // Step 4: Check if the point lies on the ellipse
  return Math.abs(rPrime - r) < tolerance;
}
