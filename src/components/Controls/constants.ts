import { AppState } from '../../lib/state.ts';

export const iconSize = 18;
export const buttonGap = 2;

export type AppStateControlProps = {
  state: AppState;
  updateState: (update: Partial<AppState> | ((prev: AppState) => AppState)) => void;
};
