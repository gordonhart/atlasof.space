import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody } from './constants.ts';
import { incrementState, orbitalPeriod } from './physics.ts';

const ORBIT_CACHE: Record<string, Array<CelestialBodyState>> = {};

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail,
    metersPerPx,
    center,
    planetScaleFactor,
    offset: [panOffsetXm, panOffsetYm],
    hover,
  } = appState;

  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const [canvasWidthPx, canvasHeightPx] = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
  const centerBody = findCelestialBody(systemState, center);
  const [centerOffsetXm, centerOffsetYm] = centerBody?.position ?? [0, 0];
  const [offsetXm, offsetYm] = [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];

  function drawBody({ name, position, radius, color, satellites }: CelestialBodyState) {
    satellites.forEach(drawBody);
    const [positionXm, positionYm] = [position[0] + offsetXm, position[1] + offsetYm];
    const positionXpx = canvasWidthPx / 2 + positionXm / metersPerPx;
    const positionYpx = canvasHeightPx / 2 + positionYm / metersPerPx;
    const radiusPx = Math.max((radius / metersPerPx) * planetScaleFactor, 1);
    const radiusScaledPx = name === hover ? radiusPx * 5 : radiusPx;
    ctx.beginPath();
    ctx.arc(positionXpx, positionYpx, radiusScaledPx, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  const hoverBody = hover != null ? findCelestialBody(systemState, hover) : undefined;
  if (hoverBody != null) {
    if (ORBIT_CACHE[hoverBody.name] == null) {
      const simplifiedSystem = { ...systemState, satellites: [{ ...hoverBody, name: 'foobar', satellites: [] }] };
      const period = orbitalPeriod(hoverBody.semiMajorAxis, systemState.mass);
      const targetSteps = 1000;
      const dt = period / targetSteps;
      ORBIT_CACHE[hoverBody.name] = Array(targetSteps)
        .fill(null)
        .reduce(acc => [...acc, incrementState(acc[acc.length - 1], dt)], [simplifiedSystem]);
    }
    ORBIT_CACHE[hoverBody.name].forEach(drawBody);
  }

  drawBody(systemState);
}
