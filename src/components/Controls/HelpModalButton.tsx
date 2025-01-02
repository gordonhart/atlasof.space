import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { AppStateControlProps, iconSize } from './constants.ts';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import { HelpModal } from './HelpModal.tsx';

export function HelpModalButton({ state, updateState }: AppStateControlProps) {
  const [hasSeenHelpModal, setHasSeenHelpModal] = useLocalStorage({
    key: 'has-seen-help-modal',
    getInitialValueInEffect: false,
  });
  const [isOpen, controls] = useDisclosure(false);

  function openHelp() {
    updateState({ play: false });
    controls.open();
  }

  function closeHelp() {
    updateState({ play: true });
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
      <HelpModal isOpen={isOpen} onClose={closeHelp} state={state} updateState={updateState} />,
    </>
  );
}
