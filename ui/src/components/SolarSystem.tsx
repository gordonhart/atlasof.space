import { useRef, useEffect } from 'react';
import { Group } from '@mantine/core';

type Point = {
  x: number;
  y: number;
}

type Body = {
  curr: Point;
  prev: Point;
  mass: bigint; // kg
  radius: bigint; // m
  // TODO: more sophisticated orbital parameters
  orbitalRadius: bigint; // m
  color: string;
}

const SOL: Body = {
  curr: { x: 0, y: 0 },
  prev: { x: 0, y: 0 },
  mass: BigInt("1988500000000000000000000000000"), // 1.9885e30 kg
  radius: BigInt("695700000"), // 6.957e8 m
  orbitalRadius: BigInt("0"),
  color: '#ffa500',
};
const MERCURY: Body = {
  curr: { x: 69820000000, y: 0 },
  prev: { x: 0, y: 0 },
  mass: BigInt("330110000000000000000000"), // 3.3011e23 kg
  radius: BigInt("2439700"), // 2439.7 km
  // TODO: fudged value (used aphelion) as orbit is not circular
  orbitalRadius: BigInt("69820000000"), // 69.82 million km
  color: '#808080',
}

const MIN_DIMENSION = (MERCURY.orbitalRadius + BigInt("10000000000")) * BigInt("2");

function drawBody(
  ctx: CanvasRenderingContext2D,
  body: Body,
  metersPerPx: bigint,
  canvasDimensions: Point
) {
  const canvasCenterPx = { x: canvasDimensions.x / 2, y: canvasDimensions.y / 2 };
  const bodyCenterPx = {
    x: canvasCenterPx.x + Number(BigInt(body.curr.x) / metersPerPx),
    y: canvasCenterPx.y + Number(BigInt(body.curr.y) / metersPerPx),
  }
  const radius = Number(body.radius / metersPerPx);
  const displayRadius = Math.max(radius, 1); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterPx.x, bodyCenterPx.y, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = body.color;
  ctx.fill();
}

export function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function setupCanvas() {
    if (canvasRef.current != null) {
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = window.innerWidth * dpr;
      canvasRef.current.height = window.innerHeight * dpr;
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.scale(dpr, dpr);
      drawBodies(ctx);
    }
  }

  function drawBodies(ctx: CanvasRenderingContext2D) {
    const dpr = window.devicePixelRatio || 1;
    const canvasDimensions: Point = { x: ctx.canvas.width / dpr, y: ctx.canvas.height / dpr };
    const minDimensionPx = Math.min(canvasDimensions.x, canvasDimensions.y);
    const metersPerPx = MIN_DIMENSION / BigInt(minDimensionPx);
    drawBody(ctx, SOL, metersPerPx, canvasDimensions);
    drawBody(ctx, MERCURY, metersPerPx, canvasDimensions);
  }

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, [canvasRef.current])

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <canvas style={{ display: 'block', height: '100vh', width: '100vw' }} ref={canvasRef} />
    </Group>
  );
}