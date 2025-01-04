import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { CelestialBody, OrbitalRegime } from '../../lib/types.ts';
import { Settings } from '../../lib/state.ts';
import { memo } from 'react';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  body?: CelestialBody;
  regime?: OrbitalRegime;
  settings: Settings;
  updateSettings: (update: Partial<Settings>) => void;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export const FactSheet = memo(function FactSheetComponent({
  body,
  regime,
  settings,
  updateSettings,
  addBody,
  removeBody,
}: Props) {
  return body != null ? (
    <CelestialBodyFactSheet body={body} bodies={settings.bodies} updateSettings={updateState} />
  ) : regime != null ? (
    <OrbitalRegimeFactSheet
      regime={regime}
      settings={settings}
      updateSettings={updateSettings}
      addBody={addBody}
      removeBody={removeBody}
    />
  ) : (
    <></>
  );
});
