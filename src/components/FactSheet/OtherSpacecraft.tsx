import { Group, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { SPACECRAFT, Spacecraft } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { SpacecraftPill } from './SpacecraftPill.tsx';

type Props = {
  spacecraft: Spacecraft;
  updateSettings: UpdateSettings;
};
export function OtherSpacecraft({ spacecraft, updateSettings }: Props) {
  const otherSpacecraft = useMemo(() => SPACECRAFT.filter(({ id }) => id !== spacecraft.id), [spacecraft.id]);

  return (
    <Stack gap="xs" p="md" pt="lg">
      <Title order={5}>Other Spacecraft</Title>
      <Group gap={8}>
        {otherSpacecraft.map((otherSpacecraft, i) => (
          <SpacecraftPill
            key={`${otherSpacecraft.id}-${i}`}
            spacecraft={otherSpacecraft}
            updateSettings={updateSettings}
          />
        ))}
      </Group>
    </Stack>
  );
}
