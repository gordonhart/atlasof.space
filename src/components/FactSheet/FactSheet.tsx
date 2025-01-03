import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { CelestialBody, OrbitalRegime } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import { memo } from 'react';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';

type Props = {
  body?: CelestialBody;
  regime?: OrbitalRegime;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
  width?: number;
};
export const FactSheet = memo(function FactSheetComponent({ body, regime, bodies, updateState, width }: Props) {
  return body != null ? (
    <CelestialBodyFactSheet body={body} bodies={bodies} updateState={updateState} width={width} />
  ) : regime != null ? (
    <OrbitalRegimeFactSheet regime={regime} bodies={bodies} updateState={updateState} width={width} />
  ) : (
    <></>
  );
});
