import { memo } from 'react';
import { Group } from '@mantine/core';
import { ModelState } from '../../lib/state.ts';
import { buttonGap } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { DirectionIndicator } from './DirectionIndicator.tsx';

type Props = Pick<ModelState, 'metersPerPx' | 'vernalEquinox'>;
export const ScaleControls = memo(function ScaleControlsComponent({ metersPerPx, vernalEquinox }: Props) {
  return (
    <Group gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={metersPerPx} />
      <DirectionIndicator vernalEquinox={vernalEquinox} />
    </Group>
  );
});
