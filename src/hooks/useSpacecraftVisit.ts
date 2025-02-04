import { useMemo } from 'react';
import { CelestialBody, Spacecraft } from '../lib/types.ts';

type Params = {
  spacecraft: Spacecraft;
  body?: CelestialBody;
};
export function useSpacecraftVisit({ spacecraft, body }: Params) {
  return useMemo(
    () => (body?.id != null ? spacecraft.visited.find(({ id }) => id === body.id) : undefined),
    [JSON.stringify(spacecraft), body?.id]
  );
}
