import { useCallback, useEffect, useRef, useState } from 'react';
import { Group } from '@mantine/core';
import { AppState, clampState, initialState } from '../lib/state.ts';
import { Controls } from './Controls/Controls.tsx';
import { drawAnnotations, drawSystem } from '../lib/draw.ts';
import { getInitialState, incrementState } from '../lib/physics.ts';
import { SOL } from '../lib/constants.ts';
import { SolarSystem3D } from './SolarSystem3D.tsx';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const systemStateRef = useRef(getInitialState(null, SOL));

  const updateState = useCallback(
    (newState: Partial<AppState>) => {
      setAppState(prev => clampState({ ...prev, ...newState }));
    },
    [setAppState]
  );

  const resetState = useCallback(() => {
    updateState(initialState);
    systemStateRef.current = getInitialState(null, SOL);
  }, [updateState]);

  // use two canvases to prevent "draw tails" from drawing labels and other annotations
  const systemCanvasRef = useRef<HTMLCanvasElement>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);

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

  function setupCanvases() {
    if (systemCanvasRef.current != null && annotationCanvasRef.current != null) {
      [systemCanvasRef.current, annotationCanvasRef.current].forEach(canvas => {
        const dpr = window.devicePixelRatio ?? 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.scale(dpr, -dpr); // scale and flip Y axis to make (0, 0) bottom left corner, +x right +y up
        ctx.translate(0, -canvas.height / dpr);
      });
    }
  }

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    const systemCtx = systemCanvasRef.current?.getContext('2d');
    const annotationCtx = annotationCanvasRef.current?.getContext('2d');
    if (systemCtx == null || annotationCtx == null) {
      return;
    }
    const { play, dt } = appStateRef.current;
    setAppState(prev => ({ ...prev, time: prev.time + dt }));
    systemStateRef.current = incrementState(systemStateRef.current, dt);
    drawSystem(systemCtx, appStateRef.current, systemStateRef.current);
    drawAnnotations(annotationCtx, appStateRef.current, systemStateRef.current);
    if (play) {
      window.requestAnimationFrame(animationFrame);
    }
  }

  useEffect(() => {
    setupCanvases();
    const frameId = window.requestAnimationFrame(animationFrame);
    window.addEventListener('resize', setupCanvases);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', setupCanvases);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <SolarSystem3D appState={appState} systemState={systemStateRef.current} />
      <Controls state={appState} updateState={updateState} systemState={systemStateRef.current} reset={resetState} />
    </Group>
  );
}
