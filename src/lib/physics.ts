import { G } from './bodies.ts';
import { CartesianState, CelestialBody, CelestialBodyState, KeplerianElements, Point3 } from './types.ts';

// TODO: use proper vector/matrix library?
export function add3([a1, a2, a3]: Point3, [b1, b2, b3]: Point3): Point3 {
  return [a1 + b1, a2 + b2, a3 + b3];
}

export function subtract3([a1, a2, a3]: Point3, [b1, b2, b3]: Point3): Point3 {
  return [a1 - b1, a2 - b2, a3 - b3];
}

export function mul3(s: number, [a, b, c]: Point3): Point3 {
  return [s * a, s * b, s * c];
}

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
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

// position WRT center of mass of the object we are orbiting around
export function gravitationalAcceleration(position: Point3, mu: number): Point3 {
  const r = magnitude(position);
  return mul3(-mu / r ** 3, position);
}

// TODO: this is a finicky implementation as the position must lie exactly on the ellipse
export function trueAnomalyFromPosition(position: Point3, semiMajorAxis: number, eccentricity: number) {
  const rMag = magnitude(position);
  const cosV = (semiMajorAxis * (1 - eccentricity ** 2)) / (rMag * eccentricity) - 1 / eccentricity;
  return Math.acos(cosV);
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

function keplerianToCartesian(
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

export function getInitialState(bodies: Array<CelestialBody>): Record<string, CelestialBodyState> {
  const initialState: Record<string, CelestialBodyState> = {};
  const toInitialize = [...bodies];
  // note that this will loop indefinitely if there are any cycles in the graph described by body.influencedBy
  while (toInitialize.length > 0) {
    const body = toInitialize.shift()!;
    const parents = body.influencedBy.map(name => initialState[name]);
    if (parents.some(p => p == null)) {
      toInitialize.push(body);
      continue;
    }
    if (parents.length > 0) {
      const mainParentMass = parents.find(({ name }) => name === body.elements.wrt)?.mass ?? 1;
      const cartesian = keplerianToCartesian(body.elements, G * mainParentMass);
      const position = parents.reduce((acc, { position }) => add3(acc, position), cartesian.position);
      const velocity = parents.reduce((acc, { velocity }) => add3(acc, velocity), cartesian.velocity);
      initialState[body.name] = { ...body, rotation: 0, position, velocity };
    } else {
      initialState[body.name] = { ...body, rotation: 0, position: [0, 0, 0], velocity: [0, 0, 0] };
    }
  }
  // reverse creation order; first objects created are the highest up in the hierarchy, render them last (on top)
  return Object.fromEntries(Object.entries(initialState).reverse());
}
