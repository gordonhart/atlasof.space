import { useEffect, useRef, useState } from 'react';
import { Group } from '@mantine/core';
import { ELEMENTS } from '../lib/constants.ts';
import { incrementBodiesKeplerian, STATE } from '../lib/physics.ts';
import { drawBody } from '../lib/draw.ts';
import { AppState, initialState } from '../lib/state.ts';
import { Controls } from './Controls.tsx';
import { Point2 } from '../lib/types.ts';
import { toPairs } from 'ramda';
import { useDragController } from './useDragController.ts';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);

  function updateState(newState: Partial<AppState>) {
    setAppState(prev => ({ ...prev, ...newState }));
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragController = useDragController(appState, updateState);

  // set the mutable state ref (accessed by animation callback) on state update
  useEffect(() => {
    appStateRef.current = appState;
  }, [JSON.stringify(appState)]);

  // restart animation
  useEffect(() => {
    if (appState.play) {
      const frameId = window.requestAnimationFrame(drawBodies);
      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }
  }, [appState.play]);

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
    const {
      dt,
      drawTail,
      metersPerPx,
      play,
      center,
      planetScaleFactor,
      offset: [offsetX, offsetY],
    } = appStateRef.current;

    // TODO: appears to be a bug with far-out planets and tails
    ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setAppState(prev => ({ ...prev, time: prev.time + dt }));
    incrementBodiesKeplerian(dt);

    const dpr = window.devicePixelRatio ?? 1;
    const canvasDimensions: Point2 = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];

    const [centerOffsetX, centerOffsetY] = center === 'sol' ? [0, 0] : STATE[center].position;
    const sharedDrawParams = { ctx, metersPerPx, canvasDimensions };
    drawBody({
      ...sharedDrawParams,
      position: [offsetX - centerOffsetX, offsetY - centerOffsetY],
      radius: ELEMENTS.sol.radius,
      color: ELEMENTS.sol.color,
      bodyScaleFactor: initialState.planetScaleFactor,
    });
    toPairs(STATE).forEach(([name, body]) => {
      drawBody({
        ...sharedDrawParams,
        position: [body.position[0] + offsetX - centerOffsetX, body.position[1] + offsetY - centerOffsetY],
        radius: ELEMENTS[name].radius,
        color: ELEMENTS[name].color,
        bodyScaleFactor: planetScaleFactor,
      });
    });

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
      <canvas
        {...dragController.canvasProps}
        style={{ display: 'block', height: '100vh', width: '100vw' }}
        ref={canvasRef}
      />
      <Controls state={appState} updateState={updateState} />
    </Group>
  );
}
