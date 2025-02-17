import { Group, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { ORBITAL_REGIMES } from '../../lib/data/regimes.ts';
import { useAppState } from '../../lib/state.ts';
import { OrbitalRegime } from '../../lib/types.ts';
import { OrbitalRegimePill } from './OrbitalRegimePill.tsx';

type Props = {
  regime?: OrbitalRegime;
  title?: string;
};
export function OtherRegimes({ regime, title = 'Other Orbital Regimes' }: Props) {
  const updateSettings = useAppState(state => state.updateSettings);
  const padding = useFactSheetPadding();
  const otherRegimes: Array<OrbitalRegime> = useMemo(
    () => Object.values(ORBITAL_REGIMES).filter(other => other.id !== regime?.id),
    [JSON.stringify(regime)]
  );

  return (
    <Stack {...padding}>
      <Title order={5}>{title}</Title>
      <Group gap={8}>
        {otherRegimes.map((otherRegime, i) => (
          <OrbitalRegimePill key={`${otherRegime.id}-${i}`} regime={otherRegime} updateSettings={updateSettings} />
        ))}
      </Group>
    </Stack>
  );
}
