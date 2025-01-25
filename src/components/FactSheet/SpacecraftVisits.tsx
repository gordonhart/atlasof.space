import { Stack, Title } from '@mantine/core';
import { Spacecraft } from '../../lib/spacecraft.ts';
import { CelestialBody } from '../../lib/types.ts';
import { SpacecraftCard } from './SpacecraftCard.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body: CelestialBody;
};
export function SpacecraftVisits({ spacecraft, body }: Props) {
  return (
    <Stack gap="xs" p="md" pt="lg">
      <Title order={5}>Spacecraft Visits</Title>
      {spacecraft.map((s, i) => (
        <SpacecraftCard key={`${s.name}-${i}`} spacecraft={s} body={body} />
      ))}
    </Stack>
  );
}
