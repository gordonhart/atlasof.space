import { CelestialBody, Point2 } from './types.ts';
import { STATE, STATE_MOONS } from './physics.ts';
import { ELEMENTS } from './constants.ts';
import { AppState, initialState } from './state.ts';
import { toPairs } from 'ramda';

export function drawBodies(ctx: CanvasRenderingContext2D, state: AppState) {
  const {
    drawTail,
    metersPerPx,
    center,
    planetScaleFactor,
    offset: [offsetX, offsetY],
  } = state;

  // TODO: appears to be a bug with far-out planets and tails
  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const canvasDimensions: Point2 = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];

  const [centerOffsetX, centerOffsetY] = center === 'sol' ? [0, 0] : STATE[center].position;
  const sharedDrawParams = { ctx, metersPerPx, canvasDimensions, bodyScaleFactor: planetScaleFactor };
  drawBody({
    ...sharedDrawParams,
    position: [offsetX - centerOffsetX, offsetY - centerOffsetY],
    celestialBody: ELEMENTS.sol,
    bodyScaleFactor: initialState.planetScaleFactor,
  });
  toPairs(STATE).forEach(([name, body]) => {
    Object.entries(STATE_MOONS[name] ?? {}).forEach(([moonName, moonBody]) => {
      const moon = ELEMENTS[name].moons?.[moonName];
      if (moon == null) {
        return;
      }
      drawBody({
        ...sharedDrawParams,
        position: [moonBody.position[0] + offsetX - centerOffsetX, moonBody.position[1] + offsetY - centerOffsetY],
        celestialBody: moon,
      });
    });
    // draw moons first such that they are underneath planet at faraway zooms
    drawBody({
      ...sharedDrawParams,
      position: [body.position[0] + offsetX - centerOffsetX, body.position[1] + offsetY - centerOffsetY],
      celestialBody: ELEMENTS[name],
    });
  });
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
