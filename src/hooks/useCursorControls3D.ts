import { CelestialBody3D } from '../lib/draw3D/CelestialBody3D.ts';
import { MouseEvent } from 'react';
import { SolarSystemRenderer } from '../lib/draw3D/SolarSystemRenderer.ts';
import { magnitude } from '../lib/physics.ts';
import { Point2 } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';

export function useCursorControls3D(
  renderer: SolarSystemRenderer | null,
  updateAppState: (state: Partial<AppState>) => void
) {
  function onClick(event: MouseEvent<HTMLElement>) {
    if (renderer == null) return;
    const eventPx: Point2 = [event.clientX, event.clientY];
    const closeBody = findCloseBody(renderer, eventPx, 25);
    if (closeBody != null) {
      updateAppState({ center: closeBody.name, offset: [0, 0] });
    }
  }

  function onMouseMove(event: MouseEvent<HTMLElement>) {
    if (renderer == null) return;
    const eventPx: Point2 = [event.clientX, event.clientY];
    const closeBody = findCloseBody(renderer, eventPx, 25);
    updateAppState({ hover: closeBody?.name ?? null });
  }

  return { onClick, onMouseMove };
}

function findCloseBody(renderer: SolarSystemRenderer, [xPx, yPx]: Point2, threshold = 10): CelestialBody3D | undefined {
  for (const body of [...renderer.bodies].reverse()) {
    const [bodyXpx, bodyYpx] = body.getScreenPosition(renderer.camera);
    if (magnitude([xPx - bodyXpx, yPx - bodyYpx, 0]) < threshold) {
      return body;
    }
  }
}
