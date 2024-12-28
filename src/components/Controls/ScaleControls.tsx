import { buttonGap } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { memo } from 'react';
import { AppState } from '../../lib/state.ts';
import { DirectionIndicator } from './DirectionIndicator.tsx';
import { Stack } from '@mantine/core';

type Props = Pick<AppState, 'metersPerPx' | 'vernalEquinox'>;
export const ScaleControls = memo(function ScaleControlsComponent({ metersPerPx, vernalEquinox }: Props) {
  return (
    <Stack gap={buttonGap} align="flex-end">
      <DirectionIndicator vernalEquinox={vernalEquinox} />
      <ScaleIndicator metersPerPx={metersPerPx} />
    </Stack>
  );
});
