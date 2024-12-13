import { useState, MouseEvent, WheelEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { Point2 } from '../lib/types.ts';

export function useDragController(state: AppState, updateState: (state: Partial<AppState>) => void) {
  const [prevPosition, setPrevPosition] = useState<Point2 | undefined>();

  function updateOffset(event: MouseEvent<HTMLCanvasElement>) {
    if (prevPosition == null) {
      console.log(event.clientX, event.clientY);
      return;
    }
    const newOffset: Point2 = [
      state.offset[0] - (prevPosition[0] - event.clientX) * state.metersPerPx,
      state.offset[1] + (prevPosition[1] - event.clientY) * state.metersPerPx,
    ];
    updateState({ offset: newOffset });
    setPrevPosition([event.clientX, event.clientY]);
  }

  function updateZoom(event: WheelEvent<HTMLCanvasElement>) {
    const zoomFactor = 1 + 0.01 * event.deltaY;
    updateState({ metersPerPx: Math.min(Math.max(state.metersPerPx * zoomFactor, 1000), 1e12) });
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
