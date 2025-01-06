import { Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { Settings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { BodyCard } from './BodyCard.tsx';

const MAJOR_SATELLITE_TYPES = new Set([CelestialBodyType.PLANET, CelestialBodyType.MOON]);

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: (update: Partial<Settings>) => void;
};
export function MajorSatellites({ body, bodies, updateSettings }: Props) {
  const bodiesByName = useMemo(() => Object.fromEntries(bodies.map(b => [b.name, b])), [JSON.stringify(bodies)]);
  const satellites = useMemo(
    () =>
      bodies.filter(
        ({ type, influencedBy }) =>
          influencedBy[influencedBy.length - 1]?.includes(body.name) && MAJOR_SATELLITE_TYPES.has(type)
      ),
    [JSON.stringify(body), bodiesByName]
  );

  if (satellites.length < 1) {
    return <></>;
  }

  const satelliteTypes = new Set(satellites.map(({ type }) => type));
  const satelliteTypeDisplayName =
    satelliteTypes.size !== 1 ? 'Satellites' : celestialBodyTypeName(satelliteTypes.values().next().value!, true);
  return (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Major {satelliteTypeDisplayName}</Title>
      {satellites.map((satellite, i) => (
        <BodyCard
          key={`${satellite.name}-${i}`}
          body={satellite}
          onClick={() => updateSettings({ center: satellite.name, hover: null })}
          onHover={hovered => updateSettings({ hover: hovered ? satellite.name : null })}
        />
      ))}
    </Stack>
  );
}
