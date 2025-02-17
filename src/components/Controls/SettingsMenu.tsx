import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircle, IconCircleDot, IconRestore, IconSettings } from '@tabler/icons-react';
import { useAppState } from '../../hooks/useAppState.ts';
import { CelestialBodyType, CelestialBodyTypes } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { iconSize } from './constants.ts';

export function SettingsMenu() {
  const { settings, updateSettings, resetAppState: reset } = useAppState();
  const [isOpen, { open, close }] = useDisclosure(false);

  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = settings.visibleTypes.has(type)
      ? new Set([...settings.visibleTypes].filter(t => t !== type))
      : new Set([...settings.visibleTypes, type]);
    updateSettings({ visibleTypes: newVisibleTypes });
  }

  function handleReset() {
    close();
    reset();
  }

  const IconOn = <IconCircleDot color="var(--mantine-color-cyan-light-color)" size={14} />;
  const IconOff = <IconCircle color="var(--mantine-color-gray-6)" size={14} />;

  return (
    <Menu position="top-end" opened={isOpen} onClose={close} closeOnItemClick={false}>
      <Menu.Target>
        <Tooltip position="top" label="Settings" disabled={isOpen}>
          <ActionIcon aria-label="Settings" onClick={isOpen ? close : open}>
            <IconSettings size={iconSize} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown bg="black" mah={'calc(90dvh - var(--mantine-spacing-xs))'} style={{ overflow: 'auto' }}>
        <Menu.Label>General</Menu.Label>
        <Menu.Item onClick={() => updateSettings(prev => ({ ...prev, drawOrbit: !prev.drawOrbit }))}>
          <Group gap="xs" align="center">
            {settings.drawOrbit ? IconOn : IconOff}
            Show Orbits
          </Group>
        </Menu.Item>
        <Menu.Item onClick={() => updateSettings(prev => ({ ...prev, drawLabel: !prev.drawLabel }))}>
          <Group gap="xs" align="center">
            {settings.drawLabel ? IconOn : IconOff}
            Show Labels
          </Group>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Celestial Body Types</Menu.Label>
        {CelestialBodyTypes.filter(type => type !== CelestialBodyType.SPACECRAFT).map(type => (
          <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
            <Group gap="xs" align="center">
              {settings.visibleTypes.has(type) ? IconOn : IconOff}
              {celestialBodyTypeName(type)}
            </Group>
          </Menu.Item>
        ))}

        <Menu.Divider />
        <Menu.Item onClick={handleReset}>
          <Group gap="xs" align="center">
            <IconRestore color="var(--mantine-color-orange-light-color)" size={14} />
            Reset
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
