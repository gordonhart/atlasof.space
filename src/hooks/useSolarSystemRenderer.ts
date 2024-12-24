import { useRef } from 'react';
import { SolarSystemRenderer } from '../lib/render/SolarSystemRenderer.ts';
import { CelestialBodyState } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';

export function useSolarSystemRenderer() {
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

  function initialize(appState: AppState, systemState: Record<string, CelestialBodyState>) {
    if (containerRef.current == null || canvasRef.current == null) return;
    if (rendererRef.current == null) {
      rendererRef.current = new SolarSystemRenderer(containerRef.current, appState, systemState);
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

  function add(
    appState: AppState,
    parent: Record<string, CelestialBodyState> | null,
    body: Record<string, CelestialBodyState>
  ) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    console.error('not implemented', appState, parent, body);
    // renderer.add(appState, parent, body);
  }

  function update(ctx: CanvasRenderingContext2D, appState: AppState, systemState: Record<string, CelestialBodyState>) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.update(ctx, appState, systemState);
  }

  function reset(appState: AppState, systemState: Record<string, CelestialBodyState>) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.reset(appState, systemState);
  }

  return {
    containerRef,
    rendererRef,
    canvasRef,
    initialize,
    add,
    update,
    reset,
  };
}
