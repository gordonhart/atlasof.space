import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody } from './constants.ts';

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail,
    metersPerPx,
    center,
    planetScaleFactor,
    offset: [panOffsetXm, panOffsetYm],
  } = appState;

  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const [canvasWidthPx, canvasHeightPx] = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
  const [centerOffsetXm, centerOffsetYm] = findCelestialBody(systemState, center)?.position ?? [0, 0];
  const [offsetXm, offsetYm] = [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];

  function drawBody({ position, radius, color, satellites }: CelestialBodyState) {
    satellites.forEach(drawBody);
    const [positionXm, positionYm] = [position[0] + offsetXm, position[1] + offsetYm];
    const bodyCenterXpx = canvasWidthPx / 2 + positionXm / metersPerPx;
    const bodyCenterYpx = canvasHeightPx / 2 + positionYm / metersPerPx;
    const radiusPx = (radius / metersPerPx) * planetScaleFactor;
    ctx.beginPath();
    ctx.arc(bodyCenterXpx, bodyCenterYpx, Math.max(radiusPx, 1), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawBody(systemState);
}
