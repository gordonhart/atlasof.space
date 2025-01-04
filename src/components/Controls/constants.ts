import { Settings } from '../../lib/state.ts';

export const iconSize = 18;
export const buttonGap = 4;

export type SettingsControlProps = {
  settings: Settings;
  updateSettings: (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
};
