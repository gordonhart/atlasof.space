import { CelestialBody3D } from '../lib/draw3D/CelestialBody3D.ts';
import { MouseEvent } from 'react';
import { SolarSystemRenderer } from '../lib/draw3D/SolarSystemRenderer.ts';
import { magnitude } from '../lib/physics.ts';
import { Point2 } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';

export function useCursorControls3D(
  renderer: SolarSystemRenderer | null,
  bodies: Array<CelestialBody3D>,
  updateAppState: (state: Partial<AppState>) => void
) {
  function onMouseMove(event: MouseEvent<HTMLCanvasElement>) {
    if (renderer == null) return;
    const eventPx = [event.clientX, event.clientY];
    const closeBody = findCloseBody(renderer, bodies, eventPx, 25);
    updateAppState({ hover: closeBody?.name ?? null });
  }

  return { onMouseMove };
}

function findCloseBody(
  renderer: SolarSystemRenderer,
  bodies: Array<CelestialBody3D>,
  [xPx, yPx]: Point2,
  threshold = 10
): CelestialBody3D | null {
  for (const body of [...bodies].reverse()) {
    const [bodyXpx, bodyYpx] = body.getScreenPosition(renderer.camera);
    if (magnitude([xPx - bodyXpx, yPx - bodyYpx, 0]) < threshold) {
      return body;
    }
  }
}
