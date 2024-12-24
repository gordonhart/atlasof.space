import { buttonGap } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { memo } from 'react';
import { AppState } from '../../lib/state.ts';
import { Stack } from '@mantine/core';
import { DirectionIndicator } from './DirectionIndicator.tsx';

type Props = Pick<AppState, 'metersPerPx' | 'vernalEquinox'>;
export const ScaleControls = memo(function ScaleControlsComponent({ metersPerPx, vernalEquinox }: Props) {
  return (
    <Stack gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={metersPerPx} />
      <DirectionIndicator vernalEquinox={vernalEquinox} />
    </Stack>
  );
});
