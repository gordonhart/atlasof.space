import { useState, MouseEvent } from 'react';
import { AppState } from '../lib/state.ts';
import { Point2 } from '../lib/types.ts';

export function useDragController(state: AppState, updateState: (state: Partial<AppState>) => void) {
  const [prevPosition, setPrevPosition] = useState<Point2 | undefined>();

  function startDragging(event: MouseEvent<HTMLCanvasElement>) {
    setPrevPosition([event.clientX, event.clientY]);
  }

  function updateOffset(event: MouseEvent<HTMLCanvasElement>) {
    if (prevPosition == null) {
      return;
    }
    const newOffset = [
      state.offset[0] - (prevPosition[0] - event.clientX) * state.metersPerPx,
      state.offset[1] + (prevPosition[1] - event.clientY) * state.metersPerPx,
    ];
    updateState({ offset: newOffset });
    setPrevPosition([event.clientX, event.clientY]);
  }

  function stopDragging() {
    setPrevPosition(undefined);
  }

  return {
    canvasProps: {
      onMouseDown: startDragging,
      onMouseMove: updateOffset,
      onMouseLeave: stopDragging,
      onMouseUp: stopDragging,
    },
  };
}
