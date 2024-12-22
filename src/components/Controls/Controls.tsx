import { Box } from '@mantine/core';
import { FocusControls } from './FocusControls.tsx';
import { CelestialBodyState } from '../../lib/types.ts';
import { GeneralControls } from './GeneralControls.tsx';
import { PanControls } from './PanControls.tsx';
import { TimeControls } from './TimeControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { AppStateControlProps } from './constants.ts';

const pad = 10;

type Props = AppStateControlProps & {
  systemState: CelestialBodyState;
  reset: () => void;
};
export function Controls({ state, updateState, systemState, reset }: Props) {
  return (
    <>
      <Box pos="absolute" top={pad} left={pad}>
        <FocusControls center={state.center} hover={state.hover} updateState={updateState} systemState={systemState} />
      </Box>

      <Box pos="absolute" top={pad} right={pad}>
        <ScaleControls metersPerPx={state.metersPerPx} updateState={updateState} />
      </Box>

      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls state={state} updateState={updateState} />
      </Box>

      <Box pos="absolute" bottom={pad} left="50%">
        <PanControls offset={state.offset} metersPerPx={state.metersPerPx} updateState={updateState} />
      </Box>

      <Box pos="absolute" bottom={pad} right={pad}>
        <GeneralControls state={state} updateState={updateState} systemState={systemState} reset={reset} />
      </Box>
    </>
  );
}
