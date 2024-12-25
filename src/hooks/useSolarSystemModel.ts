import { useRef } from 'react';
import { SolarSystemRenderer } from '../lib/render/SolarSystemRenderer.ts';
import { CelestialBody } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';
import { SOLAR_SYSTEM } from '../lib/bodies.ts';

export function useSolarSystemModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SolarSystemRenderer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function initializeCanvas() {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(dpr, -dpr);
    ctx.translate(0, -canvas.height / dpr);
  }

  function initialize(appState: AppState) {
    if (containerRef.current == null || canvasRef.current == null) return;
    if (rendererRef.current == null) {
      rendererRef.current = new SolarSystemRenderer(containerRef.current, appState, SOLAR_SYSTEM);
    }
    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);
    return () => {
      window.removeEventListener('resize', initializeCanvas);
      if (rendererRef.current != null) {
        rendererRef.current?.dispose();
        rendererRef.current = null;
      }
    };
  }

  // TODO: do we need to pass in dt separately? probably not
  function update(ctx: CanvasRenderingContext2D, appState: AppState, dt: number) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.update(ctx, appState, dt);
  }

  function reset(appState: AppState, system: Array<CelestialBody>) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.reset(appState, system);
  }

  return {
    containerRef,
    rendererRef,
    canvasRef,
    initialize,
    update,
    reset,
  };
}
