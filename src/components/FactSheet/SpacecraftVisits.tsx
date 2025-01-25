import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Spacecraft } from '../../lib/spacecraft.ts';
import { CelestialBody } from '../../lib/types.ts';
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
    <Paper withBorder p="xs">
      <Group gap={8} align="baseline">
        <Title order={6}>{spacecraft.name}</Title>
        <Text c="dimmed" fz="xs">
          Launched in {spacecraft.start.getFullYear()}, visited in {visitInfo.start.getFullYear()}
        </Text>
      </Group>
      <Box ml="xs" style={{ float: 'right' }}>
        <Thumbnail thumbnail={spacecraft.thumbnail} size={100} />
      </Box>
    </Paper>
  );
}
