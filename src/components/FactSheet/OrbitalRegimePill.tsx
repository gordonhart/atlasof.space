import { Group, Pill } from '@mantine/core';
import { IconCircleDotFilled } from '@tabler/icons-react';
import { orbitalRegimeDisplayName } from '../../lib/data/regimes.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { OrbitalRegimeId } from '../../lib/types.ts';
import styles from './RelatedBodies.module.css';

type Props = {
  regime: OrbitalRegimeId;
  updateSettings: UpdateSettings;
};
export function OrbitalRegimePill({ regime, updateSettings }: Props) {
  return (
    <Pill
      className={styles.LinkPill}
      onClick={() => updateSettings({ center: regime, hover: null })}
      onMouseEnter={() => updateSettings({ hover: regime })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      <Group gap={8} align="center" wrap="nowrap">
        <IconCircleDotFilled size={14} />
        {orbitalRegimeDisplayName(regime)}
      </Group>
    </Pill>
  );
}
