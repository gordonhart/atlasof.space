import { Group } from '@mantine/core';
import { buttonGap } from './constants.ts';
import { DirectionIndicator } from './DirectionIndicator.tsx';
import { ScaleIndicator } from './ScaleIndicator.tsx';

export function ScaleControls() {
  return (
    <Group gap={buttonGap} align="flex-end">
      <ScaleIndicator />
      <DirectionIndicator />
    </Group>
  );
}
