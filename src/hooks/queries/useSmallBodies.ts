import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import { AU, celestialBodyWithDefaults, SOL } from '../../lib/data/bodies.ts';
import { julianDayToEpoch } from '../../lib/epoch.ts';
import { estimateAsteroidMass } from '../../lib/physics.ts';
import { isNotFound, SBDB_URL, SmallBodyNotFound, SmallBodyResponse } from '../../lib/sbdb.ts';
import { CelestialBody, CelestialBodyType, OrbitalRegimeId } from '../../lib/types.ts';

export function useSmallBodies(names: Array<string>) {
  return useQueries<UseQueryOptions<CelestialBody | null, Error>[]>({
    queries: names.map(name => ({
      queryKey: ['GET', 'sbdb', name],
      queryFn: () => fetchSmallBodyData(name),
      staleTime: Infinity,
    })),
  });
}

async function fetchSmallBodyData(name: string): Promise<CelestialBody | null> {
  const urlParams = new URLSearchParams({ sstr: name });
  const response = await fetch(`/api/sbdb?${urlParams}`);
  const obj: SmallBodyResponse | SmallBodyNotFound = await response.json();
  if (isNotFound(obj)) {
    return null;
  }
  const { object, orbit, phys_par } = obj;
  const { elements } = orbit;
  // TODO: are units always km? should account for the reported unit type
  const radius = (Number(phys_par.find(({ name }) => name === 'diameter')?.value ?? 0) / 2) * 1e3;
  return celestialBodyWithDefaults({
    type: CelestialBodyType.ASTEROID, // TODO: sometimes comets
    name,
    shortName: object.shortname,
    influencedBy: [SOL.id],
    orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
    elements: {
      wrt: SOL.id,
      source: SBDB_URL,
      epoch: julianDayToEpoch(`JD${orbit.epoch}`),
      eccentricity: Number(elements.find(({ name }) => name === 'e')?.value),
      semiMajorAxis: Number(elements.find(({ name }) => name === 'a')?.value) * AU,
      inclination: Number(elements.find(({ name }) => name === 'i')?.value),
      longitudeAscending: Number(elements.find(({ name }) => name === 'om')?.value),
      argumentOfPeriapsis: Number(elements.find(({ name }) => name === 'w')?.value),
      meanAnomaly: Number(elements.find(({ name }) => name === 'ma')?.value),
    },
    mass: estimateAsteroidMass(radius),
    radius,
  });
}
