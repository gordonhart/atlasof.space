import { Group } from '@mantine/core';
import { memo } from 'react';
import { useAppState } from '../../hooks/useAppState.ts';
import { buttonGap } from './constants.ts';
import { DirectionIndicator } from './DirectionIndicator.tsx';
import { ScaleIndicator } from './ScaleIndicator.tsx';

export const ScaleControls = memo(function ScaleControlsComponent() {
  const { model } = useAppState();
  return (
    <Group gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={model.metersPerPx} />
      <DirectionIndicator vernalEquinox={model.vernalEquinox} />
    </Group>
  );
});
