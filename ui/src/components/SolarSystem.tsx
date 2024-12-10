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
  prev: { x: 69820000000, y: 2000000000 / 24 * 6},
  mass: BigInt("330110000000000000000000"), // 3.3011e23 kg
  radius: BigInt("2439700"), // 2439.7 km
  orbitalRadius: BigInt("69820000000"), // 69.82 million km aphelion
  color: '#808080',
}

const MIN_DIMENSION = (MERCURY.orbitalRadius + BigInt("10000000000")) * BigInt("2");
const GRAVITATIONAL_CONSTANT = 6.6743e-11; // N⋅m2⋅kg−2
const TIME_STEP_S = 60 * 60 * 6; // 6 hours // * 24; // 1 day

function calculateDistance(a: Point, b: Point) : number {
  return (((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)) ** 0.5;
}
function incrementBodies() {
  const masses = SOL.mass * MERCURY.mass;
  const distance = calculateDistance(SOL.curr, MERCURY.curr);
  const radius2 = distance ** 2;
  const gravityForce = GRAVITATIONAL_CONSTANT * Number(masses) / radius2; // TODO: is this the right place to cast to number?
  // const solAccel = gravityForce / Number(SOL.mass); // TODO: negligible?
  const mercuryAccelMagnitude = gravityForce / Number(MERCURY.mass);
  const mercuryAccelVector = {
    x: (SOL.curr.x - MERCURY.curr.x) / distance,
    y: (SOL.curr.y - MERCURY.curr.y) / distance,
  }
  const mercuryAccel = {
    x: mercuryAccelMagnitude * mercuryAccelVector.x,
    y: mercuryAccelMagnitude * mercuryAccelVector.y,
  }
  const mercuryVelocity = {
    x: (MERCURY.curr.x - MERCURY.prev.x) / TIME_STEP_S,
    y: (MERCURY.curr.y - MERCURY.prev.y) / TIME_STEP_S,
  }
  MERCURY.prev = { x: MERCURY.curr.x, y: MERCURY.curr.y };
  MERCURY.curr = {
    x: MERCURY.curr.x + (mercuryVelocity.x * TIME_STEP_S) + (0.5 * mercuryAccel.x * (TIME_STEP_S ** 2)),
    y: MERCURY.curr.y + (mercuryVelocity.y * TIME_STEP_S) + (0.5 * mercuryAccel.y * (TIME_STEP_S ** 2)),
  }
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  body: Body,
  metersPerPx: bigint,
  canvasDimensions: Point
) {
  const canvasCenterPx = { x: canvasDimensions.x / 2, y: canvasDimensions.y / 2 };
  const bodyCenterPx = {
    x: canvasCenterPx.x + (body.curr.x / Number(metersPerPx)),
    y: canvasCenterPx.y + (body.curr.y / Number(metersPerPx)),
  }
  const radius = Number(body.radius / metersPerPx);
  const displayRadius = Math.max(radius, 1); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterPx.x, bodyCenterPx.y, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = body.color;
  ctx.fill();
}

export function SolarSystem() {
  const time = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function setupCanvas() {
    if (canvasRef.current != null) {
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = window.innerWidth * dpr;
      canvasRef.current.height = window.innerHeight * dpr;
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.scale(dpr, dpr);
      window.requestAnimationFrame(drawBodies);
    }
  }

  function drawBodies() {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) {
      return;
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    time.current += TIME_STEP_S;
    incrementBodies();
    const dpr = window.devicePixelRatio || 1;
    const canvasDimensions: Point = { x: ctx.canvas.width / dpr, y: ctx.canvas.height / dpr };
    const minDimensionPx = Math.min(canvasDimensions.x, canvasDimensions.y);
    const metersPerPx = MIN_DIMENSION / BigInt(minDimensionPx);
    drawBody(ctx, SOL, metersPerPx, canvasDimensions);
    drawBody(ctx, MERCURY, metersPerPx, canvasDimensions);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText(`t = ${(time.current / 60 / 60 / 24).toFixed(0)} days`, 50, 50);
    window.requestAnimationFrame(drawBodies);
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