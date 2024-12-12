import {BODY_SCALE_FACTOR, Point} from "./constants.ts";

export function drawBody(
  ctx: CanvasRenderingContext2D,
  position: Point,
  radius: number,
  color: string,
  metersPerPx: number,
  canvasDimensions: Point
) {
  const canvasCenterPx = { x: canvasDimensions.x / 2, y: canvasDimensions.y / 2 };
  const bodyCenterPx = {
    x: canvasCenterPx.x + (position.x / metersPerPx),
    y: canvasCenterPx.y + (position.y / metersPerPx),
  }
  // console.log(bodyCenterPx)
  const r = radius / metersPerPx * BODY_SCALE_FACTOR;
  const displayRadius = Math.max(r, 1); // ensure always visible
  ctx.beginPath();
  ctx.arc(bodyCenterPx.x, bodyCenterPx.y, displayRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawTimestamp(ctx: CanvasRenderingContext2D, timestamp: number) {
  const nDays = (timestamp / 60 / 60 / 24).toFixed(0);
  ctx.font = '12px sans-serif';
  ctx.save();
  ctx.scale(1, -1); // Temporarily flip the canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(45, -45, 100, -20)
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`t = ${nDays} days`, 50, -50); // Position text correctly by negating y
  ctx.restore(); // unflip canvas
}