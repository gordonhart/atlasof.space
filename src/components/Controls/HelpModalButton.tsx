import { ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconInfoHexagon } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useAppState } from '../../lib/state.ts';
import { iconSize } from './constants.ts';
import { HelpModal } from './HelpModal.tsx';

export function HelpModalButton() {
  const updateSettings = useAppState(state => state.updateSettings);
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
        <ActionIcon aria-label="Help" onClick={controls.open}>
          <IconInfoHexagon size={iconSize} />
        </ActionIcon>
      </Tooltip>
      <HelpModal isOpen={isOpen} onClose={closeHelp} />
    </>
  );
}
