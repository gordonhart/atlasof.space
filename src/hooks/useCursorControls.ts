import { MouseEvent, PointerEvent, useRef } from 'react';
import { SolarSystemModel } from '../lib/model/SolarSystemModel.ts';
import { Point2 } from '../lib/types.ts';
import { Settings } from '../lib/state.ts';
import { magnitude, subtract3 } from '../lib/physics.ts';
import { useIsTouchDevice } from './useIsTouchDevice.ts';

const DRAG_PX_THRESHOLD = 10;

type DragDetector = {
  dragged: boolean;
  initial: Point2;
};

export function useCursorControls(
  model: SolarSystemModel | null,
  { visibleTypes }: Settings,
  updateSettings: (state: Partial<Settings>) => void
) {
  const isTouchDevice = useIsTouchDevice();
  const dragDetectorRef = useRef<DragDetector | null>(null);
  const interactPxThreshold = isTouchDevice ? 25 : 10;

  function getCursorCoordinates(event: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>): Point2 {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    return [event.clientX - left, event.clientY - top];
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    dragDetectorRef.current = { dragged: false, initial: getCursorCoordinates(event) };
  }

  function onPointerLeave() {
    dragDetectorRef.current = null;
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const dragDetector = dragDetectorRef.current;
    const eventPx = getCursorCoordinates(event);
    if (dragDetector != null) {
      const distance = magnitude(subtract3([...dragDetector.initial, 0], [...eventPx, 0]));
      dragDetectorRef.current = { ...dragDetector, dragged: dragDetector.dragged || distance > DRAG_PX_THRESHOLD };
    }

    if (model == null) return;
    const closeBody = model.findCloseBody(eventPx, visibleTypes, interactPxThreshold);
    updateSettings({ hover: closeBody?.body?.name ?? null });
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (model == null) return;

    // only process this as a click if the user hasn't been dragging around; it's bad UX if the end of your dragging
    // ends in selecting the planet underneath your cursor
    if (dragDetectorRef.current?.dragged) {
      dragDetectorRef.current = null;
      return;
    }

    const closeBody = model.findCloseBody(getCursorCoordinates(event), visibleTypes, interactPxThreshold);
    if (closeBody != null) {
      updateSettings({ center: closeBody.body.name });
    }
  }

  return { onPointerDown, onPointerMove, onPointerLeave, onClick };
}
