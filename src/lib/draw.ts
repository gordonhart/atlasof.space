import { CelestialBody, CelestialBodyState, Point2 } from './types.ts';
import { AppState } from './state.ts';

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail,
    metersPerPx,
    // center, // TODO: reenable
    planetScaleFactor,
    offset: [panOffsetX, panOffsetY],
  } = appState;

  // TODO: appears to be a bug with far-out planets and tails
  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const canvasDimensions: Point2 = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];

  // const [centerOffsetX, centerOffsetY] = center === 'sol' ? [0, 0] : appState[center].position; // TODO
  const [centerOffsetX, centerOffsetY] = [0, 0];
  const [offsetX, offsetY] = [panOffsetX - centerOffsetX, panOffsetY - centerOffsetY];
  const sharedDrawParams = { ctx, metersPerPx, canvasDimensions, bodyScaleFactor: planetScaleFactor };

  function drawBodyRecursive(body: CelestialBodyState) {
    body.satellites.forEach(drawBodyRecursive);
    drawBody({
      ...sharedDrawParams,
      position: [body.position[0] + offsetX, body.position[1] + offsetY],
      celestialBody: body,
    });
  }

  drawBodyRecursive(systemState);
}

type Params = {
  ctx: CanvasRenderingContext2D;
  position: Point2;
  celestialBody: Pick<CelestialBody, 'radius' | 'color'>;
  metersPerPx: number;
  canvasDimensions: Point2;
  bodyScaleFactor: number;
};
function drawBody({
  ctx,
  position: [positionX, positionY],
  celestialBody: { radius, color },
  metersPerPx,
  canvasDimensions: [canvasWidth, canvasHeight],
  bodyScaleFactor,
}: Params) {
  const bodyCenterX = canvasWidth / 2 + positionX / metersPerPx;
  const bodyCenterY = canvasHeight / 2 + positionY / metersPerPx;
  const r = (radius / metersPerPx) * bodyScaleFactor;
  const displayRadius = Math.max(r, 1); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterX, bodyCenterY, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
