import { Chip, Group, Stack, Text, Title } from '@mantine/core';
import { IconSatellite } from '@tabler/icons-react';
import { useState } from 'react';
import { Spacecraft, SpacecraftVisitType } from '../../lib/spacecraft.ts';
import { CelestialBody } from '../../lib/types.ts';
import { notNullish } from '../../lib/utils.ts';
import { SpacecraftCard } from './SpacecraftCard.tsx';
import styles from './SpacecraftVisits.module.css';

type Props = {
  spacecraft: Array<Spacecraft>;
  body: CelestialBody;
};
export function SpacecraftVisits({ spacecraft, body }: Props) {
  const visitTypes = spacecraft
    .map(({ visited }) => visited.find(({ id }) => id === body.id))
    .filter(notNullish)
    .map(({ type }) => type);
  const visitTypesSet = new Set(visitTypes);
  const [visibleTypes, setVisibleTypes] = useState<Set<SpacecraftVisitType>>(visitTypesSet);

  function toggleVisibleType(type: SpacecraftVisitType) {
    setVisibleTypes(prev => (prev.has(type) ? new Set([...prev].filter(t => t !== type)) : new Set([...prev, type])));
  }

  const visibleSpacecraft = spacecraft.filter(s => {
    const type = s.visited.find(({ id }) => id === body.id)?.type;
    return type != null && visibleTypes.has(type);
  });

  // ensure consistent order by descending degree of involvement
  const visitTypesDisplay = Object.values(SpacecraftVisitType).filter(t => visitTypesSet.has(t));
  return (
    <Stack gap="xs" p="md" pt="lg">
      <Group gap={4}>
        <Title order={5} mr="calc(var(--mantine-spacing-xs) - 4px)">
          Spacecraft Visits
        </Title>
        <Group gap={0}>
          {visitTypesDisplay.map(type => (
            <Chip
              key={type}
              style={{
                '--chip-checked-color': body.style.fgColor,
              }}
              classNames={{ label: styles.VisitTypeChipLabel }}
              checked={visibleTypes.has(type)}
              onClick={() => toggleVisibleType(type)}
              size="xs"
              variant="transparent"
            >
              {type}
            </Chip>
          ))}
        </Group>
      </Group>
      {visibleSpacecraft.length > 0 ? (
        visibleSpacecraft.map((s, i) => <SpacecraftCard key={`${s.name}-${i}`} spacecraft={s} body={body} />)
      ) : (
        <Group gap="xs" p="xl" justify="center">
          <IconSatellite color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" fs="italic" fz="xs">
            No types selected
          </Text>
        </Group>
      )}
    </Stack>
  );
}
