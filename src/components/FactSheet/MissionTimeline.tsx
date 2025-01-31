import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { useSpacecraftVisitSummaryStream } from '../../hooks/useSpacecraftVisitSummaryStream.ts';
import { Spacecraft, SpacecraftVisit } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyId, Point2 } from '../../lib/types.ts';
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
  const cardRefs = useRef<Array<HTMLDivElement>>([]);
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
  }, [canvasRef.current, height]);

  const visitedBodies = spacecraft.visited.map(({ id }) => bodyById[id]).filter(notNullish);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (timelineRef.current == null || ctx == null) return;
    const containerRect = timelineRef.current.getBoundingClientRect();
    const containerTop = containerRect.top;
    const cards = cardRefs.current.map((card, i) => {
      const { height, top } = card.getBoundingClientRect();
      return { height, top: top - containerTop, date: spacecraft.visited[i].start };
    });
    renderTimeline(ctx, cards, spacecraft.start, spacecraft.end);
  }, [JSON.stringify(visitedBodies), height]);

  return (
    <Stack gap="xs" p="md" pt="lg">
      <Title order={5}>Mission Timeline</Title>
      <Group gap={0} wrap="nowrap" flex={1}>
        <Box w={TIMELINE_WIDTH} h="100%" style={{ flexShrink: 0 }}>
          <canvas ref={canvasRef} style={{ height: '100%', width: TIMELINE_WIDTH }} />
        </Box>
        <Stack ref={timelineRef} gap="xs" flex={1}>
          {visitedBodies.map((body, i) => {
            const visit = spacecraft.visited[i];
            if (visit == null) return null;
            return (
              <Box
                key={`${body.name}-${i}`}
                ref={el => {
                  if (el == null) return;
                  cardRefs.current[i] = el;
                }}
              >
                <MissionVisitCard body={body} spacecraft={spacecraft} visit={visit} updateSettings={updateSettings} />
              </Box>
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

type VisitCardPosition = {
  height: number;
  top: number;
  date: Date;
};
function renderTimeline(ctx: CanvasRenderingContext2D, cards: Array<VisitCardPosition>, start: Date, end?: Date) {
  const startMillis = start.getTime();
  const endMillis = Math.max(...[...cards.map(({ date }) => date.getTime())], end?.getTime() ?? Date.now());
  const durationMillis = endMillis - startMillis;
  const dpr = window.devicePixelRatio || 1;
  const millisPerPx = (durationMillis / ctx.canvas.height) * dpr;

  const dotRadius = 4;
  const timelineLeft = dotRadius + 1;
  ctx.lineWidth = 1;
  ctx.strokeStyle = DEFAULT_SPACECRAFT_COLOR;
  ctx.fillStyle = '#000000';

  ctx.clearRect(0, 0, TIMELINE_WIDTH, ctx.canvas.height);
  ctx.moveTo(timelineLeft, 0);
  ctx.lineTo(timelineLeft, ctx.canvas.height);
  ctx.stroke();

  // TODO: more advanced logic to figure out the smallest number of lanes necessary to avoid overlaps
  const nLanes = Math.ceil(cards.length / 2);
  const lanesGutter = 20;
  const laneWidth = (TIMELINE_WIDTH - 2 * lanesGutter - timelineLeft) / nLanes;

  cards.forEach(({ top, height, date }, i) => {
    const elapsedMillis = date.getTime() - startMillis;
    const timelineY = elapsedMillis / millisPerPx;
    const laneX = lanesGutter + (i > nLanes ? nLanes - (i % nLanes) : i) * laneWidth;
    const cardY = top + height / 2;
    ctx.moveTo(timelineLeft, timelineY);
    ctx.lineTo(timelineLeft + laneX, timelineY);
    ctx.lineTo(timelineLeft + laneX, cardY);
    ctx.lineTo(TIMELINE_WIDTH, cardY);
    ctx.stroke();

    drawDiamond(ctx, [timelineLeft, timelineY], dotRadius);
    drawDiamond(ctx, [TIMELINE_WIDTH, cardY], dotRadius);
  });
}

function drawDiamond(ctx: CanvasRenderingContext2D, [centerX, centerY]: Point2, radius: number) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = DEFAULT_SPACECRAFT_COLOR;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + radius);
  ctx.lineTo(centerX + radius, centerY);
  ctx.lineTo(centerX, centerY - radius);
  ctx.lineTo(centerX - radius, centerY);
  ctx.lineTo(centerX, centerY + radius);
  ctx.fill();
  ctx.stroke();
}
