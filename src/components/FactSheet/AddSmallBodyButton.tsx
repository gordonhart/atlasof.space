import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSpherePlus } from '@tabler/icons-react';
import { CelestialBody } from '../../lib/types.ts';
import { AddSmallBodyModal } from '../Controls/AddSmallBodyModal.tsx';
import { iconSize } from '../Controls/constants.ts';

type Props = {
  bodies: Array<CelestialBody>;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export function AddSmallBodyButton({ bodies, addBody, removeBody }: Props) {
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
        Add Asteroids from JPL Small-Body Database
      </Button>
      <AddSmallBodyModal isOpen={isOpen} onClose={onClose} bodies={bodies} addBody={addBody} removeBody={removeBody} />
    </>
  );
}
