import { Point2 } from './types.ts';

type Params = {
  ctx: CanvasRenderingContext2D;
  position: Point2;
  radius: number;
  color: string;
  metersPerPx: number;
  canvasDimensions: Point2;
  bodyScaleFactor: number;
};
export function drawBody({
  ctx,
  position: [positionX, positionY],
  radius,
  color,
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
