import { Group, TextInput } from '@mantine/core';
import { useSmallBody } from '../../hooks/useSmallBody.ts';
import { useEffect, useState } from 'react';
import { getInitialState } from '../../lib/physics.ts';
import { CelestialBodyState } from '../../lib/types.ts';

type Props = {
  systemState: CelestialBodyState;
};
export function SearchControls({ systemState }: Props) {
  const [value, setValue] = useState('');
  const smallBody = useSmallBody(value);

  useEffect(() => {
    if (smallBody != null) {
      const extraBodyState = getInitialState(systemState, smallBody);
      systemState.satellites.push(extraBodyState);
    }
  }, [JSON.stringify(smallBody)]);

  return (
    <Group gap={4}>
      <TextInput value={value} onChange={event => setValue(event.currentTarget.value)} />
    </Group>
  );
}
