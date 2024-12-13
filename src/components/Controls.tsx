import { AppState, initialState } from '../lib/state.ts';
import { ActionIcon, Button, Group, Menu, Paper, Stack, Text, Tooltip } from '@mantine/core';
import {
  IconCaretDownFilled,
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconCircle,
  IconCircleFilled,
  IconCircleMinus,
  IconCirclePlus,
  IconMeteorFilled,
  IconMinus,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconPlus,
  IconRestore,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { humanDistanceUnits, humanTimeUnits, pluralize } from '../lib/utils.ts';
import { resetState } from '../lib/physics.ts';
import { CELESTIAL_OBJECTS } from '../lib/constants.ts';
import { useHotkeys } from '@mantine/hooks';

const actionIconProps = { variant: 'subtle', color: 'gray' };
const iconProps = { size: 14 };
const tooltipProps = { openDelay: 400 };
const movePx = 10;

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
};
export function Controls({ state, updateState }: Props) {
  const [t, tUnits] = humanTimeUnits(state.time);
  const [dt, dtUnits] = useMemo(() => humanTimeUnits(state.dt), [state.dt]);
  const [mpp, mppUnits] = useMemo(() => humanDistanceUnits(state.metersPerPx), [state.metersPerPx]);

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
    <Group pos="absolute" bottom={10} left={10} right={10} justify="space-between" align="flex-end">
      <Paper p={4} bg="transparent" radius="md" style={{ backdropFilter: 'blur(4px)' }}>
        <Stack gap={4} p={4} fz="xs">
          <Text inherit>t: {pluralize(Number(t.toFixed(0)), tUnits)}</Text>
          <Text inherit>dt: {pluralize(dt, dtUnits)}</Text>
          <Text inherit>m/px: {pluralize(mpp, mppUnits)}</Text>
        </Stack>
      </Paper>

      <Group gap={2} align="flex-end">
        <Menu shadow="md" position="top-start" offset={0} width={120}>
          <Menu.Target>
            <Button size="xs" variant="subtle" color="gray">
              <Group gap={4}>
                <Text inherit c="dimmed">
                  center:
                </Text>
                <Text inherit>{state.center}</Text>
              </Group>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {CELESTIAL_OBJECTS.map(obj => (
              <Menu.Item key={obj} onClick={() => updateState({ center: obj })}>
                <Group gap="xs" align="center">
                  {state.center === obj ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                  {obj}
                </Group>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <Tooltip {...tooltipProps} label="Pan Left">
          <ActionIcon {...actionIconProps} onClick={() => applyOffset(-movePx, 0)}>
            <IconCaretLeftFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>
        <Stack gap={2}>
          <Tooltip {...tooltipProps} label="Pan Up">
            <ActionIcon {...actionIconProps} onClick={() => applyOffset(0, movePx)}>
              <IconCaretUpFilled {...iconProps} />
            </ActionIcon>
          </Tooltip>
          <Tooltip {...tooltipProps} label="Pan Down">
            <ActionIcon {...actionIconProps} onClick={() => applyOffset(0, -movePx)}>
              <IconCaretDownFilled {...iconProps} />
            </ActionIcon>
          </Tooltip>
        </Stack>
        <Tooltip {...tooltipProps} label="Pan Right">
          <ActionIcon {...actionIconProps} onClick={() => applyOffset(movePx, 0)}>
            <IconCaretRightFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Stack gap={2}>
          <Tooltip {...tooltipProps} label="Zoom In">
            <ActionIcon {...actionIconProps} onClick={() => updateState({ metersPerPx: state.metersPerPx / 2 })}>
              <IconPlus {...iconProps} />
            </ActionIcon>
          </Tooltip>

          <Tooltip {...tooltipProps} label="Zoom Out">
            <ActionIcon {...actionIconProps} onClick={() => updateState({ metersPerPx: state.metersPerPx * 2 })}>
              <IconMinus {...iconProps} />
            </ActionIcon>
          </Tooltip>
        </Stack>

        <Stack gap={2}>
          <Tooltip {...tooltipProps} label="Enlarge Planets">
            <ActionIcon
              {...actionIconProps}
              onClick={() => updateState({ planetScaleFactor: state.planetScaleFactor * 2 })}
            >
              <IconCirclePlus {...iconProps} />
            </ActionIcon>
          </Tooltip>

          <Tooltip {...tooltipProps} label="Shrink Planets">
            <ActionIcon
              {...actionIconProps}
              onClick={() => updateState({ planetScaleFactor: state.planetScaleFactor / 2 })}
            >
              <IconCircleMinus {...iconProps} />
            </ActionIcon>
          </Tooltip>
        </Stack>

        <Tooltip {...tooltipProps} label="Slow Down">
          <ActionIcon {...actionIconProps} onClick={() => updateState({ dt: state.dt / 2 })}>
            <IconPlayerTrackPrevFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label={state.play ? 'Stop' : 'Start'}>
          <ActionIcon {...actionIconProps} onClick={() => updateState({ play: !state.play })}>
            {state.play ? <IconPlayerStopFilled {...iconProps} /> : <IconPlayerPlayFilled {...iconProps} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label="Speed Up">
          <ActionIcon {...actionIconProps} onClick={() => updateState({ dt: state.dt * 2 })}>
            <IconPlayerTrackNextFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label={`${state.drawTail ? 'Hide' : 'Show'} Tails`}>
          <ActionIcon {...actionIconProps} onClick={() => updateState({ drawTail: !state.drawTail })}>
            <IconMeteorFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label="Reset">
          <ActionIcon
            {...actionIconProps}
            onClick={() => {
              updateState(initialState);
              resetState();
            }}
          >
            <IconRestore {...iconProps} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
