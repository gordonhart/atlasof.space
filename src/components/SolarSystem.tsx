import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState.ts';
import { useCursorControls } from '../hooks/useCursorControls.ts';
import { useDisplaySize } from '../hooks/useDisplaySize.ts';
import { useFocusItem } from '../hooks/useFocusItem.ts';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { Controls } from './Controls/Controls.tsx';
import { FactSheet } from './FactSheet/FactSheet.tsx';

export function SolarSystem() {
  const { sm: isSmallDisplay } = useDisplaySize();
  const { appState, setAppState, appStateRef, updateSettings, resetAppState } = useAppState();
  const { settings } = appState;
  const model = useSolarSystemModel({ settings, updateSettings });
  const cursorControls = useCursorControls(model.modelRef.current, settings, updateSettings);
  const { focusItem, focusColor } = useFocusItem(settings);

  const reset = useCallback(() => {
    const newState = resetAppState();
    model.reset(newState.settings);
  }, [resetAppState]);

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
          setEpoch={model.setEpoch}
          reset={reset}
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
            addBody={model.addBody}
            removeBody={model.removeBody}
          />
        </Box>
      )}
    </LayoutComponent>
  );
}
