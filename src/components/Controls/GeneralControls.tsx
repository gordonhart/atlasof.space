import { Group } from '@mantine/core';
import { memo } from 'react';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { buttonGap } from './constants.ts';
import { HelpModalButton } from './HelpModalButton.tsx';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { SettingsMenu } from './SettingsMenu.tsx';

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
  reset: () => void;
};
export const GeneralControls = memo(function GeneralControlsComponent({ settings, updateSettings, reset }: Props) {
  return (
    <Group gap={buttonGap}>
      <SelectOmnibox settings={settings} updateSettings={updateSettings} />
      <HelpModalButton settings={settings} updateSettings={updateSettings} />
      <SettingsMenu settings={settings} updateSettings={updateSettings} reset={reset} />
    </Group>
  );
});
