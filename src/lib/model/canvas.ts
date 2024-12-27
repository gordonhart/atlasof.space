import { Point2 } from '../types.ts';

export function getCanvasPixels(ctx: CanvasRenderingContext2D): Point2 {
  const dpr = window.devicePixelRatio ?? 1;
  return [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
}

export function drawOffscreenLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  color: `#${string}`,
  [canvasWidthPx, canvasHeightPx]: Point2,
  [xPx, yPx]: Point2,
  [textWidthPx, textHeightPx]: Point2
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
    caret = { type: 'left', offsetPx: [-edgePad / 2, textHeightPx / 2] };
  } else if (yMin <= rightEdgeY && rightEdgeY <= yMax) {
    drawPx = [xMax - edgePad - textWidthPx, rightEdgeY];
    caret = { type: 'right', offsetPx: [textWidthPx + edgePad / 2, textHeightPx / 2] };
  } else if (xMin <= bottomEdgeX && bottomEdgeX <= xMax && targetYpx < 0) {
    drawPx = [bottomEdgeX, yMin + edgePad];
    caret = { type: 'down', offsetPx: [textWidthPx / 2, -edgePad / 2] };
  } else if (xMin <= topEdgeX && topEdgeX <= xMax) {
    drawPx = [topEdgeX, yMax - edgePad - textHeightPx];
    caret = { type: 'up', offsetPx: [textWidthPx / 2, textHeightPx + edgePad / 2] };
  }
  const [drawXpx, drawYpx]: Point2 = [drawPx[0] + halfX, drawPx[1] + halfY];
  drawLabelAtLocation(ctx, label, color, [drawXpx, drawYpx], [textWidthPx, textHeightPx]);
  const trianglePx: Point2 = [drawXpx + caret.offsetPx[0], drawYpx + caret.offsetPx[1]];
  drawCaretAtLocation(ctx, color, trianglePx, caret.type);
}

export function drawLabelAtLocation(
  ctx: CanvasRenderingContext2D,
  label: string,
  color: `#${string}`,
  [xPx, yPx]: Point2,
  [textWidthPx, textHeightPx]: Point2
) {
  ctx.save();
  ctx.scale(1, -1); // flip and translate to get text right-side-up
  ctx.translate(0, -window.innerHeight);
  const yPxInverted = window.innerHeight - yPx;

  // draw background
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.strokeStyle = color;
  const boxPadPx = 4;
  const boxLocationPx: Point2 = [xPx - boxPadPx, yPxInverted - textHeightPx - boxPadPx];
  const boxDimensionPx: Point2 = [textWidthPx + boxPadPx * 2, textHeightPx + boxPadPx * 2];
  ctx.roundRect(...boxLocationPx, ...boxDimensionPx, 5);
  ctx.fill();
  ctx.stroke();

  // draw text
  ctx.fillStyle = color;
  ctx.fillText(label, xPx, yPxInverted);
  ctx.restore();
}

type CaretType = 'right' | 'left' | 'up' | 'down';
function drawCaretAtLocation(
  ctx: CanvasRenderingContext2D,
  color: `#${string}`,
  [xPx, yPx]: Point2, // centered on this value
  type: CaretType
) {
  const size = 3;
  // prettier-ignore
  const vertices: Array<Point2> = type === 'right'
    ? [[xPx + size, yPx], [xPx - size, yPx - size], [xPx - size, yPx + size]]
    : type === 'left'
      ? [[xPx - size, yPx], [xPx + size, yPx - size], [xPx + size, yPx + size]]
      : type === 'up'
        ? [[xPx, yPx + size], [xPx + size, yPx - size], [xPx - size, yPx - size]]
        : [[xPx, yPx - size], [xPx + size, yPx + size], [xPx - size, yPx + size]];
  ctx.beginPath();
  ctx.moveTo(...vertices[0]);
  vertices.reverse().forEach(vertex => {
    ctx.lineTo(...vertex);
  });
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
