import { BODY_SCALE_FACTOR } from './constants.ts';
import { Point2 } from './types.ts';

export function drawBody(
  ctx: CanvasRenderingContext2D,
  [positionX, positionY]: Point2,
  radius: number,
  color: string,
  metersPerPx: number,
  [canvasWidth, canvasHeight]: Point2
) {
  const bodyCenterX = canvasWidth / 2 + positionX / metersPerPx;
  const bodyCenterY = canvasHeight / 2 + positionY / metersPerPx;
  const r = (radius / metersPerPx) * BODY_SCALE_FACTOR;
  const displayRadius = Math.max(r, 1); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterX, bodyCenterY, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
