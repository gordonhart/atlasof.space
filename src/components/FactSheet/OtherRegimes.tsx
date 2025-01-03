import { Group, Stack, Title } from '@mantine/core';
import { OrbitalRegimePill } from './OrbitalRegimePill.tsx';
import { OrbitalRegime } from '../../lib/types.ts';
import { useMemo } from 'react';
import { ORBITAL_REGIMES } from '../../lib/regimes.ts';
import { AppState } from '../../lib/state.ts';

type Props = {
  regime?: OrbitalRegime;
  updateState: (update: Partial<AppState>) => void;
  title?: string;
};
export function OtherRegimes({ regime, updateState, title = 'Other Orbital Regimes' }: Props) {
  const otherRegimes: Array<OrbitalRegime> = useMemo(
    () => ORBITAL_REGIMES.filter(({ name }) => name !== regime?.name),
    [JSON.stringify(regime)]
  );

  return (
    <Stack gap="xs" p="md">
      <Title order={5}>{title}</Title>
      <Group gap={8}>
        {otherRegimes.map((otherRegime, i) => (
          <OrbitalRegimePill key={`${otherRegime.name}-${i}`} regime={otherRegime.name} updateState={updateState} />
        ))}
      </Group>
    </Stack>
  );
}
