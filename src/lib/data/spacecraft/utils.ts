import { HexColor, Spacecraft, SpacecraftId } from '../../types.ts';
import { nameToId } from '../../utils.ts';
import { DEFAULT_SPACECRAFT_COLOR } from '../bodies.ts';

export function spacecraftWithDefaults(
  spacecraft: Omit<Spacecraft, 'id' | 'color'> & { id?: SpacecraftId; color?: HexColor }
): Spacecraft {
  return {
    ...spacecraft,
    id: `spacecraft/${nameToId(spacecraft.name)}`,
    color: spacecraft.color ?? DEFAULT_SPACECRAFT_COLOR,
  };
}
