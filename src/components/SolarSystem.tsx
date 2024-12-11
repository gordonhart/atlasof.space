import {useCallback, useEffect, useRef} from 'react';
import {Group} from '@mantine/core';
import {
  BODIES,
  Body, BODY_SCALE_FACTOR,
  GRAVITATIONAL_CONSTANT,
  MIN_DIMENSION, PLANETS,
  Point,
  SOL,
  TIME_STEP_S,
} from "./constants.ts";

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
  PLANETS.forEach(planet => incrementBody(planet, SOL));
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
  const radius = Number(body.radius / metersPerPx) * BODY_SCALE_FACTOR;
  const displayRadius = Math.max(radius, 3); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterPx.x, bodyCenterPx.y, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = body.color;
  ctx.fill();
}

function drawTimestamp(ctx: CanvasRenderingContext2D, timestamp: number) {
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px sans-serif';
  const nDays = (timestamp / 60 / 60 / 24).toFixed(0);
  ctx.fillText(`t = ${nDays} days`, 50, 50);
}

export function SolarSystem() {
  const time = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const setupCanvas = useCallback(() => {
    if (canvasRef.current != null) {
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = window.innerWidth * dpr;
      canvasRef.current.height = window.innerHeight * dpr;
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.scale(dpr, dpr);
      window.requestAnimationFrame(drawBodies);
    }
  }, [])

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
    BODIES.forEach(body => drawBody(ctx, body, metersPerPx, canvasDimensions))
    drawTimestamp(ctx, time.current);
    window.requestAnimationFrame(drawBodies);
  }

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, [setupCanvas]);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <canvas style={{ display: 'block', height: '100vh', width: '100vw' }} ref={canvasRef} />
    </Group>
  );
}