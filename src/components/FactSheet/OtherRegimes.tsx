import { Group, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { ORBITAL_REGIMES } from '../../lib/regimes.ts';
import { Settings } from '../../lib/state.ts';
import { OrbitalRegime } from '../../lib/types.ts';
import { OrbitalRegimePill } from './OrbitalRegimePill.tsx';

type Props = {
  regime?: OrbitalRegime;
  updateSettings: (update: Partial<Settings>) => void;
  title?: string;
};
export function OtherRegimes({ regime, updateSettings, title = 'Other Orbital Regimes' }: Props) {
  const otherRegimes: Array<OrbitalRegime> = useMemo(
    () => ORBITAL_REGIMES.filter(other => other.id !== regime?.id),
    [JSON.stringify(regime)]
  );

  return (
    <Stack gap="xs" p="md">
      <Title order={5}>{title}</Title>
      <Group gap={8}>
        {otherRegimes.map((otherRegime, i) => (
          <OrbitalRegimePill key={`${otherRegime.id}-${i}`} regime={otherRegime.id} updateSettings={updateSettings} />
        ))}
      </Group>
    </Stack>
  );
}
