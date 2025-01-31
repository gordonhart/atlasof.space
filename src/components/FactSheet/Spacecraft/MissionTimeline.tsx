import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LABEL_FONT_FAMILY } from '../../../lib/canvas.ts';
import { datetimeToHumanReadable } from '../../../lib/epoch.ts';
import { Spacecraft } from '../../../lib/spacecraft.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, CelestialBodyId, Point2 } from '../../../lib/types.ts';
import { DEFAULT_SPACECRAFT_COLOR, notNullish } from '../../../lib/utils.ts';
import { MissionTimelineCard } from './MissionTimelineCard.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';

const TIMELINE_WIDTH = 100;
enum TimelineCap {
  START = 'timeline-start',
  END = 'timeline-end',
}

type Props = {
  spacecraft: Spacecraft;
  bodies: Array<CelestialBody>;
  hover: string | null;
  updateSettings: UpdateSettings;
};
export function MissionTimeline({ spacecraft, bodies, hover, updateSettings }: Props) {
  const { ref: timelineRef, height } = useElementSize();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const launchRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement>>([]);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [hoverCap, setHoverCap] = useState<TimelineCap | null>(null);

  const bodyById = useMemo(
    () => bodies.reduce<Record<CelestialBodyId, CelestialBody>>((acc, body) => ({ ...acc, [body.id]: body }), {}),
    [JSON.stringify(bodies)]
  );
  const visitedBodies = useMemo(
    () => spacecraft.visited.map(({ id }) => bodyById[id]).filter(notNullish),
    [JSON.stringify(spacecraft), bodyById]
  );

  // initialize canvas
  useEffect(() => {
    if (canvasRef.current == null) return;
    const dpr = window.devicePixelRatio ?? 1;
    canvasRef.current.width = TIMELINE_WIDTH * dpr;
    canvasRef.current.height = height * dpr;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx == null) return;
    ctx.scale(dpr, dpr);
  }, [canvasRef.current, height]);

  // render timeline
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (timelineRef.current == null || launchRef.current == null || ctx == null) return;
    const containerRect = timelineRef.current.getBoundingClientRect();
    const containerTop = containerRect.top;

    const { height, top } = launchRef.current.getBoundingClientRect();
    const isHovered = hoverCap === TimelineCap.START;
    const launchItem = { height, top: top - containerTop, date: spacecraft.start, hover: isHovered };
    const cardItems = cardRefs.current.map((card, i) => {
      const { height, top } = card.getBoundingClientRect();
      const visit = spacecraft.visited[i];
      return { height, top: top - containerTop, date: visit.start, hover: visit.id === hover };
    });
    const timelineItems = [launchItem, ...cardItems];
    if (endRef.current != null && spacecraft.end != null) {
      const { height, top } = endRef.current.getBoundingClientRect();
      const isHovered = hoverCap === TimelineCap.END;
      timelineItems.push({ height, top: top - containerTop, date: spacecraft.end, hover: isHovered });
    }

    renderTimeline(ctx, timelineItems, spacecraft.start, spacecraft.end);
  }, [visitedBodies, height, hover, hoverCap]);

  return (
    <Stack gap="xs" p="md" pt="lg">
      <Group gap="xs">
        <Title order={5}>Mission Timeline</Title>
        <SpacecraftStatusPill status={spacecraft.status} />
      </Group>
      <Group gap={0} wrap="nowrap" flex={1}>
        <Box w={TIMELINE_WIDTH} h="100%" style={{ flexShrink: 0 }}>
          <canvas ref={canvasRef} style={{ height: '100%', width: TIMELINE_WIDTH }} />
        </Box>
        <Stack ref={timelineRef} gap="xs" flex={1}>
          <Paper
            ref={launchRef}
            p="xs"
            withBorder
            onMouseEnter={() => setHoverCap(TimelineCap.START)}
            onMouseLeave={() => setHoverCap(null)}
          >
            {/* TODO: include information about launch (location, vehicle)? */}
            <Group gap="xs" align="baseline">
              <Title order={6}>Launch</Title>
              <Text c="dimmed" fz="xs">
                {datetimeToHumanReadable(spacecraft.start)}
              </Text>
            </Group>
          </Paper>

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
                <MissionTimelineCard
                  body={body}
                  spacecraft={spacecraft}
                  visit={visit}
                  updateSettings={updateSettings}
                />
              </Box>
            );
          })}

          {spacecraft.end != null && (
            // TODO: include a blurb about how the mission ended?
            <Paper
              ref={endRef}
              p="xs"
              withBorder
              onMouseEnter={() => setHoverCap(TimelineCap.END)}
              onMouseLeave={() => setHoverCap(null)}
            >
              <Group gap="xs" align="baseline">
                <Title order={6}>{spacecraft.status.status ?? 'Mission End'}</Title>
                <Text c="dimmed" fz="xs">
                  {datetimeToHumanReadable(spacecraft.end)}
                </Text>
              </Group>
            </Paper>
          )}
        </Stack>
      </Group>
    </Stack>
  );
}

