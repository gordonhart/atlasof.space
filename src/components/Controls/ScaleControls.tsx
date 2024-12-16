import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { IconMinus, IconPlus } from '@tabler/icons-react';

export function ScaleControls({ state, updateState }: AppStateControlProps) {
  return (
    <Stack gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={state.metersPerPx} />

      <Stack gap={buttonGap}>
        <Tooltip position="left" label="Zoom In">
          <ActionIcon onClick={() => updateState({ metersPerPx: state.metersPerPx / 2 })}>
            <IconPlus size={iconSize} />
          </ActionIcon>
        </Tooltip>
        <Tooltip position="left" label="Zoom Out">
          <ActionIcon onClick={() => updateState({ metersPerPx: state.metersPerPx * 2 })}>
            <IconMinus size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
