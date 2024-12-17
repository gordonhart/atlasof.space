import { CelestialBodyState, Point2 } from './types.ts';
import { AppState } from './state.ts';
import { ASTEROID_BELT, findCelestialBody, HELIOSPHERE_TERMINATION_SHOCK, KUIPER_BELT } from './constants.ts';
import { degreesToRadians, orbitalEllipseAtTheta } from './physics.ts';

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail,
    drawOrbit: shouldDrawOrbits,
    metersPerPx,
    center,
    planetScaleFactor,
    offset: [panOffsetXm, panOffsetYm],
    hover,
    visibleTypes,
  } = appState;

  ctx.fillStyle = drawTail ? 'rgba(0, 0, 0, 0.0)' : '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const dpr = window.devicePixelRatio ?? 1;
  const [canvasWidthPx, canvasHeightPx] = [ctx.canvas.width / dpr, ctx.canvas.height / dpr];
  const centerBody = findCelestialBody(systemState, center);
  const [centerOffsetXm, centerOffsetYm] = centerBody?.position ?? [0, 0];
  const [offsetXm, offsetYm] = [panOffsetXm - centerOffsetXm, panOffsetYm - centerOffsetYm];

  function drawBody({
    name,
    position,
    radius,
    color,
    satellites,
    type,
    rotation,
    siderealRotationPeriod,
  }: CelestialBodyState) {
    if (!visibleTypes.has(type)) {
      return;
    }
    satellites.forEach(drawBody);
    const [positionXm, positionYm] = [position[0] + offsetXm, position[1] + offsetYm];
    const positionXpx = canvasWidthPx / 2 + positionXm / metersPerPx;
    const positionYpx = canvasHeightPx / 2 + positionYm / metersPerPx;
    const radiusPx = Math.max((radius / metersPerPx) * planetScaleFactor, 1);
    const radiusScaledPx = name === hover ? radiusPx * 5 : radiusPx;
    ctx.beginPath();
    ctx.arc(positionXpx, positionYpx, radiusScaledPx, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    if (siderealRotationPeriod != null) {
      const rotationOffset = degreesToRadians(rotation);
      ctx.arc(positionXpx, positionYpx, radiusScaledPx, rotationOffset - Math.PI / 32, rotationOffset + Math.PI / 32);
      ctx.lineTo(positionXpx, positionYpx);
      ctx.fillStyle = 'black';
      ctx.fill();
    }
  }

  function drawOrbit(parent: CelestialBodyState | null, body: CelestialBodyState) {
    if (!visibleTypes.has(body.type)) {
      return;
    }
    body.satellites.forEach(child => drawOrbit(body, child));
    const offset: Point2 = [(parent?.position?.[0] ?? 0) + offsetXm, (parent?.position?.[1] ?? 0) + offsetYm];
    drawOrbitalEllipse(ctx, body, [canvasWidthPx, canvasHeightPx], offset, metersPerPx, 0.5);
  }

  [ASTEROID_BELT, KUIPER_BELT, HELIOSPHERE_TERMINATION_SHOCK].forEach(({ min, max }) => {
    drawBelt(ctx, [min, max], [canvasWidthPx, canvasHeightPx], [offsetXm, offsetYm], metersPerPx);
  });

  const hoverBody = hover != null ? findCelestialBody(systemState, hover) : undefined;
  if (hoverBody != null) {
    drawOrbitalEllipse(ctx, hoverBody, [canvasWidthPx, canvasHeightPx], [offsetXm, offsetYm], metersPerPx);
  }

  if (shouldDrawOrbits) {
    drawOrbit(null, systemState);
  }

  drawBody(systemState);
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
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.beginPath();
  ctx.arc(...centerPx, minRad, 0, Math.PI * 2, true);
  ctx.arc(...centerPx, maxRad, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawOrbitalEllipse(
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
