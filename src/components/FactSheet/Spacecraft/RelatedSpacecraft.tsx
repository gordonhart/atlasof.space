import { Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { SPACECRAFT } from '../../../lib/data/spacecraft/spacecraft.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { Spacecraft } from '../../../lib/types.ts';
import { SpacecraftCard } from './SpacecraftCard.tsx';

type Props = {
  spacecraft: Spacecraft;
  updateSettings: UpdateSettings;
};
export function RelatedSpacecraft({ spacecraft, updateSettings }: Props) {
  const padding = useFactSheetPadding();
  const { id, missionFamily } = spacecraft;
  const relatedSpacecraft = useMemo(
    () => (missionFamily != null ? SPACECRAFT.filter(s => id !== s.id && missionFamily === s.missionFamily) : []),
    [id, missionFamily]
  );
  return relatedSpacecraft.length > 0 ? (
    <Stack gap="xs" {...padding}>
      <Title order={5}>Related Spacecraft</Title>
      {relatedSpacecraft.map((s, i) => (
        <SpacecraftCard key={`${s.name}-${i}`} spacecraft={s} onClick={() => updateSettings({ center: s.id })} />
      ))}
    </Stack>
  ) : (
    <></>
  );
}
