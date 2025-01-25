import { Box, Group, Paper, Pill, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { Spacecraft, SPACECRAFT_ORGANIZATIONS, SpacecraftOrganization } from '../../lib/spacecraft.ts';
import { CelestialBody } from '../../lib/types.ts';
import styles from './BodyCard.module.css';
import { LoadingCursor } from './LoadingCursor.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';
import { Thumbnail } from './Thumbnail.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body: CelestialBody;
};
export function SpacecraftVisits({ spacecraft, body }: Props) {
  return (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Spacecraft Visits</Title>
      {spacecraft.map((s, i) => (
        <SpacecraftCard key={`${s.name}-${i}`} spacecraft={s} body={body} />
      ))}
    </Stack>
  );
}

type SpacecraftCardProps = {
  spacecraft: Spacecraft;
  body: CelestialBody;
};
function SpacecraftCard({ spacecraft, body }: SpacecraftCardProps) {
  const { data: summary, isLoading } = useSummaryStream(spacecraft);
  const visitInfo = spacecraft.visited.find(({ id }) => id === body.id)!;
  return (
    <UnstyledButton component="a" href={spacecraft.wiki} target="_blank">
      <Paper className={styles.Card} withBorder p="xs" style={{ overflow: 'auto' }}>
        {spacecraft.thumbnail != null && (
          <Box ml="xs" style={{ float: 'right' }}>
            <Thumbnail thumbnail={spacecraft.thumbnail} size={100} />
          </Box>
        )}
        <Group gap="xs" align="center">
          <Title order={6}>{spacecraft.name}</Title>
          <Text c="dimmed" fz="sm" fs="italic">
            {visitInfo.type}
          </Text>
          <SpacecraftOrganizationPill organization={spacecraft.organization} />
          <SpacecraftStatusPill status={spacecraft.status} />
        </Group>
        <Text mt={4} fz="xs" fs="italic">
          Launched in {spacecraft.start.getFullYear()}, visited in {visitInfo.start.getFullYear()}
        </Text>
        <Text mt={4} c="dimmed" fz="xs">
          {summary}
          {isLoading && <LoadingCursor />}
        </Text>
      </Paper>
    </UnstyledButton>
  );
}

type SpacecraftOrganizationPillProps = {
  organization: SpacecraftOrganization;
};
function SpacecraftOrganizationPill({ organization }: SpacecraftOrganizationPillProps) {
  const details = SPACECRAFT_ORGANIZATIONS[organization];
  return (
    <Box style={{ flexShrink: 0 }}>
      <Pill>
        <Group gap={8} wrap="nowrap">
          <Thumbnail size={14} thumbnail={details.thumbnail} />
          {details.shortName}
        </Group>
      </Pill>
    </Box>
  );
}
