import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { CelestialBody, OrbitalRegime } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import { memo } from 'react';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  body?: CelestialBody;
  regime?: OrbitalRegime;
  state: AppState;
  updateState: (update: Partial<AppState>) => void;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export const FactSheet = memo(function FactSheetComponent({
  body,
  regime,
  state,
  updateState,
  addBody,
  removeBody,
}: Props) {
  return body != null ? (
    <CelestialBodyFactSheet body={body} bodies={state.bodies} updateState={updateState} />
  ) : regime != null ? (
    <OrbitalRegimeFactSheet
      regime={regime}
      state={state}
      updateState={updateState}
      addBody={addBody}
      removeBody={removeBody}
    />
  ) : (
    <></>
  );
});
