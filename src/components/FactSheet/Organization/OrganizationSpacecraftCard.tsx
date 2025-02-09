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
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};
export function OrganizationSpacecraftCard({ spacecraft, bodies, onClick, onMouseEnter, onMouseLeave }: Props) {
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
          <Thumbnail thumbnail={spacecraft.thumbnail} size={80} radius="xs" />
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
function sortFactor(visit: SpacecraftVisit, body: CelestialBody): number {
  const major = spacecraftVisitFactor(visit);
  const minor = celestialBodyTypeFactor(body);
  return Number(`${major}.${minor}`);
}

function spacecraftVisitFactor(visit: SpacecraftVisit) {
  switch (visit.type) {
    case SpacecraftVisitType.HELICOPTER:
    case SpacecraftVisitType.ROVER:
      return 0;
    case SpacecraftVisitType.LANDER:
      return 1;
    case SpacecraftVisitType.IMPACTOR:
      return 2;
    case SpacecraftVisitType.ORBITER:
      return 3;
    case SpacecraftVisitType.FLYBY:
      return 4;
    case SpacecraftVisitType.GRAVITY_ASSIST:
      return 5;
  }
}

function celestialBodyTypeFactor(body: CelestialBody) {
  switch (body.type) {
    case CelestialBodyType.STAR:
      return 0;
    case CelestialBodyType.PLANET:
      return 1;
    case CelestialBodyType.DWARF_PLANET:
      return 2;
    case CelestialBodyType.MOON:
      return 3;
    case CelestialBodyType.ASTEROID:
      return 4;
    case CelestialBodyType.COMET:
      return 5;
    case CelestialBodyType.TRANS_NEPTUNIAN_OBJECT:
      return 6;
    case CelestialBodyType.SPACECRAFT:
      return 7;
  }
}
