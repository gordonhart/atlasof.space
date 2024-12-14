import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { CelestialBodyState, Point2 } from '../lib/types.ts';
import { findCelestialBody, MEAN_PLANET_DISTANCES } from '../lib/constants.ts';
import { magnitude } from '../lib/physics.ts';

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
    const distanceFromSun = magnitude([cursorXm, cursorYm]);
    const closestPlanet = findClosestPlanet(distanceFromSun);
    updateAppState({ hover: closestPlanet });
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

// TODO: this uses circularized orbits by only measuring distance from sun -- bad UX for elliptical orbits (like pluto)
function findClosestPlanet(distanceFromSun: number) {
  const threshold = 1e10;
  if (distanceFromSun < threshold) {
    return 'Sol';
  }
  const [closestPlanet] = Object.entries(MEAN_PLANET_DISTANCES).reduce(
    ([closestP, closestD], [p, d]) => {
      const distanceFromPlanet = Math.abs(d - distanceFromSun);
      if (distanceFromPlanet - threshold / 2 > threshold) {
        return [closestP, closestD];
      }
      return closestD == null || distanceFromPlanet < closestD ? [p, distanceFromPlanet] : [closestP, closestD];
    },
    [null, null] as [null | string, number | string]
  );
  return closestPlanet;
}
