import { buttonGap } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { memo } from 'react';
import { AppState } from '../../lib/state.ts';
import { DirectionIndicator } from './DirectionIndicator.tsx';
import { Group } from '@mantine/core';

type Props = Pick<AppState, 'metersPerPx' | 'vernalEquinox'>;
export const ScaleControls = memo(function ScaleControlsComponent({ metersPerPx, vernalEquinox }: Props) {
  return (
    <Group gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={metersPerPx} />
      <DirectionIndicator vernalEquinox={vernalEquinox} />
    </Group>
  );
});
