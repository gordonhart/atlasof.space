import { memo } from 'react';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import {
  CelestialBody,
  CelestialBodyId,
  isCelestialBody,
  isOrbitalRegime,
  isOrganization,
  isSpacecraft,
  OrbitalRegime,
  Spacecraft,
  SpacecraftOrganization,
} from '../../lib/types.ts';
import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';
import { SpacecraftOrganizationFactSheet } from './Organization/SpacecraftOrganizationFactSheet.tsx';
import { SpacecraftFactSheet } from './Spacecraft/SpacecraftFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  item: CelestialBody | OrbitalRegime | Spacecraft | SpacecraftOrganization;
  settings: Settings;
  updateSettings: UpdateSettings;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: CelestialBodyId) => void;
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
    <SpacecraftFactSheet spacecraft={item} hover={settings.hover} {...props} />
  ) : isOrganization(item) ? (
    <SpacecraftOrganizationFactSheet organization={item} {...props} />
  ) : (
    <></>
  );
});
