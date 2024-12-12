import {AppState} from "./state.ts";
import {ActionIcon, Group, Stack, Text, Tooltip} from "@mantine/core";
import {
  IconArrowLeftTail, IconMeteorFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconPlayerTrackNextFilled, IconPlayerTrackPrevFilled
} from "@tabler/icons-react";
import {useMemo} from "react";
import {humanTimeUnits, pluralize} from "../lib/utils.ts";

const actionIconProps = {variant: 'subtle', color: 'gray'};
const iconProps = {size: 14};
const tooltipProps = {openDelay: 400};

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
}
export function Controls({ state, updateState }: Props) {
  const [t, tUnits] = humanTimeUnits(state.time);
  const [dt, dtUnits] = useMemo(() => humanTimeUnits(state.dt), [state.dt]);

  return (
    <Group pos="absolute" bottom={10} left={10} right={10} justify="space-between" align="flex-end">
      <Stack gap={4} fz="xs" c="gray.4">
        <Text inherit>t: {pluralize(Number(t.toFixed(0)), tUnits)}</Text>
        <Text inherit>dt: {pluralize(dt, dtUnits)}</Text>
      </Stack>

      <Group gap={0}>
        <Tooltip {...tooltipProps} label="Slow Down">
          <ActionIcon
            {...actionIconProps}
            onClick={() => updateState({ dt: state.dt / 2 })}
          >
            <IconPlayerTrackPrevFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label={state.play ? 'Stop' : 'Start'}>
          <ActionIcon
            {...actionIconProps}
            onClick={() => updateState({ play: !state.play })}
          >
            {state.play ? <IconPlayerStopFilled {...iconProps} /> : <IconPlayerPlayFilled {...iconProps} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label="Speed Up">
          <ActionIcon
            {...actionIconProps}
            onClick={() => updateState({ dt: state.dt * 2 })}
          >
            <IconPlayerTrackNextFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>

        <Tooltip {...tooltipProps} label={`${state.drawTail ? 'Hide' : 'Show'} Tails`}>
          <ActionIcon
            {...actionIconProps}
            onClick={() => updateState({ drawTail: !state.drawTail })}
          >
            <IconMeteorFilled {...iconProps} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}