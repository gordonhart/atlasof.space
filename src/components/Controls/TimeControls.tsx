import { ActionIcon, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from '@tabler/icons-react';
import { useMemo } from 'react';

export function TimeControls({ state, updateState }: AppStateControlProps) {
  const [t, tUnits] = humanTimeUnits(state.time);
  const [dt, dtUnits] = useMemo(() => humanTimeUnits(state.dt), [state.dt]);

  return (
    <Stack gap={4}>
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

      <Group gap={buttonGap} align="flex-end">
        <Tooltip label="Slow Down">
          <ActionIcon onClick={() => updateState({ dt: state.dt / 2 })}>
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
  );
}
