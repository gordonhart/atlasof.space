import { MouseEvent, PointerEvent, useRef } from 'react';
import { SolarSystemModel } from '../lib/render/SolarSystemModel.ts';
import { Point2 } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';
import { magnitude, subtract3 } from '../lib/physics.ts';

const INTERACT_PX_THRESHOLD = 10;
const DRAG_PX_THRESHOLD = 10;

type DragDetector = {
  dragged: boolean;
  initial: Point2;
};

export function useCursorControls(
  renderer: SolarSystemModel | null,
  { visibleTypes }: AppState,
  updateAppState: (state: Partial<AppState>) => void
) {
  const dragDetectorRef = useRef<DragDetector | null>(null);

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    dragDetectorRef.current = { dragged: false, initial: [event.clientX, event.clientY] };
  }

  function onPointerLeave() {
    dragDetectorRef.current = null;
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const dragDetector = dragDetectorRef.current;
    if (dragDetector != null) {
      const distance = magnitude(subtract3([...dragDetector.initial, 0], [event.clientX, event.clientY, 0]));
      dragDetectorRef.current = { ...dragDetector, dragged: dragDetector.dragged || distance > DRAG_PX_THRESHOLD };
    }

    if (renderer == null) return;
    const eventPx: Point2 = [event.clientX, event.clientY];
    const closeBody = renderer.findCloseBody(eventPx, visibleTypes, INTERACT_PX_THRESHOLD);
    updateAppState({ hover: closeBody?.body?.name ?? null });
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (renderer == null) return;

    // only process this as a click if the user hasn't been dragging around; it's bad UX if the end of your dragging
    // ends in selecting the planet underneath your cursor
    if (dragDetectorRef.current?.dragged) {
      dragDetectorRef.current = null;
      return;
    }

    const eventPx: Point2 = [event.clientX, event.clientY];
    const closeBody = renderer.findCloseBody(eventPx, visibleTypes, INTERACT_PX_THRESHOLD);
    if (closeBody != null) {
      updateAppState({ center: closeBody.body.name });
    }
  }

  return { onPointerDown, onPointerMove, onPointerLeave, onClick };
}
