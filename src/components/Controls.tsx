import {AppState} from "./state.ts";
import {ActionIcon, Group, Stack, Text} from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconPlayerTrackNextFilled, IconPlayerTrackPrevFilled
} from "@tabler/icons-react";
import {useMemo} from "react";
import {pluralize} from "../lib/utils.ts";

const actionIconProps = {variant: 'subtle', color: 'gray'};
const iconProps = {size: 14};

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
}
export function Controls({ state, updateState }: Props) {
  const [dt, dtUnits] = useMemo(() => {
    if (state.dt < 60) {
      return [state.dt, 'second'];
    } else if (state.dt < 60 * 60) {
      return [state.dt / 60, 'minute'];
    } else if (state.dt < 60 * 60 * 24) {
      return [state.dt / 60 / 60, 'hour'];
    } else if (state.dt < 60 * 60 * 24 * 365) {
      return [state.dt / 60 / 60 / 24, 'day'];
    } else {
      return [state.dt / 60 / 60 / 24 / 365, 'year'];
    }
  }, [state.dt]);

  return (
    <Group pos="absolute" bottom={10} left={10} right={10} justify="space-between" align="flex-end">
      <Stack gap={4} fz="xs" c="gray.4">
        <Text inherit>t: {(state.time / 60 / 60 / 24).toFixed(0)} days</Text>
        <Text inherit>dt: {pluralize(dt, dtUnits)}</Text>
      </Stack>
    <Group gap={0}>
      <ActionIcon
        {...actionIconProps}
        onClick={() => updateState({ dt: state.dt / 2 })}
      >
        <IconPlayerTrackPrevFilled {...iconProps} />
      </ActionIcon>
      <ActionIcon
        {...actionIconProps}
        onClick={() => updateState({ play: !state.play })}
      >
        {state.play ? <IconPlayerStopFilled {...iconProps} /> : <IconPlayerPlayFilled {...iconProps} />}
      </ActionIcon>
      <ActionIcon
        {...actionIconProps}
        onClick={() => updateState({ dt: state.dt * 2 })}
      >
        <IconPlayerTrackNextFilled {...iconProps} />
      </ActionIcon>
    </Group>
      </Group>
  );
}