import { Box } from '@mantine/core';
import { GeneralControls } from './GeneralControls.tsx';
import { TimeControls } from './TimeControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { AppStateControlProps } from './constants.ts';
import { useIsSmallDisplay } from '../../hooks/useIsSmallDisplay.ts';

const pad = 10;

type Props = AppStateControlProps & {
  reset: () => void;
};
export function Controls({ state, updateState, reset }: Props) {
  const isSmallDisplay = useIsSmallDisplay();
  return (
    <>
      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls state={state} updateState={updateState} />
      </Box>

      <Box
        pos="absolute"
        bottom={pad}
        {...(isSmallDisplay ? { right: pad } : { left: '50%', style: { transform: 'translate(-50%, 0)' } })}
      >
        <GeneralControls state={state} updateState={updateState} reset={reset} />
      </Box>

      <Box pos="absolute" right={pad} {...(isSmallDisplay ? { top: pad } : { bottom: pad })}>
        <ScaleControls metersPerPx={state.metersPerPx} vernalEquinox={state.vernalEquinox} />
      </Box>
    </>
  );
}
