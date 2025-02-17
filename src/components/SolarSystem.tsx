import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCursorControls } from '../hooks/useCursorControls.ts';
import { useDisplaySize } from '../hooks/useDisplaySize.ts';
import { useFocusItem } from '../hooks/useFocusItem.ts';
import { useSolarSystemModel } from '../hooks/useSolarSystemModel.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { initialState, itemIdAsRoute, useAppState } from '../lib/state.ts';
import { Controls } from './Controls/Controls.tsx';
import { FactSheet } from './FactSheet/FactSheet.tsx';

export function SolarSystem() {
  const navigate = useNavigate();
  const { center: urlCenter } = useUrlState();
  const { sm: isSmallDisplay } = useDisplaySize();
  const center = useAppState(state => state.settings.center);
  const hover = useAppState(state => state.settings.hover);
  const updateModel = useAppState(state => state.updateModel);
  const updateSettings = useAppState(state => state.updateSettings);
  const resetAppState = useAppState(state => state.reset);
  const model = useSolarSystemModel();
  const cursorControls = useCursorControls(model.modelRef.current);
  const focusItem = useFocusItem();

  // TODO: avoid setting hover when using touch device
  // const isTouchDevice = useIsTouchDevice();
  // TODO: fix URL state initialization and syncing
  const urlInitialState = { ...initialState, settings: { ...initialState.settings, center: urlCenter } };

  // sync URL to center
  useEffect(() => {
    if (center !== urlCenter) updateSettings({ center: urlCenter });
  }, [urlCenter]);

  // sync center back to URL when state changes are initiated by non-URL source
  useEffect(() => {
    if (center !== urlCenter) navigate(itemIdAsRoute(center));
  }, [center]);

  const reset = useCallback(() => {
    const newState = resetAppState();
    model.reset(newState.settings);
  }, [resetAppState]);

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    const newModelState = model.modelRef.current?.getModelState();
    if (newModelState != null) updateModel(newModelState);
    const ctx = model.canvasRef.current?.getContext('2d');
    if (ctx != null) {
      model.update(ctx);
    }
    window.requestAnimationFrame(animationFrame);
  }

  useEffect(() => {
    updateSettings(urlInitialState.settings);
    model.initialize(urlInitialState.settings);
    const frameId = window.requestAnimationFrame(animationFrame);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const LayoutComponent = isSmallDisplay ? Stack : Group;
  return (
    <LayoutComponent gap={0} w="100vw" h="100dvh" flex={1}>
      <Box pos="relative" w="100%" h="100dvh" flex={1}>
        <Box
          style={{ cursor: hover != null ? 'pointer' : 'unset' }}
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
        <Controls setEpoch={model.setEpoch} reset={reset} />
      </Box>
      {focusItem != null && (
        <Box
          h={isSmallDisplay ? '60dvh' : '100dvh'}
          w={isSmallDisplay ? undefined : 600}
          style={{
            borderLeft: isSmallDisplay ? undefined : `1px solid ${focusItem.color}`,
            borderTop: isSmallDisplay ? `1px solid ${focusItem.color}` : undefined,
          }}
        >
          <FactSheet
            key={focusItem.item.id} // rerender when focus item changes
            item={focusItem}
            addBody={model.addBody}
            removeBody={model.removeBody}
          />
        </Box>
      )}
    </LayoutComponent>
  );
}
