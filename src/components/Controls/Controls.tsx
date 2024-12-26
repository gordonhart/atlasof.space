import { Box } from '@mantine/core';
import { FocusControls } from './FocusControls.tsx';
import { GeneralControls } from './GeneralControls.tsx';
import { TimeControls } from './TimeControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { AppStateControlProps } from './constants.ts';
import { CelestialBody } from '../../lib/types.ts';
import { SelectControls } from './SelectControls.tsx';

const pad = 10;

type Props = AppStateControlProps & {
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
  reset: () => void;
};
export function Controls({ state, updateState, addBody, removeBody, reset }: Props) {
  return (
    <>
      <Box pos="absolute" top={pad} left={pad}>
        <FocusControls center={state.center} hover={state.hover} bodies={state.bodies} updateState={updateState} />
      </Box>

      <Box pos="absolute" top={pad} left="50%" right="50%">
        <SelectControls />
      </Box>

      <Box pos="absolute" top={pad} right={pad}>
        <ScaleControls metersPerPx={state.metersPerPx} vernalEquinox={state.vernalEquinox} />
      </Box>

      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls state={state} updateState={updateState} />
      </Box>

      <Box pos="absolute" bottom={pad} right={pad}>
        <GeneralControls
          state={state}
          updateState={updateState}
          addBody={addBody}
          removeBody={removeBody}
          reset={reset}
        />
      </Box>
    </>
  );
}
