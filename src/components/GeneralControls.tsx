import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import {
  IconCircle,
  IconCircleFilled,
  IconCircleMinus,
  IconCirclePlus,
  IconEyeCog,
  IconMeteorFilled,
  IconRestore,
} from '@tabler/icons-react';
import { CelestialBodyType } from '../lib/types.ts';
import { celestialBodyTypeName } from '../lib/utils.ts';
import { AppState } from '../lib/state.ts';

const menuDropdownProps = { mah: window.innerHeight - 150, style: { overflow: 'auto' } };
const iconSize = 14;

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
  reset: () => void;
};
export function GeneralControls({ state, updateState, reset }: Props) {
  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = state.visibleTypes.has(type)
      ? new Set([...state.visibleTypes].filter(t => t !== type))
      : new Set([...state.visibleTypes, type]);
    updateState({ visibleTypes: newVisibleTypes });
  }

  return (
    <>
      <Tooltip position="left" label="Enlarge Planets">
        <ActionIcon onClick={() => updateState({ planetScaleFactor: Math.min(state.planetScaleFactor * 2, 8192) })}>
          <IconCirclePlus size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Tooltip position="left" label="Shrink Planets">
        <ActionIcon onClick={() => updateState({ planetScaleFactor: Math.max(state.planetScaleFactor / 2, 1) })}>
          <IconCircleMinus size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Tooltip position="left" label={`${state.drawOrbit ? 'Hide' : 'Show'} Orbits`}>
        <ActionIcon onClick={() => updateState({ drawOrbit: !state.drawOrbit })}>
          <IconCircle size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Menu position="left" offset={0} width={120} closeOnItemClick={false}>
        <Menu.Target>
          <Tooltip position="right" label="Toggle Visibility">
            <ActionIcon>
              <IconEyeCog size={iconSize} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown {...menuDropdownProps}>
          {(['sun', 'planet', 'moon', 'asteroid', 'trans-neptunian-object'] as Array<CelestialBodyType>).map(type => (
            <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
              <Group gap="xs" align="center">
                {state.visibleTypes.has(type) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                {celestialBodyTypeName(type)}
              </Group>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Tooltip position="left" label={`${state.drawTail ? 'Hide' : 'Show'} Tails`}>
        <ActionIcon onClick={() => updateState({ drawTail: !state.drawTail })}>
          <IconMeteorFilled size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Tooltip position="left" label="Reset">
        <ActionIcon onClick={reset}>
          <IconRestore size={iconSize} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
