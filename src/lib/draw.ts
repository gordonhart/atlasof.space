import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody } from './constants.ts';
import { orbitalEllipseAtTheta } from './physics.ts';

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail,
    drawOrbit: shouldDrawOrbits,
    metersPerPx,
    center,
    planetScaleFactor,
    offset: [panOffsetXm, panOffsetYm],
    hover,
    visibleTypes,
  } = appState;

  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const [canvasWidthPx, canvasHeightPx] = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
  const centerBody = findCelestialBody(systemState, center);
  const [centerOffsetXm, centerOffsetYm] = centerBody?.position ?? [0, 0];
  const [offsetXm, offsetYm] = [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];

  function drawBody({ name, position, radius, color, satellites, type }: CelestialBodyState) {
    if (!visibleTypes.has(type)) {
      return;
    }
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

  function drawOrbit(parent: CelestialBodyState | null, body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) {
      return;
    }
    body.satellites.forEach(child => drawOrbit(body, child));
    const offset = [(parent?.position?.[0] ?? 0) + offsetXm, (parent?.position?.[1] ?? 0) + offsetYm];
    drawOrbitalEllipse(ctx, body, [canvasWidthPx, canvasHeightPx], offset, metersPerPx, 0.5);
  }

  const hoverBody = hover != null ? findCelestialBody(systemState, hover) : undefined;
  if (hoverBody != null) {
    drawOrbitalEllipse(ctx, hoverBody, [canvasWidthPx, canvasHeightPx], [offsetXm, offsetYm], metersPerPx);
  }

  if (shouldDrawOrbits) {
    drawOrbit(null, systemState);
  }

  drawBody(systemState);
}

function drawOrbitalEllipse(
  ctx: CanvasRenderingContext2D,
  body: CelestialBodyState,
  [canvasWidthPx, canvasHeightPx]: [number, number],
  [offsetXm, offsetYm]: [number, number],
  metersPerPx: number,
  lineWidth = 1
) {
  ctx.beginPath();
  const steps = 360; // number of segments to approximate the ellipse
  for (let step = 0; step <= steps; step++) {
    const theta = (step / steps) * 2 * Math.PI;
    const [xM, yM] = orbitalEllipseAtTheta(body, theta);
    const xPx = canvasWidthPx / 2 + (xM + offsetXm) / metersPerPx;
    const yPx = canvasHeightPx / 2 + (yM + offsetYm) / metersPerPx;
    if (step === 0) {
      ctx.moveTo(xPx, yPx);
    } else {
      ctx.lineTo(xPx, yPx);
    }
  }
  ctx.strokeStyle = body.color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}
