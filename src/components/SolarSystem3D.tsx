import { useEffect, useRef } from 'react';
import { SolarSystemRenderer } from '../lib/draw3D/SolarSystemRenderer.ts';
import { CelestialBodyState } from '../lib/types';
import { AppState } from '../lib/state';
import { findCelestialBody } from '../lib/utils.ts';
import { Box } from '@mantine/core';
import { CelestialBody3D, createCelestialSystem } from '../lib/draw3D/CelestialBody3D.ts';

interface SolarSystemProps {
  systemState: CelestialBodyState;
  appState: AppState;
}

export function SolarSystem3D({ systemState, appState }: SolarSystemProps) {
  // Refs to store instances that need to persist between renders
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SolarSystemRenderer | null>(null);
  const bodiesRef = useRef<Map<string, CelestialBody3D>>(new Map());
  const animationFrameRef = useRef<number>(-1);

  useEffect(() => {
    if (containerRef.current == null) return;

    // Initialize Three.js scene
    if (!rendererRef.current) {
      const renderer = new SolarSystemRenderer(containerRef.current);
      rendererRef.current = renderer;
      bodiesRef.current = createCelestialSystem(renderer.getScene(), systemState, appState.visibleTypes);
    }

    // Animation loop
    function animate() {
      if (rendererRef.current == null) return;

      // Update renderer with current app state
      rendererRef.current?.updateFromAppState(appState);

      // Update all celestial bodies
      bodiesRef.current.forEach((body, name) => {
        const bodyState = findCelestialBody(systemState, name);
        if (bodyState) {
          body.update(bodyState, appState.hover);
        }
      });

      rendererRef.current?.render();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clean up bodies
      bodiesRef.current.forEach(body => body.dispose());
      bodiesRef.current.clear();

      // Clean up renderer
      if (rendererRef.current != null) {
        rendererRef.current?.dispose();
        rendererRef.current = null;
      }
    };
  }, []); // Empty deps array since we handle updates in the animation loop

  return <Box ref={containerRef} bg="blue" pos="absolute" top={0} left={0} />;
}
