import { useRef } from 'react';
import { SolarSystemRenderer } from '../lib/render/SolarSystemRenderer.ts';
import { CelestialBody } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';

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
      rendererRef.current = new SolarSystemRenderer(containerRef.current, appState);
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

  function update(ctx: CanvasRenderingContext2D, appState: AppState) {
    rendererRef.current?.update(ctx, appState);
  }

  function add(appState: AppState, body: CelestialBody) {
    rendererRef.current?.add(appState, body);
  }

  function remove(name: string) {
    rendererRef.current?.remove(name);
  }

  function reset(appState: AppState) {
    rendererRef.current?.reset(appState);
  }

  return {
    containerRef,
    rendererRef,
    canvasRef,
    initialize,
    update,
    add,
    remove,
    reset,
  };
}
