import { memo } from 'react';
import { ModelState, Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, isCelestialBody, isOrbitalRegime, OrbitalRegime, Spacecraft } from '../../lib/types.ts';
import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';
import { SpacecraftFactSheet } from './SpacecraftFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  item: CelestialBody | OrbitalRegime | Spacecraft;
  settings: Settings;
  updateSettings: UpdateSettings;
  model: ModelState;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export const FactSheet = memo(function FactSheetComponent({
  item,
  settings,
  updateSettings,
  model,
  addBody,
  removeBody,
}: Props) {
  return isCelestialBody(item) ? (
    <CelestialBodyFactSheet body={item} bodies={settings.bodies} updateSettings={updateSettings} />
  ) : isOrbitalRegime(item) ? (
    <OrbitalRegimeFactSheet
      regime={item}
      settings={settings}
      updateSettings={updateSettings}
      addBody={addBody}
      removeBody={removeBody}
    />
  ) : model.spacecraft != null ? (
    <SpacecraftFactSheet spacecraft={item} settings={settings} updateSettings={updateSettings} model={model} />
  ) : (
    <></>
  );
});
