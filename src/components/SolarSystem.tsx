import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Group } from '@mantine/core';
import { AppState, clampState, initialState } from '../lib/state.ts';
import { Controls } from './Controls/Controls.tsx';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { useCursorControls3D } from '../hooks/useCursorControls3D.ts';
import { CelestialBody } from '../lib/types.ts';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const model = useSolarSystemModel();

  const updateState = useCallback(
    (update: Partial<AppState> | ((prev: AppState) => AppState)) => {
      setAppState(prev => {
        const updated = typeof update === 'function' ? update(prev) : { ...prev, ...update };
        const updatedClamped = clampState(updated);
        // set the mutable state ref (accessed by animation callback) on state update
        appStateRef.current = updatedClamped;
        return updatedClamped;
      });
    },
    [setAppState]
  );

  const cursorControls = useCursorControls3D(model.rendererRef.current, appState, updateState);

  function addBody(body: CelestialBody) {
    updateState(prev => ({ ...prev, bodies: [...prev.bodies, body] }));
    model.add(appStateRef.current, body);
  }

  function removeBody(name: string) {
    updateState(prev => ({ ...prev, bodies: prev.bodies.filter(b => b.name !== name) }));
    model.remove(name);
  }

  const resetState = useCallback(() => {
    updateState(initialState);
    model.reset(initialState);
  }, [updateState]);

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    const { play, time, dt, metersPerPx, vernalEquinox } = appStateRef.current;
    updateState({
      time: play ? time + dt : time,
      metersPerPx: model.rendererRef.current?.getMetersPerPixel() ?? metersPerPx,
      vernalEquinox: model.rendererRef?.current?.getVernalEquinox() ?? vernalEquinox,
    });
    const ctx = model.canvasRef.current?.getContext('2d');
    if (ctx != null) {
      model.update(ctx, appStateRef.current);
    }
    window.requestAnimationFrame(animationFrame);
  }

  useEffect(() => {
    const frameId = window.requestAnimationFrame(animationFrame);
    model.initialize(appStateRef.current);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <Box ref={model.containerRef} pos="absolute" top={0} right={0} {...cursorControls} />
      <canvas
        ref={model.canvasRef}
        style={{ height: '100vh', width: '100vw', position: 'absolute', pointerEvents: 'none' }}
      />
      <Controls
        state={appState}
        updateState={updateState}
        addBody={addBody}
        removeBody={removeBody}
        reset={resetState}
      />
    </Group>
  );
}
