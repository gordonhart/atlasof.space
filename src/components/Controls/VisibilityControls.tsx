import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import { IconCircle, IconCircleFilled, IconEyeCog } from '@tabler/icons-react';
import { AppStateControlProps, iconSize } from './constants.ts';
import { CelestialBodyType, CelestialBodyTypes, HeliocentricOrbitalRegime } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';

export function VisibilityControls({ state, updateState }: AppStateControlProps) {
  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = state.visibleTypes.has(type)
      ? new Set([...state.visibleTypes].filter(t => t !== type))
      : new Set([...state.visibleTypes, type]);
    updateState({ visibleTypes: newVisibleTypes });
  }

  function toggleVisibleRegime(regime: HeliocentricOrbitalRegime) {
    const newVisibleRegimes = state.visibleRegimes.has(regime)
      ? new Set([...state.visibleRegimes].filter(t => t !== regime))
      : new Set([...state.visibleRegimes, regime]);
    updateState({ visibleRegimes: newVisibleRegimes });
  }

  return (
    <Menu position="top" offset={0} closeOnItemClick={false}>
      <Menu.Target>
        <Tooltip position="top" label="Toggle Visibility">
          <ActionIcon>
            <IconEyeCog size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Celestial Body Types</Menu.Label>
        {CelestialBodyTypes.map(type => (
          <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
            <Group gap="xs" align="center">
              {state.visibleTypes.has(type) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
              {celestialBodyTypeName(type)}
            </Group>
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Label>Orbital Regimes</Menu.Label>
        {Object.values(HeliocentricOrbitalRegime).map(regime => (
          <Menu.Item key={regime} onClick={() => toggleVisibleRegime(regime)}>
            <Group gap="xs" align="center">
              {state.visibleRegimes.has(regime) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
              {regime}
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
