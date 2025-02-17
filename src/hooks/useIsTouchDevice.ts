import { useOs } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { useAppState } from '../lib/state.ts';

export function useIsTouchDevice() {
  const updateSettings = useAppState(state => state.updateSettings);
  const os = useOs();
  const isTouchDevice = useMemo(() => os === 'ios' || os === 'android', [os]);

  useEffect(() => {
    updateSettings({ isTouchDevice });
  }, [isTouchDevice]);

  return isTouchDevice;
}
