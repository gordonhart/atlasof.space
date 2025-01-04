import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCursorControls } from '../hooks/useCursorControls.ts';
import { useIsSmallDisplay } from '../hooks/useIsSmallDisplay.ts';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { DEFAULT_ASTEROID_COLOR } from '../lib/bodies.ts';
import { ORBITAL_REGIMES } from '../lib/regimes.ts';
import { clampSettings, initialState, UpdateSettings } from '../lib/state.ts';
import { CelestialBody } from '../lib/types.ts';
import { Controls } from './Controls/Controls.tsx';
import { FactSheet } from './FactSheet/FactSheet.tsx';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const model = useSolarSystemModel();
  const isSmallDisplay = useIsSmallDisplay();
  const { settings } = appState;

  const updateSettings: UpdateSettings = useCallback(
    update => {
      setAppState(prev => {
        const updated = typeof update === 'function' ? update(prev.settings) : { ...prev.settings, ...update };
        const newState = { ...prev, settings: clampSettings(updated) };
        // set the mutable state ref (accessed by animation callback) on state update
        appStateRef.current = newState;
        return newState;
      });
    },
    [setAppState]
  );

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
      const newModel = {
        time: prev.settings.play ? prev.model.time + prev.settings.dt : prev.model.time,
        metersPerPx: model.modelRef.current?.getMetersPerPixel() ?? prev.model.metersPerPx,
        vernalEquinox: model.modelRef?.current?.getVernalEquinox() ?? prev.model.vernalEquinox,
      };
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

  const focusBody = useMemo(
    () => settings.bodies.find(body => body.name === settings.center),
    [settings.center, JSON.stringify(settings.bodies)]
  );
  const focusRegime = useMemo(() => ORBITAL_REGIMES.find(({ name }) => name === settings.center), [settings.center]);

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
      {(focusBody != null || focusRegime != null) && (
        <Box
          h={isSmallDisplay ? '50dvh' : '100dvh'}
          w={isSmallDisplay ? undefined : 600}
          style={{
            borderLeft: isSmallDisplay ? undefined : `1px solid ${focusBody?.color ?? DEFAULT_ASTEROID_COLOR}`,
            borderTop: isSmallDisplay ? `1px solid ${focusBody?.color ?? DEFAULT_ASTEROID_COLOR}` : undefined,
          }}
        >
          <FactSheet
            key={focusBody?.name ?? focusRegime?.name} // ensure that the component is rerendered when focus changes
            body={focusBody}
            regime={focusRegime}
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
