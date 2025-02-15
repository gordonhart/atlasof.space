import { mapObjIndexed } from 'ramda';
import { CelestialBodyId, Spacecraft, SpacecraftId } from '../../types.ts';
import { CNSA_SPACECRAFT } from './cnsa.ts';
import { ESA_SPACECRAFT } from './esa.ts';
import { JAXA_SPACECRAFT } from './jaxa.ts';
import { NASA_SPACECRAFT } from './nasa.ts';
import { SOVIET_SPACECRAFT } from './ussr.ts';

export const SPACECRAFT: Array<Spacecraft> = [
  ...NASA_SPACECRAFT,
  ...SOVIET_SPACECRAFT,
  ...ESA_SPACECRAFT,
  ...JAXA_SPACECRAFT,
  ...CNSA_SPACECRAFT,
].sort((a, b) => a.start.getTime() - b.start.getTime());

export const SPACECRAFT_BY_BODY_ID = mapObjIndexed(
  (spacecraft, bodyId) =>
    spacecraft.sort(
      (a, b) =>
        (a.visited.find(({ id }) => id === bodyId)?.start?.getTime() ?? a.start.getTime()) -
        (b.visited.find(({ id }) => id === bodyId)?.start?.getTime() ?? b.start.getTime())
    ),
  SPACECRAFT.reduce<Record<CelestialBodyId, Array<Spacecraft>>>((acc, spacecraft) => {
    spacecraft.visited.forEach(visited => {
      acc[visited.id] = [...(acc[visited.id] ?? []), spacecraft];
    });
    return acc;
  }, {})
);

export const SPACECRAFT_BY_ID = SPACECRAFT.reduce<Record<SpacecraftId, Spacecraft>>((acc, spacecraft) => {
  acc[spacecraft.id] = spacecraft;
  return acc;
}, {});
