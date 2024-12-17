import { AppState } from '../../lib/state.ts';

export const iconSize = 18;
export const buttonGap = 2;

export type AppStateControlProps = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
};
