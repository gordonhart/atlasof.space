import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody } from './constants.ts';
import { degreesToRadians, ellipseAtTheta, semiMinorAxis } from './physics.ts';

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
    drawOrbitalEllipse(ctx, hoverBody, [canvasWidthPx, canvasHeightPx], metersPerPx);
  }

  drawBody(systemState);
}

function drawOrbitalEllipse(
  ctx: CanvasRenderingContext2D,
  body: CelestialBodyState,
  canvasDimensions: [number, number],
  metersPerPx: number
) {
  const [canvasWidthPx, canvasHeightPx] = canvasDimensions;
  const a = body.semiMajorAxis;
  const e = body.eccentricity;
  const b = semiMinorAxis(a, e);
  const omega = -degreesToRadians(body.argumentOfPeriapsis);
  const Omega = -degreesToRadians(body.longitudeAscending);
  const i = degreesToRadians(body.inclination);
  const steps = 360; // number of segments to approximate the ellipse
  for (let step = 0; step <= steps; step++) {
    const theta = (step / steps) * 2 * Math.PI;
    // const [x, y] = ellipseAtTheta(body, theta);

    // Parametric form in orbital plane before rotation:
    // Periapsis initially along x'-axis
    const x_o = a * (Math.cos(theta) - e);
    const y_o = b * Math.sin(theta);
    const z_o = 0;

    // 1) Rotate by ω around z-axis (argument of periapsis):
    const X = x_o * Math.cos(omega) - y_o * Math.sin(omega);
    let Y = x_o * Math.sin(omega) + y_o * Math.cos(omega);
    let Z = z_o; // still zero

    // 2) Rotate by i around x-axis (inclination):
    // Rotation around x:
    // Y' = Y*cos(i) - Z*sin(i)
    // Z' = Y*sin(i) + Z*cos(i)
    // Since Z=0 initially:
    Y = Y * Math.cos(i);
    Z = Y * Math.sin(i);

    // 3) Rotate by Ω around z-axis (longitude of ascending node):
    // X'' = X*cos(Ω) - Y*sin(Ω)
    // Y'' = X*sin(Ω) + Y*cos(Ω)
    const X_f = X * Math.cos(Omega) - Y * Math.sin(Omega);
    const Y_f = X * Math.sin(Omega) + Y * Math.cos(Omega);
    const Z_f = Z; // Not used for drawing top-down, but kept for completeness

    // Map to canvas coordinates:
    // Y_f is inverted because canvas Y grows down while our math Y grows up
    const x_canvas = canvasWidthPx / 2 + X_f / metersPerPx;
    const y_canvas = canvasHeightPx / 2 - Y_f / metersPerPx;

    if (step === 0) {
      ctx.moveTo(x_canvas, y_canvas);
    } else {
      ctx.lineTo(x_canvas, y_canvas);
    }
  }

  ctx.strokeStyle = body.color;
  ctx.lineWidth = 1;
  ctx.stroke();
}
