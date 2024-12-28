import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { useMemo } from 'react';
import { Card, Group, Stack, Title } from '@mantine/core';
import { Thumbnail } from './Thumbnail.tsx';
import { AppState } from '../../lib/state.ts';

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
    <Stack gap="xs">
      <Title order={6}>Major Satellites</Title>
      {moons.map((moon, i) => (
        <MoonCard key={i} body={moon} updateState={updateState} />
      ))}
    </Stack>
  );
}

function MoonCard({ body, updateState }: Pick<Props, 'body' | 'updateState'>) {
  return (
    <Card withBorder p="xs" style={{ cursor: 'pointer' }} onClick={() => updateState({ center: body.name })}>
      <Group gap="xs" justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap="xs">
          <Title order={6}>{body.name}</Title>
          {/* TODO: more */}
        </Stack>
        <Thumbnail body={body} size={120} />
      </Group>
    </Card>
  );
}
