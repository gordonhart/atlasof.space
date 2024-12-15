import { useEffect, useRef, useState } from 'react';
import { Group } from '@mantine/core';
import { AppState, initialState } from '../lib/state.ts';
import { Controls } from './Controls.tsx';
import { useDragController } from '../hooks/useDragController.ts';
import { drawBodies } from '../lib/draw.ts';
import { getInitialState, incrementState } from '../lib/physics.ts';
import { SOL } from '../lib/constants.ts';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const systemStateRef = useRef(getInitialState(null, SOL));

  function updateState(newState: Partial<AppState>) {
    setAppState(prev => ({ ...prev, ...newState }));
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragController = useDragController(appState, updateState, systemStateRef.current);

  // set the mutable state ref (accessed by animation callback) on state update
  useEffect(() => {
    appStateRef.current = appState;
  }, [JSON.stringify(appState)]);

  // restart animation
  useEffect(() => {
    if (appState.play) {
      const frameId = window.requestAnimationFrame(animationFrame);
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
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.scale(dpr, -dpr); // scale and flip Y axis to make (0, 0) bottom left corner, +x right +y up
      ctx.translate(0, -canvasRef.current.height / dpr);
    }
  }

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) {
      return;
    }
    const { play, dt } = appStateRef.current;
    setAppState(prev => ({ ...prev, time: prev.time + dt }));
    systemStateRef.current = incrementState(systemStateRef.current, dt);
    drawBodies(ctx, appStateRef.current, systemStateRef.current);
    if (play) {
      window.requestAnimationFrame(animationFrame);
    }
  }

  useEffect(() => {
    setupCanvas();
    const frameId = window.requestAnimationFrame(animationFrame);
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', setupCanvas);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <canvas
        ref={canvasRef}
        style={{ display: 'block', height: '100vh', width: '100vw' }}
        {...dragController.canvasProps}
      />
      <Controls
        state={appState}
        updateState={updateState}
        systemState={systemStateRef.current}
        reset={() => {
          updateState(initialState);
          systemStateRef.current = getInitialState(null, SOL);
        }}
      />
    </Group>
  );
}
