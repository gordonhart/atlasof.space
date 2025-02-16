import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialState, itemIdAsRoute, UpdateSettings } from '../lib/state.ts';
import { useIsTouchDevice } from './useIsTouchDevice.ts';
import { useUrlState } from './useUrlState.ts';

export function useAppState() {
  const { center: urlCenter } = useUrlState();
  const isTouchDevice = useIsTouchDevice();
  const urlInitialState = { ...initialState, settings: { ...initialState.settings, center: urlCenter } };
  const [appState, setAppState] = useState(urlInitialState);
  const appStateRef = useRef(appState);
  const navigate = useNavigate();
  const { settings } = appState;

  const updateSettings: UpdateSettings = useCallback(
    update => {
      setAppState(prev => {
        const updated = typeof update === 'function' ? update(prev.settings) : { ...prev.settings, ...update };
        // disable hover for touch devices; interactions don't work well
        if (isTouchDevice) updated.hover = null;
        const newState = { ...prev, settings: updated };
        // set the mutable state ref (accessed by animation callback) on state update
        appStateRef.current = newState;
        return newState;
      });
    },
    [setAppState, isTouchDevice]
  );

  const resetAppState = useCallback(() => {
    setAppState(initialState);
    appStateRef.current = initialState;
    return initialState;
  }, [updateSettings]);

  // sync URL to center
  useEffect(() => {
    if (settings.center !== urlCenter) updateSettings({ center: urlCenter });
  }, [urlCenter]);

  // sync center back to URL when state changes are initiated by non-URL source
  useEffect(() => {
    if (settings.center !== urlCenter) navigate(itemIdAsRoute(settings.center));
  }, [settings.center]);

  return { appState, setAppState, appStateRef, updateSettings, resetAppState };
}
