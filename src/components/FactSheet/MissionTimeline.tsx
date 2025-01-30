import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { useSummaryStreamRaw } from '../../hooks/useSummaryStream.ts';
import { Spacecraft, SpacecraftVisit } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyId } from '../../lib/types.ts';
import { DEFAULT_SPACECRAFT_COLOR, notNullish } from '../../lib/utils.ts';
import styles from './BodyCard.module.css';
import { CelestialBodyThumbnail } from './CelestialBodyThumbnail.tsx';
import { LoadingCursor } from './LoadingCursor.tsx';

const TIMELINE_WIDTH = 100;

type Props = {
  spacecraft: Spacecraft;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
};
export function MissionTimeline({ spacecraft, bodies, updateSettings }: Props) {
  const { ref: timelineRef, height } = useElementSize();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bodyById = useMemo(
    () => bodies.reduce<Record<CelestialBodyId, CelestialBody>>((acc, body) => ({ ...acc, [body.id]: body }), {}),
    [JSON.stringify(bodies)]
  );

  useEffect(() => {
    if (canvasRef.current == null) return;
    const dpr = window.devicePixelRatio ?? 1;
    canvasRef.current.width = TIMELINE_WIDTH * dpr;
    canvasRef.current.height = height * dpr;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx == null) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = DEFAULT_SPACECRAFT_COLOR;
    ctx.fillRect(0, 0, TIMELINE_WIDTH, height);
  }, [canvasRef.current, height]);

  const visitedBodies = spacecraft.visited.map(({ id }) => bodyById[id]).filter(notNullish);
  return (
    <Stack gap="xs" p="md" pt="lg">
      <Title order={5}>Mission Timeline</Title>
      <Group wrap="nowrap" flex={1}>
        <Box w={TIMELINE_WIDTH} h="100%" style={{ flexShrink: 0 }}>
          <canvas ref={canvasRef} style={{ height: '100%', width: TIMELINE_WIDTH }} />
        </Box>
        <Stack ref={timelineRef} gap="xs" flex={1}>
          {visitedBodies.map((body, i) => {
            const visit = spacecraft.visited[i];
            if (visit == null) return null;
            return (
              <MissionVisitCard
                key={`${body.name}-${i}`}
                body={body}
                spacecraft={spacecraft}
                visit={visit}
                updateSettings={updateSettings}
              />
            );
          })}
        </Stack>
      </Group>
    </Stack>
  );
}

type MissionVisitCardProps = {
  body: CelestialBody;
  spacecraft: Spacecraft;
  visit: SpacecraftVisit;
  updateSettings: UpdateSettings;
};
function MissionVisitCard({ body, spacecraft, visit, updateSettings }: MissionVisitCardProps) {
  // TODO: this probably needs a dedicated endpoint with different example prompts -- the summary stream endpoint is too
  //  focused on summarizing an entity, rather than an event
  const { data: summary, isLoading } = useSummaryStreamRaw(
    `the encounter between the spacecraft ${spacecraft.name} and ${body.name}`
  );
  return (
    <Paper
      className={styles.Card}
      withBorder
      p="xs"
      onClick={() => updateSettings({ center: body.id, hover: null })}
      onMouseEnter={() => updateSettings({ hover: body.id })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      <Box ml="xs" style={{ float: 'right' }}>
        <CelestialBodyThumbnail body={body} size={100} />
      </Box>
      <Group gap="xs" align="baseline">
        <Title order={6}>{body.name}</Title>
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
