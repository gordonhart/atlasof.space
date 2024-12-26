import { ActionIcon, Group, Menu, Stack, Tooltip } from '@mantine/core';
import {
  IconCircle,
  IconCircleDot,
  IconCircleFilled,
  IconEyeCog,
  IconRestore,
  IconTagMinus,
  IconTagPlus,
} from '@tabler/icons-react';
import { CelestialBody, CelestialBodyType, CelestialBodyTypes } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import { memo } from 'react';
import { AddSmallBodyMenu } from './AddSmallBodyMenu.tsx';

type Props = AppStateControlProps & {
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
  reset: () => void;
};
export const GeneralControls = memo(function GeneralControlsComponent({
  state,
  updateState,
  addBody,
  removeBody,
  reset,
}: Props) {
  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = state.visibleTypes.has(type)
      ? new Set([...state.visibleTypes].filter(t => t !== type))
      : new Set([...state.visibleTypes, type]);
    updateState({ visibleTypes: newVisibleTypes });
  }

  return (
    <Stack gap={buttonGap}>
      <AddSmallBodyMenu addBody={addBody} removeBody={removeBody} />

      {/* TODO: enable for 3D?
      <Tooltip position="left" label="Enlarge Planets">
        <ActionIcon onClick={() => updateState({ planetScaleFactor: state.planetScaleFactor * 2 })}>
          <IconCirclePlus size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Tooltip position="left" label="Shrink Planets">
        <ActionIcon onClick={() => updateState({ planetScaleFactor: state.planetScaleFactor / 2 })}>
          <IconCircleMinus size={iconSize} />
        </ActionIcon>
      </Tooltip>
      */}

      <Tooltip position="left" label={`${state.drawOrbit ? 'Hide' : 'Show'} Orbits`}>
        <ActionIcon onClick={() => updateState({ drawOrbit: !state.drawOrbit })}>
          {state.drawOrbit ? <IconCircleDot size={iconSize} /> : <IconCircle size={iconSize} />}
        </ActionIcon>
      </Tooltip>

      <Menu position="left" offset={0} closeOnItemClick={false}>
        <Menu.Target>
          <Tooltip position="right" label="Toggle Visibility">
            <ActionIcon>
              <IconEyeCog size={iconSize} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          {CelestialBodyTypes.map(type => (
            <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
              <Group gap="xs" align="center">
                {state.visibleTypes.has(type) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                {celestialBodyTypeName(type)}
              </Group>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Tooltip position="left" label={`${state.drawLabel ? 'Hide' : 'Show'} Labels`}>
        <ActionIcon onClick={() => updateState({ drawLabel: !state.drawLabel })}>
          {state.drawLabel ? <IconTagMinus size={iconSize} /> : <IconTagPlus size={iconSize} />}
        </ActionIcon>
      </Tooltip>

      {/* TODO: implement for 3D
      <Tooltip position="left" label={`${state.drawTail ? 'Hide' : 'Show'} Tails`}>
        <ActionIcon onClick={() => updateState({ drawTail: !state.drawTail })}>
          <IconMeteorFilled size={iconSize} />
        </ActionIcon>
      </Tooltip>
      */}

      <Tooltip position="left" label="Reset">
        <ActionIcon onClick={reset}>
          <IconRestore size={iconSize} />
        </ActionIcon>
      </Tooltip>
    </Stack>
  );
});
