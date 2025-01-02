import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { useMemo } from 'react';
import { Stack, Title } from '@mantine/core';
import { AppState } from '../../lib/state.ts';
import { BodyCard } from './BodyCard.tsx';

const MAJOR_SATELLITE_TYPES = new Set([CelestialBodyType.PLANET, CelestialBodyType.MOON]);

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
};
export function MajorMoons({ body, bodies, updateState }: Props) {
  const bodiesByName = useMemo(() => Object.fromEntries(bodies.map(b => [b.name, b])), [JSON.stringify(bodies)]);
  const moons = useMemo(
    () =>
      bodies.filter(
        ({ type, influencedBy }) =>
          influencedBy[influencedBy.length - 1]?.includes(body.name) && MAJOR_SATELLITE_TYPES.has(type)
      ),
    [JSON.stringify(body), bodiesByName]
  );

  if (moons.length < 1) {
    return <></>;
  }

  return (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Major Satellites</Title>
      {moons.map((moon, i) => (
        <BodyCard key={`${moon.name}-${i}`} body={moon} onClick={() => updateState({ center: moon.name })} />
      ))}
    </Stack>
  );
}
