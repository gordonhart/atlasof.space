import { useEffect, useRef } from 'react';
import { SolarSystemModel } from '../lib/model/SolarSystemModel.ts';
import { Settings, UpdateSettings } from '../lib/state.ts';
import { CelestialBody, CelestialBodyId, Epoch } from '../lib/types.ts';

type Params = {
  settings: Settings;
  updateSettings: UpdateSettings;
};
export function useSolarSystemModel({ settings, updateSettings }: Params) {
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

  function update(ctx: CanvasRenderingContext2D, settings: Settings) {
    modelRef.current?.update(ctx, settings);
  }

  function addBody(body: CelestialBody) {
    updateSettings(prev => {
      modelRef.current?.add(settings, body);
      return { ...prev, bodies: [...prev.bodies, body] };
    });
  }

  function removeBody(id: CelestialBodyId) {
    updateSettings(prev => ({ ...prev, bodies: prev.bodies.filter(b => b.id !== id) }));
    modelRef.current?.remove(id);
  }

  function reset(settings: Settings, camera = true) {
    modelRef.current?.reset(settings, camera);
  }

  function setEpoch(epoch: Epoch) {
    updateSettings(prev => {
      const newSettings = { ...prev, epoch };
      reset(newSettings, false);
      return newSettings;
    });
  }

  function resize() {
    if (containerRef.current == null) return;
    modelRef.current?.resize(containerRef.current);
    initializeCanvas();
  }

  useEffect(() => {
    resize();
  }, [settings.center]);

  return {
    containerRef,
    canvasRef,
    modelRef,
    initialize,
    resize,
    update,
    addBody,
    removeBody,
    setEpoch,
    reset,
  };
}
