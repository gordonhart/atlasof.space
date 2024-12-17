import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { CelestialBody, CelestialBodyState, CelestialBodyType, KeplerianElements, Point2 } from '../lib/types.ts';
import { findCelestialBody } from '../lib/constants.ts';
import { degreesToRadians, orbitalEllipseAtTheta, magnitude } from '../lib/physics.ts';

export function useDragController(
  { offset, metersPerPx, center, visibleTypes }: AppState,
  updateAppState: (state: Partial<AppState>) => void,
  systemState: CelestialBodyState
) {
  const [prevPosition, setPrevPosition] = useState<Point2 | undefined>();

  function getCursorCoordinates(cursorXpx: number, cursorYpx: number) {
    const [eventXm, eventYm] = [cursorXpx * metersPerPx, (window.innerHeight - cursorYpx) * metersPerPx];
    const [panOffsetXm, panOffsetYm] = offset;
    const [focusOffsetXm, focusOffsetYm] = findCelestialBody(systemState, center)?.position ?? [0, 0];
    const [offsetXm, offsetYm] = [panOffsetXm - focusOffsetXm, panOffsetYm - focusOffsetYm];
    const [centerXm, centerYm] = [(metersPerPx * window.innerWidth) / 2, (metersPerPx * window.innerHeight) / 2];
    return [eventXm - offsetXm - centerXm, eventYm - offsetYm - centerYm];
  }

  function updateCenter(event: MouseEvent<HTMLCanvasElement>) {
    const [cursorXm, cursorYm] = getCursorCoordinates(event.clientX, event.clientY);
    const closestBody = findClosestBody(systemState, visibleTypes, [cursorXm, cursorYm], metersPerPx * 25);
    if (closestBody != null) {
      updateAppState({ center: closestBody.name });
    }
  }

  function updateHover(event: MouseEvent<HTMLCanvasElement>) {
    const [cursorXm, cursorYm] = getCursorCoordinates(event.clientX, event.clientY);
    const closestOrbit = findClosestOrbit(systemState, visibleTypes, [cursorXm, cursorYm], metersPerPx * 10);
    updateAppState({ hover: closestOrbit != null ? closestOrbit.name : null });
  }

  function updateOffset(event: MouseEvent<HTMLCanvasElement>) {
    if (prevPosition == null) {
      updateHover(event);
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
      onClick: updateCenter,
      onMouseDown: (e: MouseEvent<HTMLCanvasElement>) => setPrevPosition([e.clientX, e.clientY]),
      onMouseMove: updateOffset,
      onMouseLeave: () => setPrevPosition(undefined),
      onMouseUp: () => setPrevPosition(undefined),
      onWheel: updateZoom,
    },
  };
}

function findClosestBody(
  body: CelestialBodyState,
  visibleTypes: Set<CelestialBodyType>,
  [positionXm, positionYm]: [number, number],
  threshold: number
): CelestialBody | null {
  if (magnitude([positionXm - body.position[0], positionYm - body.position[1]]) < threshold) {
    return body;
  }
  for (const child of body.satellites) {
    if (magnitude([positionXm - child.position[0], positionYm - child.position[1]]) < threshold) {
      return child;
    }
    const childClosest = findClosestBody(child, visibleTypes, [positionXm, positionYm], threshold);
    if (childClosest != null) {
      return childClosest;
    }
  }
  return null;
}

// TODO: how should moons function?
function findClosestOrbit(
  body: CelestialBodyState,
  visibleTypes: Set<CelestialBodyType>,
  [positionXm, positionYm]: [number, number],
  threshold: number
): CelestialBody | null {
  if (magnitude([positionXm - body.position[0], positionYm - body.position[1]]) < threshold) {
    return body;
  }
  return body.satellites.reduce<CelestialBody | null>((closest, child) => {
    return visibleTypes.has(child.type) && isPointOnEllipse(positionXm, positionYm, child, threshold) ? child : closest;
  }, null);
}

function isPointOnEllipse(x: number, y: number, ellipse: KeplerianElements, tolerance: number) {
  const { longitudeAscending: Omega, argumentOfPeriapsis: omega } = ellipse;
  // TODO: this math isn't 100% correct, likely need to take into account inclination
  const theta = Math.atan2(y, x) - degreesToRadians(omega) - degreesToRadians(Omega);
  const [xExpected, yExpected] = orbitalEllipseAtTheta(ellipse, theta);
  const r = magnitude([x, y]);
  const rPrime = magnitude([xExpected, yExpected]);
  return Math.abs(rPrime - r) < tolerance;
}
