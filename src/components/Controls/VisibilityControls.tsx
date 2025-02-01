import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import { IconCircle, IconCircleFilled, IconEyeCog } from '@tabler/icons-react';
import { orbitalRegimeDisplayName } from '../../lib/regimes.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { asOrbitalRegimeId, CelestialBodyType, CelestialBodyTypes, OrbitalRegimeId } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { iconSize } from './constants.ts';

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
};
export function VisibilityControls({ settings, updateSettings }: Props) {
  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = settings.visibleTypes.has(type)
      ? new Set([...settings.visibleTypes].filter(t => t !== type))
      : new Set([...settings.visibleTypes, type]);
    updateSettings({ visibleTypes: newVisibleTypes });
  }

  function toggleVisibleRegime(regime: OrbitalRegimeId) {
    const regimeId = asOrbitalRegimeId(regime);
    const newVisibleRegimes = settings.visibleRegimes.has(regimeId)
      ? new Set([...settings.visibleRegimes].filter(t => t !== regimeId))
      : new Set([...settings.visibleRegimes, regimeId]);
    updateSettings({ visibleRegimes: newVisibleRegimes });
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
              {settings.visibleTypes.has(type) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
              {celestialBodyTypeName(type)}
            </Group>
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Label>Orbital Regimes</Menu.Label>
        {Object.values(OrbitalRegimeId).map(regime => (
          <Menu.Item key={regime} onClick={() => toggleVisibleRegime(regime)}>
            <Group gap="xs" align="center">
              {settings.visibleRegimes.has(asOrbitalRegimeId(regime)) ? (
                <IconCircleFilled size={14} />
              ) : (
                <IconCircle size={14} />
              )}
              {orbitalRegimeDisplayName(regime)}
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
