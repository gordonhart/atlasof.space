import { useEffect, useState } from 'react';
import { CelestialBody } from '../lib/types.ts';
import { AU, DEFAULT_ASTEROID_COLOR } from '../lib/constants.ts';
import { isNotFound, SmallBodyNotFound, SmallBodyResponse } from '../lib/sbdb.ts';

export function useSmallBody(name: string | null) {
  const [body, setBody] = useState<CelestialBody | null>(null);

  useEffect(() => {
    if (name != null && name.trim().length > 0) {
      fetchSmallBodyData(name).then(b => setBody(b));
    } else {
      setBody(null);
    }
  }, [name]);

  return body;
}

export async function fetchSmallBodyData(name: string): Promise<CelestialBody | null> {
  const urlParams = new URLSearchParams({ sstr: name });
  const response = await fetch(`/api/sbdb?${urlParams}`);
  const obj: SmallBodyResponse | SmallBodyNotFound = await response.json();
  if (isNotFound(obj)) {
    return null;
  }
  const { object, orbit, phys_par } = obj;
  const { elements } = orbit;
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
