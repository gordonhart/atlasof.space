import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody } from './constants.ts';
import { degreesToRadians, semiMinorAxis } from './physics.ts';

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
  const [centerOffsetXm, centerOffsetYm] = findCelestialBody(systemState, center)?.position ?? [0, 0];
  const [offsetXm, offsetYm] = [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];

  const hoverBody = hover != null ? findCelestialBody(systemState, hover) : undefined;
  if (hoverBody != null) {
    const { semiMajorAxis, eccentricity, argumentOfPeriapsis } = hoverBody;
    const radiusX = semiMajorAxis / metersPerPx;
    const radiusY = semiMinorAxis(semiMajorAxis, eccentricity) / metersPerPx;
    const rotation = degreesToRadians(argumentOfPeriapsis);
    const centerX = canvasWidthPx / 2 + offsetXm / metersPerPx;
    const centerY = canvasHeightPx / 2 + offsetYm / metersPerPx;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI - rotation, 0, Math.PI * 2);
    ctx.strokeStyle = hoverBody.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawBody({ position, radius, color, satellites }: CelestialBodyState) {
    satellites.forEach(drawBody);
    const [positionXm, positionYm] = [position[0] + offsetXm, position[1] + offsetYm];
    const positionXpx = canvasWidthPx / 2 + positionXm / metersPerPx;
    const positionYpx = canvasHeightPx / 2 + positionYm / metersPerPx;
    const radiusPx = (radius / metersPerPx) * planetScaleFactor;
    ctx.beginPath();
    ctx.arc(positionXpx, positionYpx, Math.max(radiusPx, 1), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawBody(systemState);
}
