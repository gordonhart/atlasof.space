import { Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { useAppState } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { CelestialBodyCard } from './CelestialBodyCard.tsx';

const MAJOR_SATELLITE_TYPES = new Set([CelestialBodyType.PLANET, CelestialBodyType.MOON]);

type Props = {
  body: CelestialBody;
};
export function MajorSatellites({ body }: Props) {
  const bodies = useAppState(state => state.settings.bodies);
  const updateSettings = useAppState(state => state.updateSettings);
  const padding = useFactSheetPadding();
  const bodiesByName = useMemo(() => Object.fromEntries(bodies.map(b => [b.name, b])), [JSON.stringify(bodies)]);
  const satellites = useMemo(
    () =>
      bodies.filter(
        ({ type, influencedBy }) =>
          influencedBy[influencedBy.length - 1]?.includes(body.id) && MAJOR_SATELLITE_TYPES.has(type)
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
    <Stack gap="xs" {...padding}>
      <Title order={5}>Major {satelliteTypeDisplayName}</Title>
      {satellites.map((satellite, i) => (
        <CelestialBodyCard
          key={`${satellite.name}-${i}`}
          body={satellite}
          onClick={() => updateSettings({ center: satellite.id, hover: null })}
          onHover={hovered => updateSettings({ hover: hovered ? satellite.id : null })}
        />
      ))}
    </Stack>
  );
}
