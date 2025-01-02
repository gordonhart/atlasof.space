import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import { AppState } from '../lib/state.ts';
import { HelpModal } from '../components/Controls/HelpModal.tsx';

type Params = {
  updateState: (update: Partial<AppState> | ((prev: AppState) => AppState)) => void;
};
export function useHelpModal({ updateState }: Params) {
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

  return {
    Component: <HelpModal isOpen={isOpen} onClose={closeHelp} updateState={updateState} />,
    open: openHelp,
  };
}
