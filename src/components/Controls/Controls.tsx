import { Box } from '@mantine/core';
import { memo, useMemo } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { Epoch } from '../../lib/types.ts';
import { GeneralControls } from './GeneralControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { TimeControls } from './TimeControls.tsx';

type Props = {
  setEpoch: (epoch: Epoch) => void;
  reset: () => void;
};
export const Controls = memo(function ControlsComponent({ setEpoch, reset }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const pad = useMemo(() => (isXsDisplay ? 6 : 10), [isXsDisplay]);
  return (
    <>
      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls setEpoch={setEpoch} />
      </Box>

      <Box pos="absolute" left={pad} top={pad}>
        <GeneralControls reset={reset} />
      </Box>

      <Box pos="absolute" right={pad} top={pad}>
        <ScaleControls />
      </Box>
    </>
  );
});
