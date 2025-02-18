import { Group } from '@mantine/core';
import { buttonGap } from './constants.ts';
import { HelpModalButton } from './HelpModalButton.tsx';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { SettingsMenu } from './SettingsMenu.tsx';

type Props = {
  reset: () => void;
};
export function GeneralControls({ reset }: Props) {
  return (
    <Group gap={buttonGap}>
      <SettingsMenu reset={reset} />
      <HelpModalButton />
      <SelectOmnibox />
    </Group>
  );
}
