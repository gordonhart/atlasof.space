import { Group, Pill } from '@mantine/core';
import { IconCircleDotFilled } from '@tabler/icons-react';
import { useAppState } from '../../lib/state.ts';
import { OrbitalRegime } from '../../lib/types.ts';
import styles from './RelatedBodies.module.css';

type Props = {
  regime: OrbitalRegime;
};
export function OrbitalRegimePill({ regime }: Props) {
  const updateSettings = useAppState(state => state.updateSettings);
  return (
    <Pill
      className={styles.LinkPill}
      onClick={() => updateSettings({ center: regime.id, hover: null })}
      onMouseEnter={() => updateSettings({ hover: regime.id })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      <Group gap={8} align="center" wrap="nowrap">
        <IconCircleDotFilled size={14} />
        {regime.name}
      </Group>
    </Pill>
  );
}
