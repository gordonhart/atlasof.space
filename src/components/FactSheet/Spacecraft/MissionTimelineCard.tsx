import { Box, Group, Paper, Text, Title } from '@mantine/core';
import { useSpacecraftVisitSummaryStream } from '../../../hooks/useSpacecraftVisitSummaryStream.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, Spacecraft, SpacecraftVisit } from '../../../lib/types.ts';
import styles from '../BodyCard.module.css';
import { CelestialBodyThumbnail } from '../CelestialBodyThumbnail.tsx';
import { LoadingCursor } from '../LoadingCursor.tsx';

type Props = {
  body: CelestialBody;
  spacecraft: Spacecraft;
  visit: SpacecraftVisit;
  updateSettings: UpdateSettings;
};
export function MissionTimelineCard({ body, spacecraft, visit, updateSettings }: Props) {
  const { data: summary, isLoading } = useSpacecraftVisitSummaryStream(spacecraft, body, visit);
  return (
    <Paper
      className={styles.Card}
      withBorder
      p="xs"
      onClick={() => updateSettings({ center: body.id, hover: null })}
      onMouseEnter={() => updateSettings({ hover: body.id })}
      onMouseLeave={() => updateSettings({ hover: null })}
      style={{ overflow: 'auto' }}
    >
      <Box ml="xs" style={{ float: 'right' }}>
        <CelestialBodyThumbnail body={body} size={100} />
      </Box>
      <Group gap={0} align="baseline">
        <Title order={6} mr="xs">
          {body.name}
        </Title>
        <Text c="dimmed" fs="italic" fz="sm">
          {visit.type}
        </Text>
      </Group>
      <Text mt={4} inherit c="dimmed" fz="xs">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Paper>
  );
}
