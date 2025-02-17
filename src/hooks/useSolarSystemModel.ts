import { useCallback, useEffect, useRef } from 'react';
import { SolarSystemModel } from '../lib/model/SolarSystemModel.ts';
import { Settings, useAppState } from '../lib/state.ts';
import { CelestialBody, CelestialBodyId, Epoch } from '../lib/types.ts';

export function useSolarSystemModel() {
  const center = useAppState(state => state.settings.center);
  const updateSettings = useAppState(state => state.updateSettings);
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

  function update(ctx: CanvasRenderingContext2D) {
    modelRef.current?.update(useAppState.getState().settings, ctx);
  }

  function addBody(body: CelestialBody) {
    updateSettings(prev => {
      modelRef.current?.add(prev, body);
      return { ...prev, bodies: [...prev.bodies, body] };
    });
  }

  function removeBody(id: CelestialBodyId) {
    updateSettings(prev => ({ ...prev, bodies: prev.bodies.filter(b => b.id !== id) }));
    modelRef.current?.remove(id);
  }

  const reset = useCallback(
    (settings: Settings, camera = true) => {
      modelRef.current?.reset(settings, camera);
    },
    [modelRef.current]
  );

  const setEpoch = useCallback(
    (epoch: Epoch) => {
      updateSettings(prev => {
        const newSettings = { ...prev, epoch };
        reset(newSettings, false);
        return newSettings;
      });
    },
    [reset]
  );

  function resize() {
    if (containerRef.current == null) return;
    modelRef.current?.resize(containerRef.current);
    initializeCanvas();
  }

  useEffect(() => {
    resize();
  }, [center != null]);

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
