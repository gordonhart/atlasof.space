import { CelestialBodyState, Point2 } from './types.ts';
import { AppState } from './state.ts';
import { ASTEROID_BELT, findCelestialBody, KUIPER_BELT } from './constants.ts';
import { degreesToRadians, orbitalEllipseAtTheta } from './physics.ts';

export function drawSystem(
  ctx: CanvasRenderingContext2D,
  { drawTail, metersPerPx, center, planetScaleFactor, offset, hover, visibleTypes }: AppState,
  systemState: CelestialBodyState
) {
  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const canvasPx = getCanvasPixels(ctx);
  const offsetMeters = getOffsetMeters(ctx, systemState, offset, center);

  function drawBodyRecursive(body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) return;
    body.satellites.forEach(drawBodyRecursive);
    const radiusScaled = (body.name === hover ? body.radius * 5 : body.radius) * planetScaleFactor;
    const bodyToDraw = { ...body, radius: radiusScaled };
    drawBody(ctx, bodyToDraw, canvasPx, offsetMeters, metersPerPx);
  }

  drawBodyRecursive(systemState);
}

export function drawAnnotations(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawOrbit: shouldDrawOrbits,
    drawLabel: shouldDrawLabels,
    metersPerPx,
    center,
    planetScaleFactor,
    offset,
    hover,
    visibleTypes,
  } = appState;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const canvasPx = getCanvasPixels(ctx);
  const [offsetXm, offsetYm] = getOffsetMeters(ctx, systemState, offset, center);

  function drawOrbitRecursive(parent: CelestialBodyState | null, body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) return;
    body.satellites.forEach(child => drawOrbitRecursive(body, child));
    const offset: Point2 = [(parent?.position?.[0] ?? 0) + offsetXm, (parent?.position?.[1] ?? 0) + offsetYm];
    drawOrbit(ctx, body, canvasPx, offset, metersPerPx, 0.5);
  }

  // TODO: why doesn't this position need to be offset by the parent...?
  function drawLabelRecursive(body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) return;
    body.satellites.forEach(child => drawLabelRecursive(child));
    const radiusScaled = (body.name === hover ? body.radius * 5 : body.radius) * planetScaleFactor;
    const labelBody = { ...body, radius: radiusScaled };
    drawLabel(ctx, labelBody, canvasPx, [offsetXm, offsetYm], metersPerPx);
  }

  if (visibleTypes.has('belt')) {
    [ASTEROID_BELT, KUIPER_BELT].forEach(({ min, max }) => {
      drawBelt(ctx, [min, max], canvasPx, [offsetXm, offsetYm], metersPerPx);
    });
  }

  // order here is important; ensure higher-priority information is drawn on top (later)
  const hoverBody = hover != null ? findCelestialBody(systemState, hover) : undefined;
  if (hoverBody != null) drawOrbit(ctx, hoverBody, canvasPx, [offsetXm, offsetYm], metersPerPx);
  if (shouldDrawOrbits) drawOrbitRecursive(null, systemState);
  if (shouldDrawLabels) drawLabelRecursive(systemState);
}

