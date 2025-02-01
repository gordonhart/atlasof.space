import { Stack, Title } from '@mantine/core';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, Spacecraft } from '../../lib/types.ts';
import { SpacecraftCard } from './Spacecraft/SpacecraftCard.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body: CelestialBody;
  updateSettings: UpdateSettings;
};
export function SpacecraftVisits({ spacecraft, body, updateSettings }: Props) {
  return spacecraft.length > 0 ? (
    <Stack gap="xs" p="md" pt="lg">
      <Title order={5}>Spacecraft Visits</Title>
      {spacecraft.map((s, i) => (
        <SpacecraftCard
          key={`${s.name}-${i}`}
          spacecraft={s}
          body={body}
          onClick={() => updateSettings({ center: s.id, hover: null })}
        />
      ))}
    </Stack>
  ) : (
    <></>
  );
}
