import { ActionIcon, Group, Paper, Stack, Text, Tooltip, Transition } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop, IconPlayerTrackNext, IconPlayerTrackPrev } from '@tabler/icons-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { LABEL_FONT_FAMILY } from '../../lib/canvas.ts';
import { epochToDate, Time } from '../../lib/epoch.ts';
import { ModelState, Settings, UpdateSettings } from '../../lib/state.ts';
import { Epoch } from '../../lib/types.ts';
import { humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { buttonGap, iconSize } from './constants.ts';
import { EpochPopover } from './EpochPopover.tsx';

const SPEEDS = [
  Time.SECOND,
  Time.MINUTE,
  Time.HOUR,
  Time.HOUR * 6,
  Time.HOUR * 12,
  Time.DAY,
  Time.DAY * 3,
  Time.WEEK,
  Time.MONTH,
  Time.MONTH * 3,
  Time.MONTH * 6,
  Time.YEAR,
  Time.YEAR * 2,
  Time.YEAR * 3,
];
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
  setEpoch: (epoch: Epoch) => void;
};
export const TimeControls = memo(function TimeControlsComponent({ settings, updateSettings, model, setEpoch }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const date = new Date(Number(epochToDate(settings.epoch)) + model.time * 1000);
  const dateRounded = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const [t, tUnits] = useMemo(() => humanTimeUnits(settings.speed, true), [settings.speed]);
  const [tUnitsShown, setTUnitsShown] = useState(true);

  useEffect(() => {
    setTUnitsShown(true);
    const timer = setTimeout(() => {
      setTUnitsShown(false);
    }, 5_000);
    return () => {
      clearTimeout(timer);
    };
  }, [t, tUnits]);

  const slowDownDisabled = settings.speed < 0 && settings.speed <= -FASTEST_SPEED;
  const speedUpDisabled = settings.speed > 0 && settings.speed >= FASTEST_SPEED;

  return (
    <Group gap={buttonGap} justify="space-between" align="flex-end">
      <EpochPopover date={dateRounded} setEpoch={setEpoch} />

      <Stack gap={buttonGap} align="flex-end">
        <Transition mounted={!isXsDisplay || tUnitsShown} transition="fade" duration={0} exitDuration={1_000}>
          {styles => (
            <Paper px={4} py={2}>
              <Text style={styles} inherit c="dimmed" fz="xs" ff={LABEL_FONT_FAMILY}>
                {tUnits === 'second' && t === 1 ? 'speed: realtime' : `${pluralize(t, tUnits)} / second`}
              </Text>
            </Paper>
          )}
        </Transition>
        <Group gap={buttonGap}>
          <Tooltip disabled={slowDownDisabled} position="top" label="Slow Down">
            <ActionIcon
              disabled={slowDownDisabled}
              onClick={() =>
                updateSettings(({ speed, ...prev }) => ({ ...prev, speed: incrementSpeed(speed, 'down') }))
              }
            >
              <IconPlayerTrackPrev size={iconSize} />
            </ActionIcon>
          </Tooltip>
          <Tooltip position="top" label={settings.play ? 'Stop' : 'Start'}>
            <ActionIcon onClick={() => updateSettings({ play: !settings.play })}>
              {settings.play ? <IconPlayerStop size={iconSize} /> : <IconPlayerPlay size={iconSize} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip disabled={speedUpDisabled} position="top" label="Speed Up">
            <ActionIcon
              disabled={speedUpDisabled}
              onClick={() => updateSettings(({ speed, ...prev }) => ({ ...prev, speed: incrementSpeed(speed, 'up') }))}
            >
              <IconPlayerTrackNext size={iconSize} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Group>
  );
});
