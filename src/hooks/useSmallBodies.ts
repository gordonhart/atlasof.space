import { CelestialBody } from '../lib/types.ts';
import { AU, DEFAULT_ASTEROID_COLOR } from '../lib/constants.ts';
import { isNotFound, SmallBodyNotFound, SmallBodyResponse } from '../lib/sbdb.ts';
import { useQueries, UseQueryOptions } from '@tanstack/react-query';

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
  // TODO: units are often km, need to account for reported units
  const radius = Number(phys_par.find(({ name }) => name === 'diameter')?.value ?? 0) / 2;
  return {
    name: object.fullname,
    shortName: object.shortname,
    type: 'asteroid',
    eccentricity: Number(elements.find(({ name }) => name === 'e')?.value),
    semiMajorAxis: Number(elements.find(({ name }) => name === 'a')?.value) * AU,
    inclination: Number(elements.find(({ name }) => name === 'i')?.value),
    longitudeAscending: Number(elements.find(({ name }) => name === 'om')?.value),
    argumentOfPeriapsis: Number(elements.find(({ name }) => name === 'w')?.value),
    trueAnomaly: 0,
    mass: 2500 * (4 / 3) * Math.PI * radius ** 3, // best-effort guess using 2500kg/m3 density and a spherical shape
    radius,
    color: DEFAULT_ASTEROID_COLOR, // TODO: differentiate from existing asteroids?
    satellites: [],
  };
}
