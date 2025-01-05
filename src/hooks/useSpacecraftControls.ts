import { useCallback, useEffect } from 'react';
import { UpdateSettings } from '../lib/state.ts';
import { SpacecraftControls } from '../lib/types.ts';

export function useSpacecraftControls(updateSettings: UpdateSettings) {
  const updateSpacecraftControls = useCallback(
    (updateFn: (prev: SpacecraftControls) => Partial<SpacecraftControls>) => {
      updateSettings(prev => {
        const { spacecraft } = prev;
        if (spacecraft == null) return prev;
        const { controls } = spacecraft;
        return { ...prev, spacecraft: { ...spacecraft, controls: { ...controls, ...updateFn(controls) } } };
      });
    },
    [updateSettings]
  );
  const toggleFire = useCallback(
    (pressed: boolean) => updateSpacecraftControls(() => ({ fire: pressed })),
    [updateSpacecraftControls]
  );

  const toggleLaunch = useCallback(
    (pressed: boolean) => updateSpacecraftControls(() => ({ launch: pressed })),
    [updateSpacecraftControls]
  );

  const rotate = useCallback(
    (rotate: Exclude<SpacecraftControls['rotate'], null>) => {
      return function handleRotate(pressed: boolean) {
        updateSpacecraftControls(() => ({ rotate: pressed ? rotate : null }));
      };
    },
    [updateSpacecraftControls]
  );

  // hand-roll effect to listen to both keyup and keydown events
  useEffect(() => {
    const hotkeys: Array<[string, (pressed: boolean) => void]> = [
      ['f', toggleFire],
      ['l', toggleLaunch],
      ['ArrowLeft', rotate('port')],
      ['ArrowRight', rotate('starboard')],
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
  }, [toggleFire, toggleLaunch, rotate]);
}
