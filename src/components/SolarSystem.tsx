import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Group } from '@mantine/core';
import { AppState, clampState, initialState } from '../lib/state.ts';
import { Controls } from './Controls/Controls.tsx';
import { getInitialState, incrementState } from '../lib/physics.ts';
import { SOLAR_SYSTEM, SOLAR_SYSTEM_INITIAL_STATE } from '../lib/bodies.ts';
import { useSolarSystemRenderer } from '../hooks/useSolarSystemRenderer.ts';
import { useCursorControls3D } from '../hooks/useCursorControls3D.ts';
import { CelestialBody } from '../lib/types.ts';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const systemStateRef = useRef(SOLAR_SYSTEM_INITIAL_STATE);
  const {
    containerRef,
    rendererRef,
    canvasRef,
    initialize: initializeRender,
    // add: addRender,
    update: updateRender,
    reset: resetRender,
  } = useSolarSystemRenderer();

  const updateState = useCallback(
    (newState: Partial<AppState>) => {
      setAppState(prev => clampState({ ...prev, ...newState }));
    },
    [setAppState]
  );

  function addBody(body: CelestialBody) {
    console.error('unimplemented for now', body);
    /* TODO
    const systemState = systemStateRef.current;
    if (systemState == null || systemState[body.name] != null) return;
    const bodyState = getInitialState(systemState, body);
    // TODO: support adding bodies that are not satellites of the Sun?
    // TODO: this may be clobbered by animation frame
    systemStateRef.current = { ...systemState, satellites: [...systemState.satellites, bodyState] };
    addRender(appState, systemState, bodyState);
     */
  }

  const cursorControls = useCursorControls3D(rendererRef.current, appState, updateState);

  const resetState = useCallback(() => {
    console.log('resetState called');
    updateState(initialState);
    systemStateRef.current = getInitialState(SOLAR_SYSTEM);
    resetRender(appState, systemStateRef.current);
  }, [updateState]);

  // set the mutable state ref (accessed by animation callback) on state update
  useEffect(() => {
    appStateRef.current = appState;
  }, [JSON.stringify(appState)]);

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    const { play, dt } = appStateRef.current;
    setAppState(prev => ({
      ...prev,
      time: play ? prev.time + dt : prev.time,
      metersPerPx: rendererRef.current?.getMetersPerPixel() ?? prev.metersPerPx,
      vernalEquinox: rendererRef?.current?.getVernalEquinox() ?? prev.vernalEquinox,
    }));
    if (play) {
      systemStateRef.current = incrementState(systemStateRef.current, dt);
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx != null) {
      updateRender(ctx, appStateRef.current, systemStateRef.current);
    }
    window.requestAnimationFrame(animationFrame);
  }

  useEffect(() => {
    const frameId = window.requestAnimationFrame(animationFrame);
    initializeRender(appStateRef.current, systemStateRef.current);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <Box ref={containerRef} pos="absolute" top={0} right={0} {...cursorControls} />
      <canvas
        ref={canvasRef}
        style={{ height: '100vh', width: '100vw', position: 'absolute', pointerEvents: 'none' }}
      />
      <Controls
        state={appState}
        addBody={addBody}
        updateState={updateState}
        systemState={systemStateRef.current}
        reset={resetState}
      />
    </Group>
  );
}
