import { Group, Pill } from '@mantine/core';
import { IconPlanet } from '@tabler/icons-react';
import { UpdateSettings } from '../../lib/state.ts';
import { PlanetarySystem } from '../../lib/types.ts';
import styles from './RelatedBodies.module.css';

type Props = {
  system: PlanetarySystem;
  updateSettings: UpdateSettings;
};
export function PlanetarySystemPill({ system, updateSettings }: Props) {
  return (
    <Pill
      className={styles.LinkPill}
      onClick={() => updateSettings({ center: system.id, hover: null })}
      onMouseEnter={() => updateSettings({ hover: system.id })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      <Group gap={8} align="center" wrap="nowrap">
        <IconPlanet size={14} />
        {system.name}
      </Group>
    </Pill>
  );
}
