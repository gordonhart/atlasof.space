import { Box, Group, Paper, Text, Title } from '@mantine/core';
import { useSummaryStream } from '../../../hooks/useSummaryStream.ts';
import { CelestialBody, Spacecraft, SpacecraftVisitType } from '../../../lib/types.ts';
import styles from '../BodyCard.module.css';
import { LoadingCursor } from '../LoadingCursor.tsx';
import { Thumbnail } from '../Thumbnail.tsx';
import { SpacecraftOrganizationPill } from './SpacecraftOrganizationPill.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';

type Props = {
  spacecraft: Spacecraft;
  body: CelestialBody;
  onClick: () => void;
};
export function SpacecraftCard({ spacecraft, body, onClick }: Props) {
  const { data: summary, isLoading } = useSummaryStream(spacecraft);
  const visitInfo = spacecraft.visited.find(({ id }) => id === body.id)!;
  const visitPastTense = visitInfo.start < new Date();
  // prettier-ignore
  const visitVerb =
    visitInfo.type === SpacecraftVisitType.ROVER || visitInfo.type === SpacecraftVisitType.LANDER
      ? (visitPastTense ? 'landed' : 'planning to land')
      : visitInfo.type === SpacecraftVisitType.ORBITER
        ? (visitPastTense ? 'entered orbit' : 'planning to enter orbit')
        : visitInfo.type === SpacecraftVisitType.HELICOPTER
          ? (visitPastTense ? 'started flying' : 'planning to start flying')
          : (visitPastTense ? 'visited' : 'planning to visit');
  return (
    <Paper className={styles.Card} withBorder p="xs" style={{ overflow: 'auto' }} onClick={onClick}>
      {spacecraft.thumbnail != null && (
        <Box ml="xs" style={{ float: 'right' }}>
          <Thumbnail thumbnail={spacecraft.thumbnail} size={100} />
        </Box>
      )}
      <Group gap={4} align="center">
        <Group gap="xs" mr={8}>
          <Title order={6}>{spacecraft.name}</Title>
          <Text c="dimmed" fz="sm" fs="italic">
            {visitInfo.type}
          </Text>
        </Group>
        <Group gap="xs" wrap="nowrap">
          <SpacecraftOrganizationPill organization={spacecraft.organization} />
          <SpacecraftStatusPill status={spacecraft.status} />
        </Group>
      </Group>
      <Text mt={4} fz="xs" fs="italic">
        Launched in {spacecraft.start.getFullYear()}, {visitVerb} in {visitInfo.start.getFullYear()}
      </Text>
      {(spacecraft.crew?.length ?? 0 > 0) && (
        <Text mt={4} fz="xs">
          Crewed by {(spacecraft?.crew ?? []).join(', ')}
        </Text>
      )}
      <Text mt={4} c="dimmed" fz="xs">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Paper>
  );
}
