import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { ReactNode, useMemo, useState } from 'react';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { datetimeToHumanReadable } from '../../../lib/epoch.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, CelestialBodyId, Spacecraft } from '../../../lib/types.ts';
import { DEFAULT_SPACECRAFT_COLOR, notNullish } from '../../../lib/utils.ts';
import { Timeline } from '../Timeline.tsx';
import { MissionEndCard } from './MissionEndCard.tsx';
import { MissionTimelineCard } from './MissionTimelineCard.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';

type Props = {
  spacecraft: Spacecraft;
  bodies: Array<CelestialBody>;
  hover: string | null;
  updateSettings: UpdateSettings;
};
export function MissionTimeline({ spacecraft, bodies, hover, updateSettings }: Props) {
  const padding = useFactSheetPadding();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const bodyById = useMemo(
    () => bodies.reduce<Record<CelestialBodyId, CelestialBody>>((acc, body) => ({ ...acc, [body.id]: body }), {}),
    [JSON.stringify(bodies)]
  );
  const visitedBodies = useMemo(
    () => spacecraft.visited.map(({ id }) => bodyById[id]).filter(notNullish),
    [JSON.stringify(spacecraft), bodyById]
  );

  const StartItem = (
    <Paper p="xs" withBorder onMouseEnter={() => setActiveIndex(0)} onMouseLeave={() => setActiveIndex(null)}>
      {/* TODO: include information about launch (location, vehicle)? */}
      <Group gap={0} align="baseline">
        <Title order={6} mr="xs">
          Launched
        </Title>
        <Text c="dimmed" fz="xs">
          {datetimeToHumanReadable(spacecraft.start)}
        </Text>
      </Group>
    </Paper>
  );

  const VisitItems = visitedBodies.map((body, i) => {
    const visit = spacecraft.visited[i];
    if (visit == null) return null;
    return <MissionTimelineCard body={body} spacecraft={spacecraft} visit={visit} updateSettings={updateSettings} />;
  });

  const EndItem =
    spacecraft.end != null ? (
      <Box onMouseEnter={() => setActiveIndex(VisitItems.length + 1)} onMouseLeave={() => setActiveIndex(null)}>
        <MissionEndCard spacecraft={spacecraft} />
      </Box>
    ) : null;

  const TimelineItems: Array<[Date, ReactNode]> = [
    [spacecraft.start, StartItem],
    ...VisitItems.map<[Date, ReactNode]>((item, i) => [spacecraft.visited[i].start, item]),
    ...(spacecraft.end != null ? ([[spacecraft.end, EndItem]] as Array<[Date, ReactNode]>) : []),
  ];

  const activeBodyIndex = visitedBodies.findIndex(({ id }) => id === hover);
  const timelineActiveIndex = activeIndex ?? (activeBodyIndex >= 0 ? activeBodyIndex + 1 : undefined);

  return (
    <Stack {...padding}>
      <Group gap="xs">
        <Title order={5}>Mission Timeline</Title>
        <SpacecraftStatusPill status={spacecraft.status} />
      </Group>
      <Timeline
        datedItems={TimelineItems}
        activeIndex={timelineActiveIndex}
        end={spacecraft.end}
        accentColor={DEFAULT_SPACECRAFT_COLOR}
      />
    </Stack>
  );
}
