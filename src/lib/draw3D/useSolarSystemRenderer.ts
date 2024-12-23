import { useRef } from 'react';
import { SolarSystemRenderer } from './SolarSystemRenderer.ts';
import { CelestialBodyState } from '../types.ts';
import { AppState } from '../state.ts';

export function useSolarSystemRenderer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SolarSystemRenderer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function update(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.update(appState, systemState);
    renderer.render(ctx);
  }

  function initialize(appState: AppState, systemState: CelestialBodyState) {
    if (containerRef.current == null || canvasRef.current == null) return;
    if (rendererRef.current == null) {
      rendererRef.current = new SolarSystemRenderer(containerRef.current, appState, systemState);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(dpr, -dpr);
    ctx.translate(0, -canvas.height / dpr);
    return () => {
      if (rendererRef.current != null) {
        rendererRef.current?.dispose();
        rendererRef.current = null;
      }
    };
  }

  return {
    containerRef,
    rendererRef,
    canvasRef,
    initialize,
    update,
  };
}
