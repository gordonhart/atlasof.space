import { Box, Group, Paper, Pill, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { Spacecraft, SpacecraftOrganization } from '../../lib/spacecraft.ts';
import { CelestialBody } from '../../lib/types.ts';
import styles from './BodyCard.module.css';
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
  const visitInfo = spacecraft.visited.find(({ id }) => id === body.id)!;
  return (
    <UnstyledButton component="a" href={spacecraft.wiki} target="_blank">
      <Paper className={styles.Card} withBorder p="xs">
        <Group gap="xs" justify="space-between" align="flex-start">
          <Stack gap={4} align="flex-start">
            <Group gap="xs" align="baseline">
              <Title order={6}>{spacecraft.name}</Title>
              <SpacecraftOrganizationPill organization={spacecraft.organization} />
              <Text c="dimmed" fz="sm" fs="italic">
                {visitInfo.type}
              </Text>
            </Group>
            <Text c="dimmed" fz="xs">
              Launched in {spacecraft.start.getFullYear()}, visited in {visitInfo.start.getFullYear()}
            </Text>
          </Stack>
          <Box style={{ flexShrink: 0 }}>
            <Thumbnail thumbnail={spacecraft.thumbnail} size={100} />
          </Box>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}

type SpacecraftOrganizationPillProps = {
  organization: SpacecraftOrganization;
};
function SpacecraftOrganizationPill({ organization }: SpacecraftOrganizationPillProps) {
  return (
    <Box style={{ flexShrink: 0 }}>
      <Pill>
        <Group w="100%" gap={8} wrap="nowrap">
          <Thumbnail size={14} thumbnail={organization.thumbnail} />
          <Text inherit style={{ display: 'flex', flexShrink: 0 }}>
            {organization.name}
          </Text>
        </Group>
      </Pill>
    </Box>
  );
}
