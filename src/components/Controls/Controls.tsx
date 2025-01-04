import { Box } from '@mantine/core';
import { GeneralControls } from './GeneralControls.tsx';
import { TimeControls } from './TimeControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { SettingsControlProps } from './constants.ts';
import { useIsSmallDisplay } from '../../hooks/useIsSmallDisplay.ts';
import { ModelState } from '../../lib/state.ts';

const pad = 10;

type Props = SettingsControlProps & {
  model: ModelState;
  reset: () => void;
};
export function Controls({ settings, updateSettings, model, reset }: Props) {
  const isSmallDisplay = useIsSmallDisplay();
  return (
    <>
      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls settings={settings} updateSettings={updateSettings} />
      </Box>

      <Box
        pos="absolute"
        bottom={pad}
        {...(isSmallDisplay ? { right: pad } : { left: '50%', style: { transform: 'translate(-50%, 0)' } })}
      >
        <GeneralControls settings={settings} updateSettings={updateSettings} reset={reset} />
      </Box>

      <Box pos="absolute" right={pad} {...(isSmallDisplay ? { top: pad } : { bottom: pad })}>
        <ScaleControls metersPerPx={model.metersPerPx} vernalEquinox={model.vernalEquinox} />
      </Box>
    </>
  );
}
