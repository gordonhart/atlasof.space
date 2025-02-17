import { Box } from '@mantine/core';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { Epoch } from '../../lib/types.ts';
import { GeneralControls } from './GeneralControls.tsx';
import { ScaleControls } from './ScaleControls.tsx';
import { TimeControls } from './TimeControls.tsx';

type Props = {
  setEpoch: (epoch: Epoch) => void;
};
export function Controls({ setEpoch }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const pad = isXsDisplay ? 6 : 10;
  return (
    <>
      <Box pos="absolute" bottom={pad} left={pad}>
        <TimeControls setEpoch={setEpoch} />
      </Box>

      <Box pos="absolute" left={pad} top={pad}>
        <GeneralControls />
      </Box>

      <Box pos="absolute" right={pad} top={pad}>
        <ScaleControls />
      </Box>
    </>
  );
}
