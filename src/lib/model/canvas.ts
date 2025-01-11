import { Point2 } from '../types.ts';

export const LABEL_FONT_FAMILY = 'Electrolize, Arial';

export function isOffScreen([xPx, yPx]: Point2, [containerXpx, containerYpx]: Point2, marginPx = 0) {
  return xPx < -marginPx || xPx > containerXpx + marginPx || yPx < -marginPx || yPx > containerYpx + marginPx;
}

export function getCanvasPixels(ctx: CanvasRenderingContext2D): Point2 {
  const dpr = window.devicePixelRatio ?? 1;
  return [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
}

// TODO: corners behave weirdly with this implementation; may want 4 more types for the corners
export function drawOffscreenIndicator(
  ctx: CanvasRenderingContext2D,
  color: `#${string}`,
  [canvasWidthPx, canvasHeightPx]: Point2,
  [xPx, yPx]: Point2
) {
  const edgePad = 24;
  const [halfX, halfY] = [canvasWidthPx / 2, canvasHeightPx / 2];
  const [xMin, xMax, yMin, yMax] = [-halfX, halfX, -halfY, halfY];
  const [targetXpx, targetYpx] = [xPx - halfX, yPx - halfY];
  const slope = targetYpx / targetXpx;
  const [leftEdgeY, rightEdgeY, bottomEdgeX, topEdgeX] = [slope * xMin, slope * xMax, yMin / slope, yMax / slope];
  let drawPx: Point2 = [-Infinity, -Infinity];
  let caret: { type: CaretType; offsetPx: Point2 } = { type: 'left', offsetPx: [0, 0] };
  if (yMin <= leftEdgeY && leftEdgeY <= yMax && targetXpx < 0) {
    drawPx = [xMin + edgePad, leftEdgeY];
    caret = { type: 'left', offsetPx: [-edgePad / 2, 0] };
  } else if (yMin <= rightEdgeY && rightEdgeY <= yMax) {
    drawPx = [xMax - edgePad, rightEdgeY];
    caret = { type: 'right', offsetPx: [edgePad / 2, 0] };
  } else if (xMin <= bottomEdgeX && bottomEdgeX <= xMax && targetYpx < 0) {
    drawPx = [bottomEdgeX, yMin + edgePad];
    caret = { type: 'down', offsetPx: [0, -edgePad / 2] };
  } else if (xMin <= topEdgeX && topEdgeX <= xMax) {
    drawPx = [topEdgeX, yMax - edgePad];
    caret = { type: 'up', offsetPx: [0, edgePad / 2] };
  }
  const [drawXpx, drawYpx]: Point2 = [drawPx[0] + halfX, drawPx[1] + halfY];
  const trianglePx: Point2 = [drawXpx + caret.offsetPx[0], drawYpx + caret.offsetPx[1]];
  drawCaretAtLocation(ctx, color, trianglePx, caret.type);
}

export function drawLabelAtLocation(
  ctx: CanvasRenderingContext2D,
  label: string,
  color: `#${string}`,
  [xPx, yPx]: Point2,
  [textWidthPx, textHeightPx]: Point2,
  radius: number
): [Point2, Point2] {
  const dpr = window.devicePixelRatio;
  const [canvasWidthPx, canvasHeightPx] = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
  ctx.save();
  ctx.scale(1, -1); // flip and translate to get text right-side-up
  ctx.translate(0, -canvasHeightPx);
  const yPxInverted = canvasHeightPx - yPx;

  const boxPadPx = 4;
  const h = textHeightPx + boxPadPx * 2;
  const w = textWidthPx + h / 2;
  const angle = Math.atan2(2, 1);
  const [xOffset, yOffset] = [radius * Math.cos(angle), radius * Math.sin(angle)];

  // calculate flippage to keep labels from going offscreen
  const xIsCloseToRightEdge = xPx + xOffset + w + boxPadPx > canvasWidthPx - boxPadPx;
  const xSign = xIsCloseToRightEdge ? -1 : 1;
  const yIsCloseToTopEdge = yPxInverted - yOffset - h - boxPadPx < boxPadPx;
  const ySign = yIsCloseToTopEdge ? -1 : 1;

  // draw background
  const [x0, y0] = [xPx + xOffset * xSign, yPxInverted - yOffset * ySign];
  const offsets: Array<Point2> = [
    [w + boxPadPx, 0],
    [w + boxPadPx, h],
    [h / 2, h],
  ];
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  offsets.forEach(([x, y]) => ctx.lineTo(x0 + x * xSign, y0 - y * ySign));
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.strokeStyle = color;
  ctx.fill();
  ctx.stroke();

  // draw text
  ctx.fillStyle = color;
  ctx.fillText(label, xIsCloseToRightEdge ? x0 - w : x0 + h / 2, y0 - boxPadPx + (yIsCloseToTopEdge ? h : 0));
  ctx.restore();

  const [oppositeX, oppositeY] = offsets[1];
  return [
    [x0, y0],
    [x0 + oppositeX * xSign, y0 - oppositeY * ySign],
  ];
}

export function drawDotAtLocation(
  ctx: CanvasRenderingContext2D,
  color: `#${string}`,
  [xPx, yPx]: Point2, // centered on this value
  radiusPx: number
) {
  ctx.beginPath();
  ctx.arc(xPx, yPx, radiusPx, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.closePath();
  ctx.fill();
}

type CaretType = 'right' | 'left' | 'up' | 'down';
function drawCaretAtLocation(
  ctx: CanvasRenderingContext2D,
  color: `#${string}`,
  [xPx, yPx]: Point2, // centered on this value
  type: CaretType
) {
  const [short, long] = [2, 6];
  // prettier-ignore
  const vertices: Array<Point2> = type === 'right'
    ? [[xPx + short, yPx], [xPx - short, yPx - long], [xPx - short, yPx + long]]
    : type === 'left'
      ? [[xPx - short, yPx], [xPx + short, yPx - long], [xPx + short, yPx + long]]
      : type === 'up'
        ? [[xPx, yPx + short], [xPx + long, yPx - short], [xPx - long, yPx - short]]
        : [[xPx, yPx - short], [xPx + long, yPx + short], [xPx - long, yPx + short]];
  ctx.beginPath();
  ctx.moveTo(...vertices[0]);
  vertices.reverse().forEach(vertex => {
    ctx.lineTo(...vertex);
  });
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.strokeStyle = color;
  ctx.fill();
  ctx.stroke();
}
