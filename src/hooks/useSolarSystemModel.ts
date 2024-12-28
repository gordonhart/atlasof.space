import { useRef } from 'react';
import { SolarSystemModel } from '../lib/model/SolarSystemModel.ts';
import { CelestialBody } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';

export function useSolarSystemModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<SolarSystemModel | null>(null);

  function initializeCanvas() {
    const canvas = canvasRef.current;
    if (canvas == null || containerRef.current == null) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = containerRef.current.clientWidth * dpr;
    canvas.height = containerRef.current.clientHeight * dpr;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(dpr, -dpr);
    ctx.translate(0, -canvas.height / dpr);
  }

  function initialize(appState: AppState) {
    if (containerRef.current == null || canvasRef.current == null) return;
    if (modelRef.current == null) {
      modelRef.current = new SolarSystemModel(containerRef.current, appState);
    }
    initializeCanvas();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (modelRef.current != null) {
        modelRef.current?.dispose();
        modelRef.current = null;
      }
    };
  }

  function resize() {
    const width = containerRef.current?.clientWidth ?? window.innerWidth;
    const height = containerRef.current?.clientHeight ?? window.innerHeight;
    modelRef.current?.resize(width, height);
    initializeCanvas();
  }

  function update(ctx: CanvasRenderingContext2D, appState: AppState) {
    modelRef.current?.update(ctx, appState);
  }

  function add(appState: AppState, body: CelestialBody) {
    modelRef.current?.add(appState, body);
  }

  function remove(name: string) {
    modelRef.current?.remove(name);
  }

  function reset(appState: AppState) {
    modelRef.current?.reset(appState);
  }

  return {
    containerRef,
    canvasRef,
    modelRef,
    initialize,
    update,
    add,
    resize,
    remove,
    reset,
  };
}
