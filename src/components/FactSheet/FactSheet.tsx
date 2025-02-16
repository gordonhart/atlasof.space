import { memo } from 'react';
import { FocusItem, FocusItemType } from '../../hooks/useFocusItem.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyId } from '../../lib/types.ts';
import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';
import { SpacecraftOrganizationFactSheet } from './Organization/SpacecraftOrganizationFactSheet.tsx';
import { SpacecraftFactSheet } from './Spacecraft/SpacecraftFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  item: FocusItem;
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
  return item.type === FocusItemType.CELESTIAL_BODY ? (
    <CelestialBodyFactSheet body={item.item} settings={settings} {...props} />
  ) : item.type === FocusItemType.ORBITAL_REGIME ? (
    <OrbitalRegimeFactSheet regime={item.item} addBody={addBody} removeBody={removeBody} {...props} />
  ) : item.type === FocusItemType.SPACECRAFT ? (
    <SpacecraftFactSheet spacecraft={item.item} hover={settings.hover} {...props} />
  ) : item.type === FocusItemType.ORGANIZATION ? (
    <SpacecraftOrganizationFactSheet organization={item.item} {...props} />
  ) : (
    <></>
  );
});
