import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCursorControls } from '../hooks/useCursorControls.ts';
import { useIsSmallDisplay } from '../hooks/useIsSmallDisplay.ts';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { DEFAULT_ASTEROID_COLOR } from '../lib/bodies.ts';
import { ORBITAL_REGIMES } from '../lib/regimes.ts';
import { initialState, UpdateSettings } from '../lib/state.ts';
import { CelestialBody, isCelestialBody } from '../lib/types.ts';
import { Controls } from './Controls/Controls.tsx';
import { FactSheet } from './FactSheet/FactSheet.tsx';

export function SolarSystem() {
  const { id } = useParams();
  const [appState, setAppState] = useState({
    ...initialState,
    settings: { ...initialState.settings, center: id ?? null },
  });
  const appStateRef = useRef(appState);
  const model = useSolarSystemModel();
  const isSmallDisplay = useIsSmallDisplay();
  const navigate = useNavigate();
  const { settings } = appState;

  const updateSettings: UpdateSettings = useCallback(
    update => {
      setAppState(prev => {
        const updated = typeof update === 'function' ? update(prev.settings) : { ...prev.settings, ...update };
        const newState = { ...prev, settings: updated };
        // set the mutable state ref (accessed by animation callback) on state update
        appStateRef.current = newState;
        return newState;
      });
    },
    [setAppState]
  );

  // sync center back to URL
  useEffect(() => {
    navigate(`/${settings.center ?? ''}`);
  }, [settings.center]);

  const cursorControls = useCursorControls(model.modelRef.current, settings, updateSettings);

  function addBody(body: CelestialBody) {
    updateSettings(prev => {
      model.add(prev, body);
      return { ...prev, bodies: [...prev.bodies, body] };
    });
  }

  function removeBody(name: string) {
    updateSettings(prev => ({ ...prev, bodies: prev.bodies.filter(b => b.name !== name) }));
    model.remove(name);
  }

  const resetState = useCallback(() => {
    setAppState(initialState);
    appStateRef.current = initialState;
    model.reset(initialState.settings);
  }, [updateSettings]);

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    setAppState(prev => {
      const newModel = model.modelRef.current?.getModelState() ?? prev.model;
      const newState = { ...prev, model: newModel };
      appStateRef.current = newState;
      return newState;
    });
    const ctx = model.canvasRef.current?.getContext('2d');
    if (ctx != null) {
      model.update(ctx, appStateRef.current.settings);
    }
    window.requestAnimationFrame(animationFrame);
  }

  useEffect(() => {
    const frameId = window.requestAnimationFrame(animationFrame);
    model.initialize(appStateRef.current.settings);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    model.resize();
  }, [settings.center]);

  const focusItem = useMemo(() => {
    const focusBody = settings.bodies.find(body => body.id === settings.center);
    const focusRegime = ORBITAL_REGIMES.find(({ regime }) => regime === settings.center);
    return focusBody ?? focusRegime;
  }, [settings.center, JSON.stringify(settings.bodies)]);
  const focusColor = isCelestialBody(focusItem) ? focusItem.color : DEFAULT_ASTEROID_COLOR;

  const LayoutComponent = isSmallDisplay ? Stack : Group;
  return (
    <LayoutComponent gap={0} w="100vw" h="100dvh" flex={1}>
      <Box pos="relative" w="100%" h="100dvh" flex={1}>
        <Box
          style={{ cursor: settings.hover != null ? 'pointer' : 'unset' }}
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
        <Controls settings={settings} updateSettings={updateSettings} model={appState.model} reset={resetState} />
      </Box>
      {focusItem != null && (
        <Box
          h={isSmallDisplay ? '50dvh' : '100dvh'}
          w={isSmallDisplay ? undefined : 600}
          style={{
            borderLeft: isSmallDisplay ? undefined : `1px solid ${focusColor}`,
            borderTop: isSmallDisplay ? `1px solid ${focusColor}` : undefined,
          }}
        >
          <FactSheet
            key={isCelestialBody(focusItem) ? focusItem.id : focusItem.regime} // rerender when focus item changes
            item={focusItem}
            settings={settings}
            updateSettings={updateSettings}
            addBody={addBody}
            removeBody={removeBody}
          />
        </Box>
      )}
    </LayoutComponent>
  );
}
