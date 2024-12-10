import { useRef, useEffect } from 'react';
import { Group } from '@mantine/core';

type Point = {
  x: number;
  y: number;
}

type Body = {
  curr: Point;
  prev: Point;
  // TODO: remove bigint? are these really necessary?
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
  prev: { x: 69820000000, y: 2000000000 / 24 * 12},
  mass: BigInt("330110000000000000000000"), // 3.3011e23 kg
  radius: BigInt("2439700"), // 2439.7 km
  orbitalRadius: BigInt("69820000000"), // 69.82 million km aphelion
  color: '#808080',
}
const VENUS: Body = {
  curr: { x: 108940000000, y: 0 },
  prev: { x: 108940000000, y: 2000000000 / 24 * 12},
  mass: BigInt("34867500000000000000000000"), // 4.8675e24 kg
  radius: BigInt("6051800"), // 6051.8 km
  orbitalRadius: BigInt("108940000000"), // 108.94 million km aphelion
  color: '#ffee8c',
}
const EARTH: Body = {
  curr: { x: 152097597000, y: 0 },
  prev: { x: 152097597000, y: 1800000000 / 24 * 12},
  mass: BigInt("5972168000000000000000000"), // 5.972168e24 kg
  radius: BigInt("6371000"), // 6371.0 km
  orbitalRadius: BigInt("152097597000"), // 152,097,597 km aphelion
  color: '#7df9ff',
}
const MARS: Body = {
  curr: { x: 249261000000, y: 0 },
  prev: { x: 249261000000, y: 1400000000 / 24 * 12},
  mass: BigInt("641710000000000000000000"), // 6.4171e23
  radius: BigInt("3389500"), // 3389.5 km
  orbitalRadius: BigInt("249261000000"), // 249,261,000 km aphelion
  color: '#ff5733',
}

const MIN_DIMENSION = (MARS.orbitalRadius + BigInt("10000000000")) * BigInt("2");
const GRAVITATIONAL_CONSTANT = 6.6743e-11; // N⋅m2⋅kg−2
const TIME_STEP_S = 60 * 60 * 12; // 12 hours // * 24; // 1 day

function calculateDistance(a: Point, b: Point) : number {
  return (((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)) ** 0.5;
}

function calculatePosition(p0: number, v: number, a: number, t: number) {
  return p0 + (v * t) + (0.5 * a * (t ** 2));
}

// TODO: this assumes that the reference will not move, probably not entirely correct
function incrementBody(target: Body, reference: Body, timeStep: number = TIME_STEP_S) {
  const masses = reference.mass * target.mass;
  const distance = calculateDistance(reference.curr, target.curr);
  const force = GRAVITATIONAL_CONSTANT * Number(masses) / (distance ** 2);
  const accelMagnitude = force / Number(target.mass);
  const accel = { // multiply by unit vector
    x: accelMagnitude * (reference.curr.x - target.curr.x) / distance,
    y: accelMagnitude * (reference.curr.y - target.curr.y) / distance,
  }
  const velocity = {
    x: (target.curr.x - target.prev.x) / timeStep,
    y: (target.curr.y - target.prev.y) / timeStep,
  }
  target.prev = { ...target.curr };
  target.curr = {
    x: calculatePosition(target.curr.x, velocity.x, accel.x, timeStep),
    y: calculatePosition(target.curr.y, velocity.y, accel.y, timeStep),
  }
}

function incrementBodies() {
  incrementBody(MERCURY, SOL);
  incrementBody(VENUS, SOL);
  incrementBody(EARTH, SOL);
  incrementBody(MARS, SOL);
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
    drawBody(ctx, VENUS, metersPerPx, canvasDimensions);
    drawBody(ctx, EARTH, metersPerPx, canvasDimensions);
    drawBody(ctx, MARS, metersPerPx, canvasDimensions);
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