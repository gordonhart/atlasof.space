import { Group, Pill } from '@mantine/core';
import { HeliocentricOrbitalRegime } from '../../lib/types.ts';
import styles from './RelatedBodies.module.css';
import { AppState } from '../../lib/state.ts';
import { IconCircleDotFilled } from '@tabler/icons-react';

type Props = {
  regime: HeliocentricOrbitalRegime;
  updateState: (update: Partial<AppState>) => void;
};
export function OrbitalRegimePill({ regime, updateState }: Props) {
  return (
    <Pill
      className={styles.LinkPill}
      style={{ cursor: 'pointer' }}
      onClick={() => updateState({ center: regime, hover: null })}
      onMouseEnter={() => updateState({ hover: regime })}
      onMouseLeave={() => updateState({ hover: null })}
    >
      <Group gap={8} align="center" wrap="nowrap">
        <IconCircleDotFilled size={14} />
        {regime}
      </Group>
    </Pill>
  );
}
