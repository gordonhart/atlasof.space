import { Group } from '@mantine/core';
import { memo } from 'react';
import { buttonGap } from './constants.ts';
import { HelpModalButton } from './HelpModalButton.tsx';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { SettingsMenu } from './SettingsMenu.tsx';

export const GeneralControls = memo(function GeneralControlsComponent() {
  return (
    <Group gap={buttonGap}>
      <SettingsMenu />
      <HelpModalButton />
      <SelectOmnibox />
    </Group>
  );
});
