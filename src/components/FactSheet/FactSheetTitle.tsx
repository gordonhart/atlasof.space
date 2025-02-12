import { ActionIcon, Box, Group, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { HexColor } from '../../lib/types.ts';
import { iconSize } from '../Controls/constants.ts';

type Props = {
  title: string;
  subTitle: string;
  color: HexColor;
  onClose: () => void;
  onHover?: (hovered: boolean) => void;
};
export function FactSheetTitle({ title, subTitle, color, onClose, onHover }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padding = useFactSheetPadding();
  const { xs: isXsDisplay, sm: isSmallDisplay } = useDisplaySize();
  const width = containerRef.current?.clientWidth;
  const height = containerRef.current?.clientHeight;

  useEffect(() => {
    if (containerRef.current == null || canvasRef.current == null || width == null || height == null) return;
    const dpr = window.devicePixelRatio || 1;
    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx == null) return;
    drawCarets(ctx, color);
  }, [canvasRef.current, color, width, height]);

  return (
    <Group
      // TODO: there's an issue with 0.5px of underlying content rendering above this header when scrolling
      ref={containerRef}
      pos="sticky"
      top={0}
      bg="black"
      px={padding.px}
      py={isSmallDisplay ? 8 : 'md'}
      gap="xs"
      justify="space-between"
      wrap="nowrap"
      style={{ borderBottom: `1px solid ${color}`, zIndex: 10 /* above gallery images */ }}
      onMouseEnter={onHover != null ? () => onHover(true) : undefined}
      onMouseLeave={onHover != null ? () => onHover(false) : undefined}
    >
      <canvas
        ref={canvasRef}
        style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      <Group gap={0} align="baseline">
        <Title order={isXsDisplay ? 3 : 2} pr="xs">
          {title}
        </Title>
        <Title order={6} c="dimmed">
          {subTitle}
        </Title>
      </Group>
      <ActionIcon onClick={onClose}>
        <IconX size={iconSize} />
      </ActionIcon>
    </Group>
  );
}

function drawCarets(ctx: CanvasRenderingContext2D, color: HexColor) {
  const dpr = window.devicePixelRatio || 1;
  const unit = 10;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineWidth = dpr;
  ctx.strokeStyle = color;
  ctx.moveTo(unit, unit * 3);
  ctx.lineTo(unit, unit * 2);
  ctx.lineTo(unit * 2, unit);
  ctx.lineTo(unit * 3, unit);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(unit, unit);
  ctx.lineTo(unit * 1.5, unit);
  ctx.lineTo(unit, unit * 1.5);
  ctx.lineTo(unit, unit);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  // ctx.fillRect(0, 0, 10, 10);
}

function Caret({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 8;
  const pad = 'calc(var(--mantine-spacing-md) / 4)';
  const border = `1px solid ${color}`;
  return (
    <Box
      pos="absolute"
      w={size}
      h={size}
      top={position.startsWith('t') ? pad : undefined}
      left={position.endsWith('l') ? pad : undefined}
      right={position.endsWith('r') ? pad : undefined}
      bottom={position.startsWith('b') ? pad : undefined}
      style={{
        borderTop: position.startsWith('t') ? border : undefined,
        borderLeft: position.endsWith('l') ? border : undefined,
        borderRight: position.endsWith('r') ? border : undefined,
        borderBottom: position.startsWith('b') ? border : undefined,
      }}
    />
  );
}
