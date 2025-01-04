import { useCallback, useEffect } from 'react';
import { UpdateSettings } from '../lib/state.ts';

export function useSpacecraftControls(updateSettings: UpdateSettings) {
  const toggleFire = useCallback(
    (pressed: boolean) => {
      updateSettings(prev => {
        const { spacecraft } = prev;
        if (spacecraft == null) return prev;
        return {
          ...prev,
          spacecraft: { ...spacecraft, controls: { ...spacecraft.controls, fire: pressed } },
        };
      });
    },
    [updateSettings]
  );

  const toggleLaunch = useCallback(
    (pressed: boolean) => {
      updateSettings(prev => {
        const { spacecraft } = prev;
        if (spacecraft == null) return prev;
        return {
          ...prev,
          spacecraft: { ...spacecraft, controls: { ...spacecraft.controls, launch: pressed } },
        };
      });
    },
    [updateSettings]
  );

  // hand-roll effect to listen to both keyup and keydown events
  useEffect(() => {
    const hotkeys: Array<[string, (pressed: boolean) => void]> = [
      ['f', toggleFire],
      ['l', toggleLaunch],
    ];

    function handleKeyDown(event: KeyboardEvent) {
      hotkeys.filter(([key]) => event.key === key).forEach(([, toggle]) => toggle(true));
    }

    function handleKeyUp(event: KeyboardEvent) {
      hotkeys.filter(([key]) => event.key === key).forEach(([, toggle]) => toggle(false));
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleFire, toggleLaunch]);
}
