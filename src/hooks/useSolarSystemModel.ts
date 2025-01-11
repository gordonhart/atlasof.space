import { useRef } from 'react';
import { SolarSystemModel } from '../lib/model/SolarSystemModel.ts';
import { Settings } from '../lib/state.ts';
import { CelestialBody } from '../lib/types.ts';

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

  function initialize(settings: Settings) {
    if (containerRef.current == null || canvasRef.current == null) return;
    if (modelRef.current == null) {
      modelRef.current = new SolarSystemModel(containerRef.current, settings);
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
    if (containerRef.current == null) return;
    modelRef.current?.resize(containerRef.current);
    initializeCanvas();
  }

  function update(ctx: CanvasRenderingContext2D, settings: Settings) {
    modelRef.current?.update(ctx, settings);
  }

  function add(settings: Settings, body: CelestialBody) {
    modelRef.current?.add(settings, body);
  }

  function remove(id: string) {
    modelRef.current?.remove(id);
  }

  function reset(settings: Settings) {
    modelRef.current?.reset(settings);
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
