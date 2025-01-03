import { Button } from '@mantine/core';
import { IconSpherePlus } from '@tabler/icons-react';
import { iconSize } from '../Controls/constants.ts';
import { AppState } from '../../lib/state.ts';
import { AddSmallBodyModal } from '../Controls/AddSmallBodyModal.tsx';
import { CelestialBody } from '../../lib/types.ts';
import { useDisclosure } from '@mantine/hooks';

type Props = {
  state: AppState;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export function AddSmallBodyButton({ state, addBody, removeBody }: Props) {
  const [isOpen, { open: onOpen, close: onClose }] = useDisclosure(false);

  return (
    <>
      <Button
        size="xl"
        fz="xs"
        color="gray"
        variant="light"
        leftSection={<IconSpherePlus size={iconSize} />}
        onClick={onOpen}
      >
        Add Asteroids
      </Button>
      <AddSmallBodyModal isOpen={isOpen} onClose={onClose} state={state} addBody={addBody} removeBody={removeBody} />
    </>
  );
}
