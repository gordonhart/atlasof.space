import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useMemo } from 'react';
import {
  CelestialBody,
  CelestialBodyType,
  Spacecraft,
  SpacecraftVisit,
  SpacecraftVisitType,
} from '../../../lib/types.ts';
import styles from '../BodyCard.module.css';
import { CelestialBodyThumbnail } from '../CelestialBodyThumbnail.tsx';
import { Thumbnail } from '../Thumbnail.tsx';

const N_BODIES = 3;

type Props = {
  spacecraft: Spacecraft;
  bodies: Array<CelestialBody>;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};
export function CompactSpacecraftCard({ spacecraft, bodies, onClick, onMouseEnter, onMouseLeave }: Props) {
  const visitedBodies = useMemo(() => {
    const bodyById = Object.fromEntries(bodies.map(body => [body.id, body]));
    return spacecraft.visited
      .map<[SpacecraftVisit, CelestialBody]>(visit => [visit, bodyById[visit.id]])
      .sort((a, b) => sortFactor(...a) - sortFactor(...b))
      .map(([, body]) => body);
  }, [JSON.stringify(spacecraft), JSON.stringify(bodies)]);

  return (
    <Paper
      className={styles.Card}
      withBorder
      p={8}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ overflow: 'auto' }}
    >
      <Group gap="xs" wrap="nowrap">
        <Box w={80} style={{ flexShrink: 0 }}>
          <Thumbnail thumbnail={spacecraft.thumbnail} alt={spacecraft.name} size={80} radius="xs" />
        </Box>
        <Group gap={0} justify="space-between" flex={1}>
          <Stack gap={0} mr="xs">
            <Title order={6} mr="xs">
              {spacecraft.name}
            </Title>
            <Text fz="xs" c="dimmed">
              {spacecraft.start.getFullYear()}
              {spacecraft.end?.getFullYear() !== spacecraft.start.getFullYear()
                ? ` - ${spacecraft.end?.getFullYear() ?? 'Now'}`
                : ''}
            </Text>
          </Stack>

          <Group gap={4} justify="flex-end" flex={1} wrap="nowrap" style={{ flexShrink: 0 }}>
            {visitedBodies.slice(0, N_BODIES).map((body, i) => (
              <Box key={`${body.id}-${i}`} w={32}>
                <CelestialBodyThumbnail body={body} size={32} />
              </Box>
            ))}
            {visitedBodies.length - N_BODIES > 0 && (
              <Text c="dimmed" size="xs">
                +{visitedBodies.length - N_BODIES}
              </Text>
            )}
          </Group>
        </Group>
      </Group>
    </Paper>
  );
}

// 0 is more important
const VISIT_IMPORTANCE: Record<SpacecraftVisitType, number> = {
  [SpacecraftVisitType.HELICOPTER]: 0,
  [SpacecraftVisitType.ROVER]: 0,
  [SpacecraftVisitType.LANDER]: 1,
  [SpacecraftVisitType.IMPACTOR]: 2,
  [SpacecraftVisitType.ORBITER]: 3,
  [SpacecraftVisitType.FLYBY]: 4,
  [SpacecraftVisitType.GRAVITY_ASSIST]: 5,
};
const BODY_IMPORTANCE: Record<CelestialBodyType, number> = {
  [CelestialBodyType.STAR]: 0,
  [CelestialBodyType.PLANET]: 1,
  [CelestialBodyType.DWARF_PLANET]: 2,
  [CelestialBodyType.MOON]: 3,
  [CelestialBodyType.ASTEROID]: 4,
  [CelestialBodyType.COMET]: 5,
  [CelestialBodyType.TRANS_NEPTUNIAN_OBJECT]: 6,
  [CelestialBodyType.SPACECRAFT]: 7,
};
function sortFactor(visit: SpacecraftVisit, body: CelestialBody): number {
  const major = VISIT_IMPORTANCE[visit.type];
  const minor = BODY_IMPORTANCE[body.type];
  return Number(`${major}.${minor}`);
}
