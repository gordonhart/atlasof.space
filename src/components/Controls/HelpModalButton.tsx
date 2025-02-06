import { ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconInfoHexagon } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { iconSize } from './constants.ts';
import { HelpModal } from './HelpModal.tsx';

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
};
export function HelpModalButton({ settings, updateSettings }: Props) {
  const [hasSeenHelpModal, setHasSeenHelpModal] = useLocalStorage({
    key: 'has-seen-help-modal',
    getInitialValueInEffect: false,
  });
  const [isOpen, controls] = useDisclosure(false);

  function openHelp() {
    updateSettings({ play: false });
    controls.open();
  }

  function closeHelp() {
    updateSettings({ play: true });
    controls.close();
    setHasSeenHelpModal('true');
  }

  useEffect(() => {
    if (hasSeenHelpModal !== 'true') openHelp();
  }, [hasSeenHelpModal]);

  return (
    <>
      <Tooltip position="top" label="Help">
        <ActionIcon onClick={controls.open}>
          <IconInfoHexagon size={iconSize} />
        </ActionIcon>
      </Tooltip>
      <HelpModal isOpen={isOpen} onClose={closeHelp} settings={settings} updateSettings={updateSettings} />
    </>
  );
}
