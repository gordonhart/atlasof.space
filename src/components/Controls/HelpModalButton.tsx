import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { iconSize } from './constants.ts';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import { HelpModal } from './HelpModal.tsx';
import { Settings, UpdateSettings } from '../../lib/state.ts';

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
          <IconHelp size={iconSize} />
        </ActionIcon>
      </Tooltip>
      <HelpModal isOpen={isOpen} onClose={closeHelp} settings={settings} updateSettings={updateSettings} />
    </>
  );
}
