import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircle, IconCircleDot, IconRestore, IconSettings } from '@tabler/icons-react';
import { useAppState } from '../../lib/state.ts';
import { CelestialBodyType, CelestialBodyTypes } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { iconSize } from './constants.ts';

type Props = {
  reset: () => void;
};
export function SettingsMenu({ reset }: Props) {
  const drawOrbit = useAppState(state => state.settings.drawOrbit);
  const drawLabel = useAppState(state => state.settings.drawLabel);
  const visibleTypes = useAppState(state => state.settings.visibleTypes);
  const updateSettings = useAppState(state => state.updateSettings);
  const [isOpen, { open, close }] = useDisclosure(false);

  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = visibleTypes.has(type)
      ? new Set([...visibleTypes].filter(t => t !== type))
      : new Set([...visibleTypes, type]);
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
            {drawOrbit ? IconOn : IconOff}
            Show Orbits
          </Group>
        </Menu.Item>
        <Menu.Item onClick={() => updateSettings(prev => ({ ...prev, drawLabel: !prev.drawLabel }))}>
          <Group gap="xs" align="center">
            {drawLabel ? IconOn : IconOff}
            Show Labels
          </Group>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Celestial Body Types</Menu.Label>
        {CelestialBodyTypes.filter(type => type !== CelestialBodyType.SPACECRAFT).map(type => (
          <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
            <Group gap="xs" align="center">
              {visibleTypes.has(type) ? IconOn : IconOff}
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
