import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { CelestialBody, CelestialBodyState, CelestialBodyType, KeplerianElements, Point2 } from '../lib/types.ts';
import { degreesToRadians, orbitalEllipseAtTheta, magnitude } from '../lib/physics.ts';
import { findCelestialBody } from '../lib/utils.ts';

export function useDragController(
  { offset, metersPerPx, center, visibleTypes }: AppState,
  updateAppState: (state: Partial<AppState>) => void,
  systemState: CelestialBodyState
) {
  const [prevPosition, setPrevPosition] = useState<Point2 | undefined>();

  function getCursorCoordinates(cursorXpx: number, cursorYpx: number): Point2 {
    const [eventXm, eventYm] = [cursorXpx * metersPerPx, (window.innerHeight - cursorYpx) * metersPerPx];
    const [panOffsetXm, panOffsetYm] = offset;
    const [focusOffsetXm, focusOffsetYm] = findCelestialBody(systemState, center)?.position ?? [0, 0];
    const [offsetXm, offsetYm] = [panOffsetXm - focusOffsetXm, panOffsetYm - focusOffsetYm];
    const [centerXm, centerYm] = [(metersPerPx * window.innerWidth) / 2, (metersPerPx * window.innerHeight) / 2];
    return [eventXm - offsetXm - centerXm, eventYm - offsetYm - centerYm];
  }

  function updateCenter(event: MouseEvent<HTMLCanvasElement>) {
    const cursorMeters = getCursorCoordinates(event.clientX, event.clientY);
    const closeBody = findCloseBody(systemState, visibleTypes, cursorMeters, metersPerPx * 25);
    if (closeBody != null) {
      updateAppState({ center: closeBody.name, offset: [0, 0] });
    }
  }

  function updateHover(event: MouseEvent<HTMLCanvasElement>) {
    const cursorMeters = getCursorCoordinates(event.clientX, event.clientY);
    const closeBody = findCloseBody(systemState, visibleTypes, cursorMeters, metersPerPx * 25);
    if (closeBody != null) {
      updateAppState({ hover: closeBody.name });
    } else {
      const closeOrbit = findCloseOrbit(systemState, visibleTypes, cursorMeters, metersPerPx * 10);
      updateAppState({ hover: closeOrbit != null ? closeOrbit.name : null });
    }
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
    updateAppState({ metersPerPx: metersPerPx * zoomFactor });
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

function findCloseBody(
  body: CelestialBodyState,
  visibleTypes: Set<CelestialBodyType>,
  [positionXm, positionYm]: [number, number],
  threshold: number
): CelestialBody | null {
  if (!visibleTypes.has(body.type)) {
    return null;
  }
  if (magnitude([positionXm - body.position[0], positionYm - body.position[1]]) < threshold) {
    return body; // returning early means that at all but very tight zooms, the parent will get selected over any moons
  }
  for (const child of body.satellites) {
    const childClosest = findCloseBody(child, visibleTypes, [positionXm, positionYm], threshold);
    if (childClosest != null) {
      return childClosest;
    }
  }
  return null;
}

// TODO: how should moons function?
function findCloseOrbit(
  body: CelestialBodyState,
  visibleTypes: Set<CelestialBodyType>,
  [positionXm, positionYm]: [number, number],
  threshold: number
): CelestialBody | null {
  if (!visibleTypes.has(body.type)) {
    return null;
  }
  if (magnitude([positionXm - body.position[0], positionYm - body.position[1]]) < threshold) {
    return body;
  }
  return body.satellites.reduce<CelestialBody | null>((closest, child) => {
    return visibleTypes.has(child.type) && distanceToOrbitalEllipse(positionXm, positionYm, child) < threshold
      ? child
      : closest;
  }, null);
}

function distanceToOrbitalEllipse(x: number, y: number, ellipse: KeplerianElements) {
  const { longitudeAscending: Omega, argumentOfPeriapsis: omega } = ellipse;
  // TODO: this math isn't 100% correct, likely need to take into account inclination
  const theta = Math.atan2(y, x) - degreesToRadians(omega) - degreesToRadians(Omega);
  const [xExpected, yExpected] = orbitalEllipseAtTheta(ellipse, theta);
  return magnitude([x - xExpected, y - yExpected]);
}
