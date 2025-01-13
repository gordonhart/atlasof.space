import { Box } from '@mantine/core';
import { useIsSmallDisplay } from '../../hooks/useIsSmallDisplay.ts';
import { ModelState, Settings, UpdateSettings } from '../../lib/state.ts';
import { Epoch } from '../../lib/types.ts';
import { GeneralControls } from './GeneralControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { TimeControls } from './TimeControls.tsx';

const pad = 10;

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
  model: ModelState;
  setEpoch: (epoch: Epoch) => void;
  reset: () => void;
};
export function Controls({ settings, updateSettings, model, setEpoch, reset }: Props) {
  const isSmallDisplay = useIsSmallDisplay();
  return (
    <>
      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls settings={settings} updateSettings={updateSettings} model={model} setEpoch={setEpoch} />
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
