import { Box, Group, Paper, Text, Title } from '@mantine/core';
import { useSpacecraftSummaryStream } from '../../../hooks/useSpacecraftSummaryStream.ts';
import { useSpacecraftVisit } from '../../../hooks/useSpacecraftVisit.ts';
import { CelestialBody, OrbitalRegime, Spacecraft, SpacecraftVisitType } from '../../../lib/types.ts';
import styles from '../BodyCard.module.css';
import { LoadingCursor } from '../LoadingCursor.tsx';
import { Thumbnail } from '../Thumbnail.tsx';
import { SpacecraftOrganizationPill } from './SpacecraftOrganizationPill.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';

type Props = {
  spacecraft: Spacecraft;
  body?: CelestialBody;
  regime?: OrbitalRegime;
  onClick: () => void;
  compact?: boolean;
};
export function SpacecraftCard({ spacecraft, body, regime, onClick, compact = false }: Props) {
  const visit = useSpacecraftVisit({ spacecraft, body });
  const summaryParams =
    body != null && visit != null
      ? { type: 'visit' as const, spacecraft, body, visit }
      : regime != null
        ? { type: 'regime' as const, spacecraft, regime }
        : { type: 'summary' as const, spacecraft };
  const { data: summary, isLoading } = useSpacecraftSummaryStream(summaryParams);

  const visitPastTense = visit != null && visit.start < new Date();
  // prettier-ignore
  const visitVerb =
    visit?.type === SpacecraftVisitType.ROVER || visit?.type === SpacecraftVisitType.LANDER
      ? (visitPastTense ? 'landed' : 'planning to land')
      : visit?.type === SpacecraftVisitType.ORBITER
        ? (visitPastTense ? 'entered orbit' : 'planning to enter orbit')
        : visit?.type === SpacecraftVisitType.HELICOPTER
          ? (visitPastTense ? 'started flying' : 'planning to start flying')
          : (visitPastTense ? 'visited' : 'planning to visit');
  const visitBlurb = visit != null ? `, ${visitVerb} in ${visit.start.getFullYear()}` : '';

  return (
    <Paper className={styles.Card} withBorder p="xs" style={{ overflow: 'auto' }} onClick={onClick}>
      {spacecraft.thumbnail != null && (
        <Box ml="xs" style={{ float: 'right' }}>
          <Thumbnail thumbnail={spacecraft.thumbnail} size={100} />
        </Box>
      )}
      <Group gap={4} align="center">
        <Group gap={0} mr={8}>
          <Title order={6} mr="xs">
            {spacecraft.name}
          </Title>
          {visit != null && (
            <Text c="dimmed" fz="sm" fs="italic">
              {visit.type}
            </Text>
          )}
        </Group>
        {!compact && (
          <Group gap={8}>
            <SpacecraftOrganizationPill organization={spacecraft.organization} />
            <SpacecraftStatusPill status={spacecraft.status} />
          </Group>
        )}
      </Group>
      {!compact && (
        <Text mt={4} fz="xs" fs="italic">
          Launched in {spacecraft.start.getFullYear()}
          {visitBlurb}
        </Text>
      )}
      {(spacecraft.crew?.length ?? 0 > 0) && !compact && (
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
