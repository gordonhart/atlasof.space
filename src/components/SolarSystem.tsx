import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCursorControls } from '../hooks/useCursorControls.ts';
import { useDisplaySize } from '../hooks/useDisplaySize.ts';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { ORBITAL_REGIMES } from '../lib/regimes.ts';
import { SPACECRAFT_BY_ID } from '../lib/spacecraft.ts';
import { initialState, itemIdAsRoute, UpdateSettings } from '../lib/state.ts';
import {
  CelestialBody,
  Epoch,
  isCelestialBody,
  isCelestialBodyId,
  isOrbitalRegimeId,
  isSpacecraft,
  isSpacecraftId,
} from '../lib/types.ts';
import { DEFAULT_ASTEROID_COLOR, DEFAULT_SPACECRAFT_COLOR } from '../lib/utils.ts';
import { Controls } from './Controls/Controls.tsx';
import { FactSheet } from './FactSheet/FactSheet.tsx';

export function SolarSystem() {
  const { center: urlCenter } = useUrlState();
  const urlInitialState = { ...initialState, settings: { ...initialState.settings, center: urlCenter } };
  const [appState, setAppState] = useState(urlInitialState);
  const appStateRef = useRef(appState);
  const model = useSolarSystemModel();
  const { sm: isSmallDisplay } = useDisplaySize();
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

  // sync URL to center
  useEffect(() => {
    if (settings.center !== urlCenter) updateSettings({ center: urlCenter });
  }, [urlCenter]);

  // sync center back to URL when state changes are initiated by non-URL source
  useEffect(() => {
    if (settings.center !== urlCenter) navigate(itemIdAsRoute(settings.center));
  }, [settings.center]);

  const cursorControls = useCursorControls(model.modelRef.current, settings, updateSettings);

  function addBody(body: CelestialBody) {
    updateSettings(prev => {
      model.add(prev, body);
      return { ...prev, bodies: [...prev.bodies, body] };
    });
  }

  function removeBody(id: string) {
    updateSettings(prev => ({ ...prev, bodies: prev.bodies.filter(b => b.id !== id) }));
    model.remove(id);
  }

  function setEpoch(epoch: Epoch) {
    updateSettings(prev => {
      const newSettings = { ...prev, epoch };
      model.reset(newSettings, false);
      return newSettings;
    });
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
    return isCelestialBodyId(settings.center)
      ? settings.bodies.find(({ id }) => id === settings.center)
      : isOrbitalRegimeId(settings.center)
        ? ORBITAL_REGIMES.find(({ id }) => id === settings.center)
        : isSpacecraftId(settings.center)
          ? SPACECRAFT_BY_ID[settings.center]
          : undefined;
  }, [settings.center, JSON.stringify(settings.bodies)]);
  const focusColor = isCelestialBody(focusItem)
    ? focusItem.style.fgColor
    : isSpacecraft(focusItem)
      ? DEFAULT_SPACECRAFT_COLOR
      : DEFAULT_ASTEROID_COLOR;

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
        <Controls
          settings={settings}
          updateSettings={updateSettings}
          model={appState.model}
          setEpoch={setEpoch}
          reset={resetState}
        />
      </Box>
      {focusItem != null && (
        <Box
          h={isSmallDisplay ? '60dvh' : '100dvh'}
          w={isSmallDisplay ? undefined : 600}
          style={{
            borderLeft: isSmallDisplay ? undefined : `1px solid ${focusColor}`,
            borderTop: isSmallDisplay ? `1px solid ${focusColor}` : undefined,
          }}
        >
          <FactSheet
            key={focusItem.id} // rerender when focus item changes
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
