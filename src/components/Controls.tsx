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
import { humanTimeUnits, pluralize } from '../lib/utils.ts';
import { CELESTIAL_BODY_NAMES } from '../lib/constants.ts';
import { useHotkeys } from '@mantine/hooks';
import { ScaleIndicator } from './ScaleIndicator.tsx';

const actionIconProps = { variant: 'subtle', color: 'gray' };
const iconProps = { size: 14 };
const tooltipProps = { openDelay: 400 };
const movePx = 10;
const pad = 10;

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
  reset: () => void;
};
export function Controls({ state, updateState, reset }: Props) {
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
      <Menu shadow="md" position="top-start" offset={0} width={140}>
        <Menu.Target>
          <Button pos="absolute" top={pad} left={pad} size="xs" variant="subtle" color="gray">
            {state.center}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {CELESTIAL_BODY_NAMES.map(obj => (
            <Menu.Item key={obj} onClick={() => updateState({ center: obj })}>
              <Group gap="xs" align="center">
                {state.center === obj ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                {obj}
              </Group>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Stack pos="absolute" top={pad} right={pad} gap={2} align="flex-end">
        <ScaleIndicator metersPerPx={state.metersPerPx} />

        <Stack gap={2}>
          <Tooltip {...tooltipProps} position="left" label="Zoom In">
            <ActionIcon {...actionIconProps} onClick={() => updateState({ metersPerPx: state.metersPerPx / 2 })}>
              <IconPlus {...iconProps} />
            </ActionIcon>
          </Tooltip>
          <Tooltip {...tooltipProps} position="left" label="Zoom Out">
            <ActionIcon {...actionIconProps} onClick={() => updateState({ metersPerPx: state.metersPerPx * 2 })}>
              <IconMinus {...iconProps} />
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
      </Group>

      <Stack pos="absolute" bottom={pad} left={pad} gap={4}>
        <Paper bg="transparent" radius="md" style={{ backdropFilter: 'blur(4px)' }}>
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
          <Tooltip {...tooltipProps} label="Slow Down">
            <ActionIcon {...actionIconProps} onClick={() => updateState({ dt: Math.max(state.dt / 2, 1) })}>
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
        </Group>
      </Stack>

      <Stack pos="absolute" bottom={pad} right={pad} gap={2}>
        <Tooltip {...tooltipProps} label="Enlarge Planets">
          <ActionIcon
            {...actionIconProps}
            onClick={() => updateState({ planetScaleFactor: Math.min(state.planetScaleFactor * 2, 8192) })}
          >
            <IconCirclePlus {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label="Shrink Planets">
          <ActionIcon
            {...actionIconProps}
            onClick={() => updateState({ planetScaleFactor: Math.max(state.planetScaleFactor / 2, 1) })}
          >
            <IconCircleMinus {...iconProps} />
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
              reset();
            }}
          >
            <IconRestore {...iconProps} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    </>
  );
}
