import {useEffect, useRef, useState} from 'react';
import {Group} from '@mantine/core';
import {COLORS, RADII} from "../lib/constants.ts";
import {incrementBodiesKeplerian, STATE} from "../lib/physics.ts";
import {drawBody, } from "../lib/draw.ts";
import {AppState, initialState} from "../lib/state.ts";
import {Controls} from "./Controls.tsx";
import {CelestialObject, Point2} from "../lib/types.ts";

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // set the mutable state ref (accessed by animation callback) on state update
  useEffect(() => {
    appStateRef.current = appState;
  }, [JSON.stringify(appState)])

  // restart animation
  useEffect(() => {
    if (appState.play) {
      const frameId = window.requestAnimationFrame(drawBodies)
      return () => {
        window.cancelAnimationFrame(frameId);
      }
    }
  }, [appState.play]);

  function updateState(newState: Partial<AppState>) {
    setAppState(prev => ({...prev, ...newState}));
  }

  function setupCanvas() {
    if (canvasRef.current != null) {
      const dpr = window.devicePixelRatio ?? 1;
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
    const {dt, drawTail, metersPerPx, play} = appStateRef.current;

    // TODO: appears to be a bug with far-out planets and tails
    ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.05)' : '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setAppState(prev => ({...prev, time: prev.time + dt}));
    incrementBodiesKeplerian(dt);

    const dpr = window.devicePixelRatio ?? 1;
    const canvasDimensions: Point2 = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];

    drawBody(ctx, [0, 0], RADII.sol, COLORS.sol, metersPerPx, canvasDimensions);
    Object.entries(STATE).forEach(([name, body]) => {
      const obj = name as CelestialObject; // TODO: way to do this without cast?
      const position: Point2 = [body.position[0], body.position[1]];
      drawBody(ctx, position, RADII[obj], COLORS[obj], metersPerPx, canvasDimensions);
    })

    if (play) {
      window.requestAnimationFrame(drawBodies);
    }
  }

  useEffect(() => {
    setupCanvas();
    const frameId = window.requestAnimationFrame(drawBodies);
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', setupCanvas);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <canvas style={{ display: 'block', height: '100vh', width: '100vw' }} ref={canvasRef} />
      <Controls state={appState} updateState={updateState} />
    </Group>
  );
}