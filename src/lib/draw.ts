import { CelestialBodyState, Point2 } from './types.ts';
import { AppState } from './state.ts';
import { ASTEROID_BELT, findCelestialBody, KUIPER_BELT } from './constants.ts';
import { degreesToRadians, orbitalEllipseAtTheta } from './physics.ts';

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail: shouldDrawTails,
    drawOrbit: shouldDrawOrbits,
    drawLabel: shouldDrawLabels,
    metersPerPx,
    center,
    planetScaleFactor,
    offset: [panOffsetXm, panOffsetYm],
    hover,
    visibleTypes,
  } = appState;

  ctx.fillStyle = shouldDrawTails ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const canvasPx: Point2 = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
  const centerBody = findCelestialBody(systemState, center);
  const [centerOffsetXm, centerOffsetYm] = centerBody?.position ?? [0, 0];
  const [offsetXm, offsetYm] = [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];

  function drawBodyRecursive(body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) {
      return;
    }
    body.satellites.forEach(drawBodyRecursive);
    const radiusScaled = (body.name === hover ? body.radius * 5 : body.radius) * planetScaleFactor;
    const bodyToDraw = { ...body, radius: radiusScaled };
    drawBody(ctx, bodyToDraw, canvasPx, [offsetXm, offsetYm], metersPerPx);
  }

  function drawOrbitRecursive(parent: CelestialBodyState | null, body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) {
      return;
    }
    body.satellites.forEach(child => drawOrbitRecursive(body, child));
    const offset: Point2 = [(parent?.position?.[0] ?? 0) + offsetXm, (parent?.position?.[1] ?? 0) + offsetYm];
    drawOrbit(ctx, body, canvasPx, offset, metersPerPx, 0.5);
  }

  // TODO: why doesn't this position need to be offset by the parent...?
  function drawLabelRecursive(body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) {
      return;
    }
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
  drawBodyRecursive(systemState);
  if (shouldDrawLabels) drawLabelRecursive(systemState);
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
  const { width: textWidthPx, actualBoundingBoxAscent: textHeightPx } = ctx.measureText(name);
  const [offsetXpx, offsetYpx]: Point2 = [textWidthPx / 2, Math.max(radius / metersPerPx, 1) + 10];
  ctx.scale(1, -1); // flip and translate to get text right-side-up
  ctx.translate(0, -window.innerHeight);
  const [bodyXm, bodyYm] = position;
  const bodyXpx = canvasWidthPx / 2 + (bodyXm + offsetXm) / metersPerPx;
  const bodyYpx = window.innerHeight - (canvasHeightPx / 2 + (bodyYm + offsetYm) / metersPerPx);

  // draw background
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.strokeStyle = color;
  const boxPadPx = 4;
  const boxLocationPx: Point2 = [bodyXpx - offsetXpx - boxPadPx, bodyYpx - offsetYpx - textHeightPx - boxPadPx];
  const boxDimensionPx: Point2 = [textWidthPx + boxPadPx * 2, textHeightPx + boxPadPx * 2];
  ctx.roundRect(...boxLocationPx, ...boxDimensionPx, 5);
  ctx.fill();
  ctx.stroke();

  // draw text
  ctx.fillStyle = color;
  ctx.fillText(name, bodyXpx - offsetXpx, bodyYpx - offsetYpx);
  ctx.restore();
}
