import { memo } from 'react';
import { isSpacecraft, Spacecraft } from '../../lib/spacecraft.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, isCelestialBody, isOrbitalRegime, OrbitalRegime } from '../../lib/types.ts';
import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';
import { SpacecraftFactSheet } from './SpacecraftFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  item: CelestialBody | OrbitalRegime | Spacecraft;
  settings: Settings;
  updateSettings: UpdateSettings;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: string) => void;
};
export const FactSheet = memo(function FactSheetComponent({
  item,
  settings,
  updateSettings,
  addBody,
  removeBody,
}: Props) {
  const props = { bodies: settings.bodies, updateSettings };
  return isCelestialBody(item) ? (
    <CelestialBodyFactSheet body={item} {...props} />
  ) : isOrbitalRegime(item) ? (
    <OrbitalRegimeFactSheet regime={item} addBody={addBody} removeBody={removeBody} {...props} />
  ) : isSpacecraft(item) ? (
    <SpacecraftFactSheet spacecraft={item} {...props} />
  ) : (
    <></>
  );
});
