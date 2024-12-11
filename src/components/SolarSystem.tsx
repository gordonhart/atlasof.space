import {useEffect, useRef} from 'react';
import {Group} from '@mantine/core';
import {BODY_SCALE_FACTOR, COLORS, MIN_DIMENSION, Point, RADII, TIME_STEP_S} from "./constants.ts";
import {incrementBodiesKeplerian, jupiterElements, plutoElements, STATE} from "./keplerian.ts";

function drawBody(
  ctx: CanvasRenderingContext2D,
  position: Point,
  radius: number,
  color: string,
  metersPerPx: number,
  canvasDimensions: Point
) {
  const canvasCenterPx = { x: canvasDimensions.x / 2, y: canvasDimensions.y / 2 };
  const bodyCenterPx = {
    x: canvasCenterPx.x + (position.x / metersPerPx),
    y: canvasCenterPx.y + (position.y / metersPerPx),
  }
  // console.log(bodyCenterPx)
  const r = radius / metersPerPx * BODY_SCALE_FACTOR;
  const displayRadius = Math.max(r, 1); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterPx.x, bodyCenterPx.y, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawTimestamp(ctx: CanvasRenderingContext2D, timestamp: number) {
  const nDays = (timestamp / 60 / 60 / 24).toFixed(0);
  ctx.font = '12px sans-serif';
  ctx.save();
  ctx.scale(1, -1); // Temporarily flip the canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(45, -45, 100, -20)
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`t = ${nDays} days`, 50, -50); // Position text correctly by negating y
  ctx.restore(); // unflip canvas
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
      ctx.scale(dpr, -dpr); // scale and flip Y axis to make (0, 0) bottom left corner, +x right +y up
      ctx.translate(0, -canvasRef.current.height / dpr);
    }
  }

  function drawBodies() {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) {
      return;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    time.current += TIME_STEP_S;
    // PLANETS.forEach(planet => incrementBody(planet, SOL));
    // incrementBody(MOON, EARTH)
    incrementBodiesKeplerian(TIME_STEP_S);

    const dpr = window.devicePixelRatio || 1;
    const canvasDimensions: Point = { x: ctx.canvas.width / dpr, y: ctx.canvas.height / dpr };
    const minDimensionPx = Math.min(canvasDimensions.x, canvasDimensions.y);
    const metersPerPx = jupiterElements.semiMajorAxis / minDimensionPx;
    // BODIES.forEach(body => drawBody(ctx, body.curr, Number(body.radius), body.color, metersPerPx, canvasDimensions))

    drawBody(ctx, {x: 0, y: 0}, RADII.sol, COLORS.sol, metersPerPx, canvasDimensions);
    Object.entries(STATE).forEach(([name, body]) => {
      const position: Point = {x: body.position[0], y: body.position[1]};
      drawBody(ctx, position, RADII[name] ?? 1, COLORS[name] ?? '#ffffff', metersPerPx, canvasDimensions);
    })

    drawTimestamp(ctx, time.current);
    window.requestAnimationFrame(drawBodies);
  }

  useEffect(() => {
    setupCanvas();
    window.requestAnimationFrame(drawBodies);
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <canvas style={{ display: 'block', height: '100vh', width: '100vw' }} ref={canvasRef} />
    </Group>
  );
}