import { Box, Group, Stack } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { ReactNode, useEffect, useRef } from 'react';
import { LABEL_FONT_FAMILY } from '../../lib/canvas.ts';
import { Time } from '../../lib/epoch.ts';
import { HexColor, Point2 } from '../../lib/types.ts';

const TIMELINE_WIDTH = 110;

type Props = {
  datedItems: Array<[Date, ReactNode]>;
  activeIndex?: number;
  end?: Date;
  accentColor: HexColor;
  width?: number;
};
export function Timeline({ datedItems, activeIndex, end, accentColor, width = TIMELINE_WIDTH }: Props) {
  const { ref: timelineRef, height } = useElementSize();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement>>([]);

  // initialize canvas
  useEffect(() => {
    if (canvasRef.current == null) return;
    const dpr = window.devicePixelRatio ?? 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx == null) return;
    ctx.scale(dpr, dpr);
  }, [canvasRef.current, width, height]);

  // render timeline
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (timelineRef.current == null || ctx == null) return;
    const containerRect = timelineRef.current.getBoundingClientRect();
    const containerTop = containerRect.top;
    const items = cardRefs.current.map((card, i) => {
      const { height, top } = card.getBoundingClientRect();
      const [date] = datedItems[i];
      return { height, top: top - containerTop, date, hover: activeIndex === i };
    });
    const start = new Date(Math.min(...datedItems.map(([date]) => date.getTime())));
    renderTimeline(ctx, items, accentColor, start, end);
  }, [datedItems, height, activeIndex, end]);

  return (
    <Group gap={0} wrap="nowrap" flex={1} align="flex-start">
      <Box w={width} h="100%" style={{ flexShrink: 0 }}>
        <canvas ref={canvasRef} style={{ height: '100%', width }} />
      </Box>
      <Stack ref={timelineRef} gap="xs" flex={1}>
        {datedItems.map(([, item], i) => (
          <Box
            key={`item-${i}`}
            ref={el => {
              if (el == null) return;
              cardRefs.current[i] = el;
            }}
          >
            {item}
          </Box>
        ))}
      </Stack>
    </Group>
  );
}

type TimelineItem = {
  height: number;
  top: number;
  date: Date;
  hover: boolean;
};
function renderTimeline(
  ctx: CanvasRenderingContext2D,
  items: Array<TimelineItem>,
  accentColor: HexColor,
  start: Date,
  end?: Date
) {
  const startMillis = start.getTime();
  let endMillis = Math.max(...[...items.map(({ date }) => date.getTime())], end?.getTime() ?? Date.now());
  if (startMillis === endMillis) {
    endMillis = endMillis + Time.DAY; // ensure that there's some gap between start and end to avoid 0-length timeline
  }
  const durationMillis = endMillis - startMillis;
  const dpr = window.devicePixelRatio || 1;
  const dotRadius = 6;
  const timelineWidth = ctx.canvas.width / dpr;
  const timelineHeight = ctx.canvas.height / dpr;
  const isOngoing = end == null;
  const millisPerPx = durationMillis / (timelineHeight - dotRadius * (isOngoing ? 4 : 2));

  const baseColor = '#828282';

  ctx.font = `12px ${LABEL_FONT_FAMILY}`;
  const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText('0000');
  const timelineLeft = dotRadius * 2 + 1 + textWidthPx;
  ctx.lineWidth = 1;
  ctx.strokeStyle = baseColor;

  ctx.clearRect(0, 0, timelineWidth, timelineHeight);
  ctx.moveTo(timelineLeft, 0);
  ctx.lineTo(timelineLeft, timelineHeight);
  ctx.stroke();

  // TODO: more advanced logic to figure out the smallest number of lanes necessary to avoid overlaps
  const nLanes = items.length < 6 ? items.length : Math.ceil(items.length / 2);
  const laneGutter = 20;
  const laneWidth = (timelineWidth - 2 * laneGutter - timelineLeft) / Math.max(nLanes - 1, 1);
  const drawnLabels = new Set();

  function drawConnector({ top, height, date, hover }: TimelineItem, i: number) {
    const elapsedMillis = date.getTime() - startMillis;
    const timelineY = elapsedMillis / millisPerPx + dotRadius;
    // TODO: the lane behavior here can be dramatically improved
    const laneIndex =
      items.length < 6 ? items.length - i - 1 : Math.max(Math.min(i, 2 * nLanes - i - 1 - (items.length % 2)), 0);
    const laneX = laneGutter + laneIndex * laneWidth;
    const itemY = top + height / 2;
    const isGoingUp = timelineY < itemY;
    const nKinks = Math.abs(itemY - timelineY) < 2 * dotRadius ? 1 : 2;

    ctx.beginPath();
    ctx.strokeStyle = hover ? accentColor : baseColor;
    ctx.lineWidth = hover ? 2 : 1;
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
    ctx.lineTo(timelineWidth, itemY);
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