type TimelineItem = {
  height: number;
  top: number;
  date: Date;
  hover: boolean;
};
function renderTimeline(ctx: CanvasRenderingContext2D, items: Array<TimelineItem>, start: Date, end?: Date) {
  const startMillis = start.getTime();
  const endMillis = Math.max(...[...items.map(({ date }) => date.getTime())], end?.getTime() ?? Date.now());
  const durationMillis = endMillis - startMillis;
  const dpr = window.devicePixelRatio || 1;
  const dotRadius = 6;
  const timelineHeight = ctx.canvas.height / dpr;
  const isOngoing = end == null;
  const millisPerPx = durationMillis / (timelineHeight - dotRadius * (isOngoing ? 4 : 2));

  const baseColor = '#828282';
  const accentColor = DEFAULT_SPACECRAFT_COLOR;

  ctx.font = `12px ${LABEL_FONT_FAMILY}`;
  const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText('0000');
  const timelineLeft = dotRadius + 1 + textWidthPx;
  ctx.lineWidth = 1;
  ctx.strokeStyle = baseColor;

  ctx.clearRect(0, 0, TIMELINE_WIDTH, timelineHeight);
  ctx.moveTo(timelineLeft, 0);
  ctx.lineTo(timelineLeft, timelineHeight);
  ctx.stroke();

  // TODO: more advanced logic to figure out the smallest number of lanes necessary to avoid overlaps
  const nLanes = Math.ceil(items.length / 2);
  const lanesGutter = 20;
  const laneWidth = (TIMELINE_WIDTH - 2 * lanesGutter - timelineLeft) / nLanes;
  const drawnLabels = new Set();

  function drawConnector({ top, height, date, hover }: TimelineItem, i: number) {
    const elapsedMillis = date.getTime() - startMillis;
    const timelineY = elapsedMillis / millisPerPx + dotRadius;
    // TODO: the lane behavior here can be dramatically improved
    const laneX = lanesGutter + (i >= nLanes ? nLanes - (i % nLanes) : i) * laneWidth;
    const itemY = top + height / 2;
    const isGoingUp = timelineY < itemY;
    const nKinks = Math.abs(itemY - timelineY) < 2 * dotRadius ? 1 : 2;

    ctx.beginPath();
    ctx.strokeStyle = hover ? accentColor : baseColor;
    ctx.fillStyle = hover ? accentColor : '#000000';
    ctx.moveTo(timelineLeft, timelineY);
    ctx.lineTo(timelineLeft + laneX - dotRadius, timelineY);
    if (nKinks === 1) {
      ctx.lineTo(timelineLeft + laneX + Math.abs(itemY - timelineY), itemY);
    } else {
      ctx.lineTo(timelineLeft + laneX, timelineY + (isGoingUp ? dotRadius : -dotRadius));
      ctx.lineTo(timelineLeft + laneX, itemY + (isGoingUp ? -dotRadius : dotRadius));
      ctx.lineTo(timelineLeft + laneX + dotRadius, itemY);
    }
    ctx.lineTo(TIMELINE_WIDTH, itemY);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = accentColor;
    drawDiamond(ctx, [timelineLeft, timelineY], dotRadius);

    ctx.fillStyle = hover ? accentColor : baseColor;
    const label = date.getFullYear().toString();
    if (!drawnLabels.has(label)) {
      const { width } = ctx.measureText(label);
      ctx.fillText(label, timelineLeft - width - dotRadius * 2, timelineY + textHeightPx / 2);
      drawnLabels.add(label);
    }
  }

  function drawOngoingEndCap() {
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(timelineLeft, timelineHeight);
    ctx.lineTo(timelineLeft - dotRadius / Math.sqrt(2), timelineHeight - dotRadius);
    ctx.lineTo(timelineLeft + dotRadius / Math.sqrt(2), timelineHeight - dotRadius);
    ctx.lineTo(timelineLeft, timelineHeight);
    ctx.fill();
    ctx.closePath();
  }

  items.forEach((visit, i) => drawConnector(visit, i));
  if (isOngoing) drawOngoingEndCap();
  items
    .filter(({ hover }) => hover)
    .forEach(visit => {
      const i = items.findIndex(({ top, date }) => top === visit.top && date === visit.date);
      drawConnector(visit, i);
    });
}

function drawDiamond(ctx: CanvasRenderingContext2D, [centerX, centerY]: Point2, radius: number) {
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + radius);
  ctx.lineTo(centerX + radius, centerY);
  ctx.lineTo(centerX, centerY - radius);
  ctx.lineTo(centerX - radius, centerY);
  ctx.lineTo(centerX, centerY + radius);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}
