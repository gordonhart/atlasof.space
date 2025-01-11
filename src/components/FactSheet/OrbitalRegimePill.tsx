import { Group, Pill } from '@mantine/core';
import { IconCircleDotFilled } from '@tabler/icons-react';
import { orbitalRegimeSlug } from '../../lib/regimes.ts';
import { Settings } from '../../lib/state.ts';
import { HeliocentricOrbitalRegime } from '../../lib/types.ts';
import styles from './RelatedBodies.module.css';

type Props = {
  regime: HeliocentricOrbitalRegime;
  updateSettings: (update: Partial<Settings>) => void;
};
export function OrbitalRegimePill({ regime, updateSettings }: Props) {
  return (
    <Pill
      className={styles.LinkPill}
      style={{ cursor: 'pointer' }}
      onClick={() => updateSettings({ center: orbitalRegimeSlug(regime), hover: null })}
      onMouseEnter={() => updateSettings({ hover: orbitalRegimeSlug(regime) })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      <Group gap={8} align="center" wrap="nowrap">
        <IconCircleDotFilled size={14} />
        {regime}
      </Group>
    </Pill>
  );
}
