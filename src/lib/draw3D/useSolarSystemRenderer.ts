import { useRef } from 'react';
import { SolarSystemRenderer } from './SolarSystemRenderer.ts';
import { CelestialBodyState } from '../types.ts';
import { AppState } from '../state.ts';

export function useSolarSystemRenderer() {
  // Refs to store instances that need to persist between renders
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SolarSystemRenderer | null>(null);

  function update(appState: AppState, systemState: CelestialBodyState) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.update(appState, systemState);
    renderer.render();
  }

  function initialize(appState: AppState, systemState: CelestialBodyState) {
    if (containerRef.current == null) return;
    if (rendererRef.current == null) {
      rendererRef.current = new SolarSystemRenderer(containerRef.current, appState, systemState);
    }
    return () => {
      if (rendererRef.current != null) {
        rendererRef.current?.dispose();
        rendererRef.current = null;
      }
    };
  }

  return {
    ref: containerRef,
    renderer: rendererRef.current,
    initialize,
    update,
  };
}
