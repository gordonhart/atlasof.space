import { CelestialBodyState } from './types.ts';
import { AppState } from './state.ts';
import { findCelestialBody, ORBITS } from './constants.ts';

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
    ORBITS[hoverBody.name].forEach(cartesian => drawBody({ ...hoverBody, ...cartesian, name: '', satellites: [] }));
  }

  /* TODO: debugging calculated orbital ellipse versus simulated ellipse; the two don't line up perfectly
  const mercury = systemState.satellites[3];
  ctx.beginPath();
  const orbitCenter = mercury.semiMajorAxis * mercury.eccentricity;
  const omega = degreesToRadians(-90 - mercury.argumentOfPeriapsis);
  // const orbitCenterXm = orbitCenter * Math.cos(degreesToRadians(mercury.argumentOfPeriapsis));
  // const orbitCenterYm = orbitCenter * Math.sin(degreesToRadians(mercury.argumentOfPeriapsis));
  const orbitCenterXm = orbitCenter * Math.cos(omega);
  const orbitCenterYm = orbitCenter * Math.sin(omega);
  // console.log(orbitCenter / metersPerPx, orbitCenterXm / metersPerPx, orbitCenterYm / metersPerPx);
  // const [actualCenterXpx, actualCenterYpx] = [-3, -14];
  ctx.ellipse(
    canvasWidthPx / 2 + (offsetXm + orbitCenterXm) / metersPerPx,
    canvasHeightPx / 2 + (offsetYm + orbitCenterYm) / metersPerPx,
    mercury.semiMajorAxis / metersPerPx,
    semiMinorAxis(mercury.semiMajorAxis, mercury.eccentricity) / metersPerPx,
    degreesToRadians(mercury.argumentOfPeriapsis),
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 1;
  ctx.stroke();
   */

  drawBody(systemState);
}
