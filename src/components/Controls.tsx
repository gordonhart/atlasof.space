import { AppState } from '../lib/state.ts';
import { ActionIcon, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import {
  IconCaretDownFilled,
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconMinus,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconPlus,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { humanTimeUnits, pluralize } from '../lib/utils.ts';
import { useHotkeys } from '@mantine/hooks';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { FocusControls } from './FocusControls.tsx';
import { CelestialBodyState } from '../lib/types.ts';
import { GeneralControls } from './GeneralControls.tsx';

const iconSize = 14;
const movePx = 10;
const pad = 10;

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
  systemState: CelestialBodyState;
  reset: () => void;
};
export function Controls({ state, updateState, systemState, reset }: Props) {
  const [t, tUnits] = humanTimeUnits(state.time);
  const [dt, dtUnits] = useMemo(() => humanTimeUnits(state.dt), [state.dt]);

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
    <>
      <Group pos="absolute" top={pad} left={pad} gap={2}>
        <FocusControls state={state} updateState={updateState} systemState={systemState} />
      </Group>

      <Stack pos="absolute" top={pad} right={pad} gap={2} align="flex-end">
        <ScaleIndicator metersPerPx={state.metersPerPx} />

        <Stack gap={2}>
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

      <Group
        pos="absolute"
        bottom={pad}
        left="50%"
        gap={2}
        wrap="nowrap"
        align="flex-end"
        style={{ transform: 'translate(-50%, 0)' }}
      >
        <Tooltip label="Pan Left">
          <ActionIcon onClick={() => applyOffset(-movePx, 0)}>
            <IconCaretLeftFilled size={iconSize} />
          </ActionIcon>
        </Tooltip>
        <Stack gap={2}>
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

      <Stack pos="absolute" bottom={pad} left={pad} gap={4}>
        <Paper radius="md">
          <Stack gap={2} fz="xs">
            <Group gap={8}>
              <Group justify="flex-end" w={20}>
                <Text inherit c="dimmed">
                  t
                </Text>
              </Group>
              <Text inherit>{pluralize(Number(t.toFixed(0)), tUnits)}</Text>
            </Group>
            <Group gap={8}>
              <Group justify="flex-end" w={20}>
                <Text inherit c="dimmed">
                  ∆t
                </Text>
              </Group>
              <Text inherit>{pluralize(dt, dtUnits)}</Text>
            </Group>
          </Stack>
        </Paper>

        <Group gap={2} align="flex-end">
          <Tooltip label="Slow Down">
            <ActionIcon onClick={() => updateState({ dt: Math.max(state.dt / 2, 1) })}>
              <IconPlayerTrackPrevFilled size={iconSize} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={state.play ? 'Stop' : 'Start'}>
            <ActionIcon onClick={() => updateState({ play: !state.play })}>
              {state.play ? <IconPlayerStopFilled size={iconSize} /> : <IconPlayerPlayFilled size={iconSize} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip position="right" label="Speed Up">
            <ActionIcon onClick={() => updateState({ dt: state.dt * 2 })}>
              <IconPlayerTrackNextFilled size={iconSize} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>

      <Stack pos="absolute" bottom={pad} right={pad} gap={2}>
        <GeneralControls state={state} updateState={updateState} reset={reset} />
      </Stack>
    </>
  );
}
