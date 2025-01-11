import { ActionIcon, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop, IconPlayerTrackNext, IconPlayerTrackPrev } from '@tabler/icons-react';
import { memo } from 'react';
import { dateToHumanReadable, epochToDate, Time } from '../../lib/epoch.ts';
import { ModelState, Settings, UpdateSettings } from '../../lib/state.ts';
import { humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { buttonGap, iconSize } from './constants.ts';

const SPEEDS = [Time.SECOND, Time.MINUTE, Time.HOUR, Time.DAY, Time.WEEK, Time.MONTH, Time.YEAR, Time.YEAR * 3];
const FASTEST_SPEED = SPEEDS[SPEEDS.length - 1];

function findNextSpeed(speed: number, direction: 'faster' | 'slower') {
  const speeds = direction === 'faster' ? SPEEDS : [...SPEEDS].reverse();
  return speeds.find(s => (direction === 'faster' ? s > speed : s < speed)) ?? FASTEST_SPEED;
}

function incrementSpeed(speed: number, direction: 'up' | 'down') {
  const isReverse = speed < 0;
  return direction === 'down'
    ? isReverse
      ? -findNextSpeed(Math.abs(speed), 'faster')
      : speed <= 1
        ? -Time.SECOND
        : findNextSpeed(speed, 'slower')
    : isReverse
      ? speed >= -1
        ? Time.SECOND
        : -findNextSpeed(Math.abs(speed), 'slower')
      : findNextSpeed(speed, 'faster');
}

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
  model: ModelState;
};
export const TimeControls = memo(function TimeControlsComponent({ settings, updateSettings, model }: Props) {
  const date = new Date(Number(epochToDate(settings.epoch)) + model.time * 1000);
  const [t, tUnits] = humanTimeUnits(settings.speed, true);

  const slowDownDisabled = settings.speed < 0 && settings.speed <= -FASTEST_SPEED;
  const speedUpDisabled = settings.speed > 0 && settings.speed >= FASTEST_SPEED;
  return (
    <Stack gap={4}>
      <Paper radius="md">
        <Stack gap={2} fz="xs">
          <Group gap={8}>
            <Group justify="flex-end" w={36}>
              <Text inherit c="dimmed">
                date
              </Text>
            </Group>
            <Text inherit>{dateToHumanReadable(date)}</Text>
          </Group>
          <Group gap={8}>
            <Group justify="flex-end" w={36}>
              <Text inherit c="dimmed">
                speed
              </Text>
            </Group>
            <Text inherit>{tUnits === 'second' && t === 1 ? 'realtime' : `${pluralize(t, tUnits)} / second`}</Text>
          </Group>
        </Stack>
      </Paper>

      <Group gap={buttonGap} align="flex-end">
        <Tooltip disabled={slowDownDisabled} position="right" label="Slow Down">
          <ActionIcon
            disabled={slowDownDisabled}
            onClick={() => updateSettings(({ speed, ...prev }) => ({ ...prev, speed: incrementSpeed(speed, 'down') }))}
          >
            <IconPlayerTrackPrev size={iconSize} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={settings.play ? 'Stop' : 'Start'}>
          <ActionIcon onClick={() => updateSettings({ play: !settings.play })}>
            {settings.play ? <IconPlayerStop size={iconSize} /> : <IconPlayerPlay size={iconSize} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip disabled={speedUpDisabled} position="right" label="Speed Up">
          <ActionIcon
            disabled={speedUpDisabled}
            onClick={() => updateSettings(({ speed, ...prev }) => ({ ...prev, speed: incrementSpeed(speed, 'up') }))}
          >
            <IconPlayerTrackNext size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  );
});
