import { CartesianState, Epoch, KeplerianElements, Point3 } from './types.ts';
import { G } from './bodies.ts';
import { epochToDate } from './epoch.ts';

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

export function magnitude(v: Array<number>) {
  return Math.sqrt(v.reduce((acc, x) => acc + x ** 2, 0));
}

// kepler's third law
export function orbitalPeriod(semiMajorAxis: number, centralMass: number) {
  return Math.PI * 2 * Math.sqrt(Math.pow(semiMajorAxis, 3) / (G * centralMass));
}

export function meanDistance(semiMajorAxis: number, eccentricity: number) {
  return semiMajorAxis + (1 + eccentricity ** 2 / 2);
}

export function semiMinorAxis(semiMajorAxis: number, eccentricity: number) {
  return semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
}

export function semiLatusRectum(semiMajorAxis: number, eccentricity: number) {
  return semiMajorAxis * (1 - eccentricity ** 2);
}

export function surfaceGravity(mass: number, radius: number) {
  return (G * mass) / radius ** 2; // m/s^2
}

export function estimateAsteroidMass(radius: number) {
  return 2500 * (4 / 3) * Math.PI * radius ** 3; // best-effort guess using 2500kg/m3 density and a spherical shape
}

export function orbitalEllipseAtTheta(elements: KeplerianElements, theta: number): Point3 {
  const { semiMajorAxis: a, eccentricity: e, inclination, argumentOfPeriapsis, longitudeAscending } = elements;

  const i = degreesToRadians(inclination);
  const omega = degreesToRadians(argumentOfPeriapsis);
  const Omega = degreesToRadians(longitudeAscending);

  // Parametric form in orbital plane before rotation:
  // Periapsis initially along x'-axis
  const x_o = a * (Math.cos(theta) - e);
  const y_o = semiMinorAxis(a, e) * Math.sin(theta);
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
  return [X_f, Y_f, Z_f];
}

export function trueAnomalyFromMean(meanAnomaly: number, eccentricity: number, tolerance = 1e-8, maxIterations = 100) {
  const meanAnomalyNormalized = meanAnomaly % (2 * Math.PI);

  // Newton-Raphson iteration to solve Kepler's equation
  let eccentricAnomaly = meanAnomalyNormalized;
  for (let i = 0; i < maxIterations; i++) {
    const delta =
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomalyNormalized) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
    eccentricAnomaly = eccentricAnomaly - delta;
    if (Math.abs(delta) < tolerance) {
      break;
    }
  }

  // Calculate true anomaly from eccentric anomaly
  const numerator = Math.sqrt(1 - eccentricity ** 2) * Math.sin(eccentricAnomaly);
  const trueAnomaly = Math.atan2(numerator, Math.cos(eccentricAnomaly) - eccentricity);

  // Ensure true anomaly is in the correct quadrant
  return trueAnomaly < 0 ? trueAnomaly + 2 * Math.PI : trueAnomaly;
}

export function keplerianToCartesian(
  {
    eccentricity: e,
    semiMajorAxis: a,
    inclination,
    longitudeAscending,
    argumentOfPeriapsis,
    meanAnomaly,
  }: KeplerianElements,
  mu: number // Gravitational parameter (m^3/s^2)
): CartesianState {
  const i = degreesToRadians(inclination);
  const Omega = degreesToRadians(longitudeAscending);
  const omega = degreesToRadians(argumentOfPeriapsis);
  const nu = trueAnomalyFromMean(degreesToRadians(meanAnomaly), e);

  // Orbital plane position (r) and velocity (v)
  const p = semiLatusRectum(a, e);
  const rOrbital = p / (1 + e * Math.cos(nu));
  const positionOrbital = [rOrbital * Math.cos(nu), rOrbital * Math.sin(nu)];
  const velocityOrbital = [-Math.sqrt(mu / p) * Math.sin(nu), Math.sqrt(mu / p) * (e + Math.cos(nu))];

  // Rotations
  const [cosO, sinO] = [Math.cos(Omega), Math.sin(Omega)];
  const [cosI, sinI] = [Math.cos(i), Math.sin(i)];
  const [cosW, sinW] = [Math.cos(omega), Math.sin(omega)];

  // Combined rotation matrix to transform from orbital plane to inertial frame
  const rotationMatrix: [Point3, Point3, Point3] = [
    [cosO * cosW - sinO * sinW * cosI, -cosO * sinW - sinO * cosW * cosI, sinO * sinI],
    [sinO * cosW + cosO * sinW * cosI, -sinO * sinW + cosO * cosW * cosI, -cosO * sinI],
    [sinW * sinI, cosW * sinI, cosI],
  ];

  // Transform position and velocity to inertial frame
  const positionInertial: Point3 = rotationMatrix.map(
    row => row[0] * positionOrbital[0] + row[1] * positionOrbital[1]
  ) as Point3;
  const velocityInertial: Point3 = rotationMatrix.map(
    row => row[0] * velocityOrbital[0] + row[1] * velocityOrbital[1]
  ) as Point3;

  return { position: positionInertial, velocity: velocityInertial };
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360; // Normalize degrees to [0, 360)
}

export function convertToEpoch(elements: KeplerianElements, parentMass: number, epoch: Epoch) {
  const { semiMajorAxis: a, longitudeAscending: Omega, argumentOfPeriapsis: omega } = elements;
  const dt = (Number(epochToDate(epoch)) - Number(epochToDate(elements.epoch))) / 1000; // dt in seconds
  const n = Math.sqrt((G * parentMass) / a / a / a); // calculate mean motion
  const newM = elements.meanAnomaly + radiansToDegrees(n * dt); // update mean anomaly
  const newOmega = Omega + dt * (elements.nodalPrecession ?? 0);
  if (newOmega !== Omega) {
    console.log(`old Omega: ${Omega}, new Omega: ${newOmega}, precession: ${elements.nodalPrecession}`);
  }
  return {
    ...elements,
    epoch,
    meanAnomaly: normalizeDegrees(newM),
    longitudeAscending: normalizeDegrees(newOmega),
    argumentOfPeriapsis: normalizeDegrees(omega + dt * (elements.apsidalPrecession ?? 0)),
  };
}
