import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Group, Stack } from '@mantine/core';
import { AppState, clampState, initialState } from '../lib/state.ts';
import { Controls } from './Controls/Controls.tsx';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { useCursorControls } from '../hooks/useCursorControls.ts';
import { CelestialBody } from '../lib/types.ts';
import { FactSheet } from './FactSheet/FactSheet.tsx';

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

  const cursorControls = useCursorControls(model.modelRef.current, appState, updateState);

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
      metersPerPx: model.modelRef.current?.getMetersPerPixel() ?? metersPerPx,
      vernalEquinox: model.modelRef?.current?.getVernalEquinox() ?? vernalEquinox,
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

  useEffect(() => {
    model.resize();
  }, [appState.center]);

  const focusBody = useMemo(
    () => appState.bodies.find(body => body.name === appState.center),
    [appState.center, JSON.stringify(appState.bodies)]
  );

  const isMobile = window.innerWidth < 1080;
  const LayoutComponent = isMobile ? Stack : Group;
  return (
    // TODO: vh units are mobile-unfriendly; may need to update approach
    <LayoutComponent gap={0} w="100vw" h="100vh" flex={1}>
      <Box pos="relative" w="100%" h="100vh" flex={1}>
        <Box
          style={{ cursor: appState.hover != null ? 'pointer' : 'unset' }}
          ref={model.containerRef}
          pos="absolute"
          w="100%"
          h="100%"
          {...cursorControls}
        />
        <canvas
          ref={model.canvasRef}
          style={{ height: '100%', width: '100%', position: 'absolute', pointerEvents: 'none' }}
        />
        <Controls
          state={appState}
          updateState={updateState}
          addBody={addBody}
          removeBody={removeBody}
          reset={resetState}
        />
      </Box>
      {focusBody != null && (
        <Box
          h={isMobile ? '50vh' : '100vh'}
          style={{
            borderLeft: isMobile ? undefined : `1px solid ${focusBody.color}`,
            borderTop: isMobile ? `1px solid ${focusBody.color}` : undefined,
          }}
        >
          <FactSheet
            key={focusBody.name}
            body={focusBody}
            bodies={appState.bodies}
            updateState={updateState}
            width={isMobile ? undefined : 600}
          />
        </Box>
      )}
    </LayoutComponent>
  );
}
