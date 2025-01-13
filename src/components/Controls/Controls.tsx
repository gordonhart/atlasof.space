import { Box } from '@mantine/core';
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
  return (
    <>
      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls settings={settings} updateSettings={updateSettings} model={model} setEpoch={setEpoch} />
      </Box>

      <Box pos="absolute" bottom={pad} right={pad}>
        <GeneralControls settings={settings} updateSettings={updateSettings} reset={reset} />
      </Box>

      <Box pos="absolute" right={pad} top={pad}>
        <ScaleControls metersPerPx={model.metersPerPx} vernalEquinox={model.vernalEquinox} />
      </Box>
    </>
  );
}
