import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { memo } from 'react';
import { AppState } from '../../lib/state.ts';

type Props = Pick<AppStateControlProps, 'updateState'> & Pick<AppState, 'metersPerPx'>;
export const ScaleControls = memo(function ScaleControlsComponent({ metersPerPx, updateState }: Props) {
  return (
    <Stack gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={metersPerPx} />

      <Stack gap={buttonGap}>
        <Tooltip position="left" label="Zoom In">
          <ActionIcon onClick={() => updateState({ metersPerPx: metersPerPx / 2 })}>
            <IconPlus size={iconSize} />
          </ActionIcon>
        </Tooltip>
        <Tooltip position="left" label="Zoom Out">
          <ActionIcon onClick={() => updateState({ metersPerPx: metersPerPx * 2 })}>
            <IconMinus size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    </Stack>
  );
});
