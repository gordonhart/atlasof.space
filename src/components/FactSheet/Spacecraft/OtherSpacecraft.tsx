import { Group, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { SPACECRAFT } from '../../../lib/data/spacecraft/spacecraft.ts';
import { Spacecraft } from '../../../lib/types.ts';
import { SpacecraftPill } from './SpacecraftPill.tsx';

const N_RELATED = 7;

type Props = {
  spacecraft: Spacecraft;
};
export function OtherSpacecraft({ spacecraft }: Props) {
  const padding = useFactSheetPadding();

  const otherSpacecraft = useMemo(() => {
    const otherSpacecraft = SPACECRAFT.filter(({ id }) => id !== spacecraft.id);
    const spacecraftIndex = SPACECRAFT.findIndex(({ id }) => id === spacecraft.id);
    const nAbove = otherSpacecraft.length - spacecraftIndex;
    const startIndex = Math.max(0, spacecraftIndex - Math.max(N_RELATED / 2, N_RELATED - nAbove));
    return otherSpacecraft.slice(startIndex, startIndex + N_RELATED);
  }, [spacecraft.id]);

  return (
    <Stack gap="xs" {...padding}>
      <Title order={5}>Other Spacecraft</Title>
      <Group gap={8}>
        {otherSpacecraft.map((otherSpacecraft, i) => (
          <SpacecraftPill key={`${otherSpacecraft.id}-${i}`} spacecraft={otherSpacecraft} />
        ))}
      </Group>
    </Stack>
  );
}
