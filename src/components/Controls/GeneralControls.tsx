import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconCircle, IconCircleDot, IconRestore, IconTagMinus, IconTagPlus } from '@tabler/icons-react';
import { memo } from 'react';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { buttonGap, iconSize } from './constants.ts';
import { HelpModalButton } from './HelpModalButton.tsx';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { VisibilityControls } from './VisibilityControls.tsx';

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
  reset: () => void;
};
export const GeneralControls = memo(function GeneralControlsComponent({ settings, updateSettings, reset }: Props) {
  return (
    <Group gap={buttonGap}>
      <SelectOmnibox settings={settings} updateSettings={updateSettings} />

      <Tooltip position="top" label={`${settings.drawOrbit ? 'Hide' : 'Show'} Orbits`}>
        <ActionIcon onClick={() => updateSettings({ drawOrbit: !settings.drawOrbit })}>
          {settings.drawOrbit ? <IconCircleDot size={iconSize} /> : <IconCircle size={iconSize} />}
        </ActionIcon>
      </Tooltip>

      <Tooltip position="top" label={`${settings.drawLabel ? 'Hide' : 'Show'} Labels`}>
        <ActionIcon onClick={() => updateSettings({ drawLabel: !settings.drawLabel })}>
          {settings.drawLabel ? <IconTagMinus size={iconSize} /> : <IconTagPlus size={iconSize} />}
        </ActionIcon>
      </Tooltip>

      <VisibilityControls settings={settings} updateSettings={updateSettings} />

      <Tooltip position="top" label="Reset">
        <ActionIcon onClick={reset}>
          <IconRestore size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <HelpModalButton settings={settings} updateSettings={updateSettings} />
    </Group>
  );
});
