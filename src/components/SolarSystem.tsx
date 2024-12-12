import {useEffect, useRef} from 'react';
import {Group} from '@mantine/core';
import {CelestialObject, COLORS, DT, Point, RADII} from "./constants.ts";
import {incrementBodiesKeplerian, jupiterElements, STATE} from "./keplerian.ts";
import {drawBody, drawTimestamp} from "./draw.ts";

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
    time.current += DT;
    incrementBodiesKeplerian(DT);

    const dpr = window.devicePixelRatio || 1;
    const canvasDimensions: Point = { x: ctx.canvas.width / dpr, y: ctx.canvas.height / dpr };
    const minDimensionPx = Math.min(canvasDimensions.x, canvasDimensions.y);
    const metersPerPx = jupiterElements.semiMajorAxis / minDimensionPx;

    drawBody(ctx, {x: 0, y: 0}, RADII.sol, COLORS.sol, metersPerPx, canvasDimensions);
    Object.entries(STATE).forEach(([name, body]) => {
      const obj = name as CelestialObject; // TODO: way to do this without cast?
      const position: Point = {x: body.position[0], y: body.position[1]};
      drawBody(ctx, position, RADII[obj], COLORS[obj], metersPerPx, canvasDimensions);
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