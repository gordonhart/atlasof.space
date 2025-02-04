import { Group, Paper, Text, Title } from '@mantine/core';
import { useSpacecraftVisitSummaryStream } from '../../../hooks/useSpacecraftVisitSummaryStream.ts';
import { datetimeToHumanReadable } from '../../../lib/epoch.ts';
import { Spacecraft } from '../../../lib/types.ts';
import { LoadingCursor } from '../LoadingCursor.tsx';

type Props = {
  spacecraft: Spacecraft;
};
export function MissionEndCard({ spacecraft }: Props) {
  const { data: summary, isLoading } = useSpacecraftVisitSummaryStream({ search: { type: 'end', spacecraft } });
  return (
    <Paper p="xs" withBorder>
      <Group gap={0} align="baseline">
        <Title order={6} mr="xs">
          {spacecraft.status.status ?? 'Mission End'}
        </Title>
        <Text c="dimmed" fz="xs">
          {datetimeToHumanReadable(spacecraft?.end ?? new Date())}
        </Text>
      </Group>
      <Text mt={4} inherit c="dimmed" fz="xs">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Paper>
  );
}
