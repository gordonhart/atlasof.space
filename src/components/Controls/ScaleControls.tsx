import { Group } from '@mantine/core';
import { memo } from 'react';
import { buttonGap } from './constants.ts';
import { DirectionIndicator } from './DirectionIndicator.tsx';
import { ScaleIndicator } from './ScaleIndicator.tsx';

export const ScaleControls = memo(function ScaleControlsComponent() {
  return (
    <Group gap={buttonGap} align="flex-end">
      <ScaleIndicator />
      <DirectionIndicator />
    </Group>
  );
});
