import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody } from './constants.ts';
import { degreesToRadians, orbitalEllipseAtTheta, semiMinorAxis } from './physics.ts';
import { projectOrbitalEllipseOntoEcliptic } from '../hooks/useDragController.ts';

export function drawBodies(ctx: CanvasRenderingContext2D, appState: AppState, systemState: CelestialBodyState) {
  const {
    drawTail,
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

  function drawBody({ name, position, radius, color, satellites, type }: CelestialBodyState) {
    satellites.forEach(drawBody);
    if (!visibleTypes.has(type)) {
      return;
    }
    const [positionXm, positionYm] = [position[0] + offsetXm, position[1] + offsetYm];
    const positionXpx = canvasWidthPx / 2 + positionXm / metersPerPx;
    const positionYpx = canvasHeightPx / 2 + positionYm / metersPerPx;
    const radiusPx = Math.max((radius / metersPerPx) * planetScaleFactor, 1);
    const radiusScaledPx = name === hover ? radiusPx * 5 : radiusPx;
    ctx.beginPath();
    ctx.arc(positionXpx, positionYpx, radiusScaledPx, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  const hoverBody = hover != null ? findCelestialBody(systemState, hover) : undefined;
  if (hoverBody != null) {
    drawOrbitalEllipse(ctx, hoverBody, [canvasWidthPx, canvasHeightPx], [offsetXm, offsetYm], metersPerPx);
  }

  const mercury = systemState.satellites[0];
  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  const { semiMajorAxis: a, semiMinorAxis: b, tilt: tiltDeg } = projectOrbitalEllipseOntoEcliptic(mercury);
  const tilt = degreesToRadians(tiltDeg);
  // use the 3D ellipse's center as the 2D ellipse won't have the same foci
  const mercurySemiMinorAxis = semiMinorAxis(mercury.semiMajorAxis, mercury.eccentricity);
  const focusOffsetM = Math.sqrt(mercury.semiMajorAxis ** 2 - mercurySemiMinorAxis ** 2);
  // const focusOffsetM = Math.sqrt(a ** 2 - b ** 2);
  const focusOffsetXm = -focusOffsetM * Math.cos(tilt);
  const focusOffsetYm = -focusOffsetM * Math.sin(tilt);
  // console.log(focusOffsetM / metersPerPx);
  ctx.ellipse(
    canvasWidthPx / 2 + offsetXm / metersPerPx + focusOffsetXm / metersPerPx,
    canvasHeightPx / 2 + offsetYm / metersPerPx + focusOffsetYm / metersPerPx,
    a / metersPerPx,
    b / metersPerPx,
    tilt,
    0,
    2 * Math.PI
  );
  ctx.stroke();
  drawBody(systemState);
}

function drawOrbitalEllipse(
  ctx: CanvasRenderingContext2D,
  body: CelestialBodyState,
  [canvasWidthPx, canvasHeightPx]: [number, number],
  [offsetXm, offsetYm]: [number, number],
  metersPerPx: number
) {
  const steps = 360; // number of segments to approximate the ellipse
  for (let step = 0; step <= steps; step++) {
    const theta = (step / steps) * 2 * Math.PI;
    const [xM, yM] = orbitalEllipseAtTheta(body, theta);
    const xPx = canvasWidthPx / 2 + (xM + offsetXm) / metersPerPx;
    const yPx = canvasHeightPx / 2 + (yM + offsetYm) / metersPerPx;
    if (step === 0) {
      ctx.moveTo(xPx, yPx);
    } else {
      ctx.lineTo(xPx, yPx);
    }
  }
  ctx.strokeStyle = body.color;
  ctx.lineWidth = 1;
  ctx.stroke();
}
