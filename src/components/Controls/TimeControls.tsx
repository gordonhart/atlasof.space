import { ActionIcon, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop, IconPlayerTrackNext, IconPlayerTrackPrev } from '@tabler/icons-react';
import { memo } from 'react';
import { dateToHumanReadable, epochToDate } from '../../lib/epoch.ts';
import { ModelState, Settings, UpdateSettings } from '../../lib/state.ts';
import { buttonGap, iconSize } from './constants.ts';

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
  model: ModelState;
};
export const TimeControls = memo(function TimeControlsComponent({ settings, updateSettings, model }: Props) {
  const date = new Date(Number(epochToDate(settings.epoch)) + model.time * 1000);

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
            <Text inherit>{settings.playbackSpeed.toLocaleString()}x</Text>
          </Group>
          <Group gap={8}>
            <Group justify="flex-end" w={36}>
              <Text inherit c="dimmed">
                fps
              </Text>
            </Group>
            <Text inherit>{model.fps?.toFixed(0)}</Text>
          </Group>
        </Stack>
      </Paper>

      <Group gap={buttonGap} align="flex-end">
        <Tooltip label="Slow Down">
          <ActionIcon
            onClick={() =>
              updateSettings(({ playbackSpeed, ...prev }) => {
                const next = playbackSpeed > 0 ? (playbackSpeed <= 1 ? -1 : playbackSpeed / 10) : playbackSpeed * 10;
                return { ...prev, playbackSpeed: next };
              })
            }
          >
            <IconPlayerTrackPrev size={iconSize} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={settings.play ? 'Stop' : 'Start'}>
          <ActionIcon onClick={() => updateSettings({ play: !settings.play })}>
            {settings.play ? <IconPlayerStop size={iconSize} /> : <IconPlayerPlay size={iconSize} />}
          </ActionIcon>
        </Tooltip>
        <Tooltip position="right" label="Speed Up">
          <ActionIcon
            onClick={() => {
              updateSettings(({ playbackSpeed, ...prev }) => {
                const next = playbackSpeed < 0 ? (playbackSpeed >= -1 ? 1 : playbackSpeed / 10) : playbackSpeed * 10;
                return { ...prev, playbackSpeed: next };
              });
            }}
          >
            <IconPlayerTrackNext size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  );
});
