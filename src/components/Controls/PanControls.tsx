import { ActionIcon, Group, Stack, Tooltip } from '@mantine/core';
import { IconCaretDownFilled, IconCaretLeftFilled, IconCaretRightFilled, IconCaretUpFilled } from '@tabler/icons-react';
import { buttonGap, iconSize, AppStateControlProps } from './constants.ts';
import { useHotkeys } from '@mantine/hooks';

const movePx = 10;

export function PanControls({ state, updateState }: AppStateControlProps) {
  function applyOffset(rightPx: number, upPx: number) {
    const newOffsetX = state.offset[0] - rightPx * state.metersPerPx;
    const newOffsetY = state.offset[1] - upPx * state.metersPerPx;
    updateState({ offset: [newOffsetX, newOffsetY] });
  }

  useHotkeys([
    ['ArrowLeft', () => applyOffset(-movePx, 0)],
    ['ArrowUp', () => applyOffset(0, movePx)],
    ['ArrowDown', () => applyOffset(0, -movePx)],
    ['ArrowRight', () => applyOffset(movePx, 0)],
  ]);

  return (
    <Group gap={buttonGap} wrap="nowrap" align="flex-end" style={{ transform: 'translate(-50%, 0)' }}>
      <Tooltip label="Pan Left">
        <ActionIcon onClick={() => applyOffset(-movePx, 0)}>
          <IconCaretLeftFilled size={iconSize} />
        </ActionIcon>
      </Tooltip>
      <Stack gap={buttonGap}>
        <Tooltip label="Pan Up">
          <ActionIcon onClick={() => applyOffset(0, movePx)}>
            <IconCaretUpFilled size={iconSize} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Pan Down">
          <ActionIcon onClick={() => applyOffset(0, -movePx)}>
            <IconCaretDownFilled size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Stack>
      <Tooltip label="Pan Right">
        <ActionIcon onClick={() => applyOffset(movePx, 0)}>
          <IconCaretRightFilled size={iconSize} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