function getCanvasPixels(ctx: CanvasRenderingContext2D): Point2 {
  const dpr = window.devicePixelRatio ?? 1;
  return [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
}

function getOffsetMeters(
  ctx: CanvasRenderingContext2D,
  body: CelestialBodyState,
  [panOffsetXm, panOffsetYm]: Point2,
  center: string
): Point2 {
  const centerBody = findCelestialBody(body, center);
  const [centerOffsetXm, centerOffsetYm] = centerBody?.position ?? [0, 0];
  return [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  { position, radius, color, rotation, siderealRotationPeriod }: CelestialBodyState,
  [canvasWidthPx, canvasHeightPx]: Point2,
  [offsetXm, offsetYm]: Point2,
  metersPerPx: number
) {
  const [positionXm, positionYm] = [position[0] + offsetXm, position[1] + offsetYm];
  const positionXpx = canvasWidthPx / 2 + positionXm / metersPerPx;
  const positionYpx = canvasHeightPx / 2 + positionYm / metersPerPx;
  const radiusPx = Math.max(radius / metersPerPx, 1);
  ctx.beginPath();
  ctx.arc(positionXpx, positionYpx, radiusPx, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // draw rotation indicator
  if (siderealRotationPeriod != null) {
    const rotationOffset = degreesToRadians(rotation);
    ctx.beginPath();
    ctx.arc(positionXpx, positionYpx, radiusPx + 1, rotationOffset - Math.PI / 32, rotationOffset + Math.PI / 32);
    ctx.lineTo(positionXpx, positionYpx);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(positionXpx, positionYpx, 0.8 * radiusPx, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function drawBelt(
  ctx: CanvasRenderingContext2D,
  [min, max]: Point2,
  [canvasWidthPx, canvasHeightPx]: Point2,
  [offsetXm, offsetYm]: Point2,
  metersPerPx: number
) {
  const fadePx = (max - min) / 8 / metersPerPx;
  const centerPx: Point2 = [canvasWidthPx / 2 + offsetXm / metersPerPx, canvasHeightPx / 2 + offsetYm / metersPerPx];
  const minRad = min / metersPerPx - fadePx;
  const maxRad = max / metersPerPx + fadePx;
  const gradient = ctx.createRadialGradient(...centerPx, minRad, ...centerPx, maxRad);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.05)');
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.beginPath();
  ctx.arc(...centerPx, minRad, 0, Math.PI * 2, true);
  ctx.arc(...centerPx, maxRad, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawOrbit(
  ctx: CanvasRenderingContext2D,
  body: CelestialBodyState,
  [canvasWidthPx, canvasHeightPx]: Point2,
  [offsetXm, offsetYm]: Point2,
  metersPerPx: number,
  lineWidth = 1
) {
  function toPx(xM: number, yM: number): Point2 {
    return [canvasWidthPx / 2 + (xM + offsetXm) / metersPerPx, canvasHeightPx / 2 + (yM + offsetYm) / metersPerPx];
  }
  const steps = 360; // number of segments to approximate the ellipse
  ctx.beginPath();
  const [initX, initY] = orbitalEllipseAtTheta(body, 0);
  ctx.moveTo(...toPx(initX, initY));
  for (let step = 1; step <= steps; step += 2) {
    const [p0x, p0y] = orbitalEllipseAtTheta(body, (step / steps) * 2 * Math.PI);
    const [p1x, p1y] = orbitalEllipseAtTheta(body, ((step + 1) / steps) * 2 * Math.PI);
    ctx.quadraticCurveTo(...toPx(p0x, p0y), ...toPx(p1x, p1y));
  }
  ctx.strokeStyle = body.color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// TODO: show edge indicator for off-screen bodies?
function drawLabel(
  ctx: CanvasRenderingContext2D,
  { color, radius, name, position }: CelestialBodyState,
  [canvasWidthPx, canvasHeightPx]: Point2,
  [offsetXm, offsetYm]: Point2,
  metersPerPx: number
) {
  ctx.save();
  ctx.font = '12px Arial';
  ctx.scale(1, -1); // flip and translate to get text right-side-up
  ctx.translate(0, -window.innerHeight);
  const [bodyXm, bodyYm] = position;
  const bodyXpx = canvasWidthPx / 2 + (bodyXm + offsetXm) / metersPerPx;
  const bodyYpx = window.innerHeight - (canvasHeightPx / 2 + (bodyYm + offsetYm) / metersPerPx);
  const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(name);

  // body is off-screen; draw a pointer
  if (bodyXpx < 0 || bodyXpx > window.innerWidth || bodyYpx < 0 || bodyYpx > window.innerHeight) {
    const edgePad = 24;
    const [halfX, halfY] = [canvasWidthPx / 2, canvasHeightPx / 2];
    const [xMin, xMax, yMin, yMax] = [-halfX, halfX, -halfY, halfY];
    const [targetXpx, targetYpx] = [bodyXpx - halfX, bodyYpx - halfY];
    const slope = targetYpx / targetXpx;
    const leftEdgeY = slope * xMin;
    const rightEdgeY = slope * xMax;
    const bottomEdgeX = yMin / slope;
    const topEdgeX = yMax / slope;
    let drawPx: Point2 = [-Infinity, -Infinity];
    let triangleOffsetPx: Point2 = [0, 0];
    if (yMin <= leftEdgeY && leftEdgeY <= yMax && targetXpx < 0) {
      drawPx = [xMin + edgePad, leftEdgeY];
      triangleOffsetPx = [-edgePad / 2, -textHeightPx / 2];
    } else if (yMin <= rightEdgeY && rightEdgeY <= yMax) {
      drawPx = [xMax - edgePad - textWidthPx, rightEdgeY];
      triangleOffsetPx = [textWidthPx + edgePad / 2, -textHeightPx / 2];
    } else if (xMin <= bottomEdgeX && bottomEdgeX <= xMax && targetYpx < 0) {
      drawPx = [bottomEdgeX, yMin + edgePad + textHeightPx];
      triangleOffsetPx = [textWidthPx / 2, -textHeightPx - edgePad / 2];
    } else if (xMin <= topEdgeX && topEdgeX <= xMax) {
      drawPx = [topEdgeX, yMax - edgePad];
      triangleOffsetPx = [textWidthPx / 2, edgePad / 2];
    }
    const [drawXpx, drawYpx]: Point2 = [drawPx[0] + halfX, drawPx[1] + halfY];
    drawLabelAtLocation(ctx, name, color, [drawXpx, drawYpx], [textWidthPx, textHeightPx]);
    const trianglePx = [drawXpx + triangleOffsetPx[0], drawYpx + triangleOffsetPx[1]];
    drawTriangleAtLocation(ctx, color, trianglePx, Math.atan2(targetYpx, targetXpx));
  } else {
    const [offsetXpx, offsetYpx] = [textWidthPx / 2, Math.max(radius / metersPerPx, 1) + 10];
    drawLabelAtLocation(ctx, name, color, [bodyXpx - offsetXpx, bodyYpx - offsetYpx], [textWidthPx, textHeightPx]);
  }

  ctx.restore();
}

function drawLabelAtLocation(
  ctx: CanvasRenderingContext2D,
  label: string,
  color: string,
  [xPx, yPx]: Point2,
  [textWidthPx, textHeightPx]: Point2
) {
  // draw background
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.strokeStyle = color;
  const boxPadPx = 4;
  const boxLocationPx: Point2 = [xPx - boxPadPx, yPx - textHeightPx - boxPadPx];
  const boxDimensionPx: Point2 = [textWidthPx + boxPadPx * 2, textHeightPx + boxPadPx * 2];
  ctx.roundRect(...boxLocationPx, ...boxDimensionPx, 5);
  ctx.fill();
  ctx.stroke();

  // draw text
  ctx.fillStyle = color;
  ctx.fillText(label, xPx, yPx);
}

function drawTriangleAtLocation(ctx: CanvasRenderingContext2D, color: string, [xPx, yPx]: Point2, tiltTheta: number) {
  const thetaOffset = Math.PI - Math.PI / 6;
  ctx.beginPath();
  ctx.arc(xPx, yPx, 4, tiltTheta + thetaOffset, tiltTheta - thetaOffset);
  ctx.lineTo(xPx, yPx);
  /*
  ctx.moveTo(xPx, yPx);
  ctx.lineTo(xPx + 10, yPx + 10);
  ctx.lineTo(xPx - 10, yPx + 10);
  ctx.lineTo(xPx - 10, yPx - 10);
   */
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
