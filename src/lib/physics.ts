import { G } from './constants.ts';
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

// position WRT center of mass of the object we are orbiting around
function gravitationalAcceleration(position: Point3, mu: number): Point3 {
  const r = magnitude(position);
  return mul3(-mu / r ** 3, position);
}

function keplerianToCartesian(
  elements: KeplerianElements,
  mu: number // Gravitational parameter (m^3/s^2)
): CartesianState {
  const {
    eccentricity: e,
    semiMajorAxis: a,
    inclination,
    longitudeAscending,
    argumentOfPeriapsis,
    trueAnomaly,
  } = elements;

  const i = degreesToRadians(inclination);
  const Omega = degreesToRadians(longitudeAscending);
  const omega = degreesToRadians(argumentOfPeriapsis);
  const nu = degreesToRadians(trueAnomaly);

  // Semi-latus rectum (p)
  const p = a * (1 - e * e);

  // Orbital plane position (r) and velocity (v)
  const rOrbital = p / (1 + e * Math.cos(nu));
  const positionOrbital = [rOrbital * Math.cos(nu), rOrbital * Math.sin(nu)];
  const velocityOrbital = [-Math.sqrt(mu / p) * Math.sin(nu), Math.sqrt(mu / p) * (e + Math.cos(nu))];

  // Rotation matrices
  const cosO = Math.cos(Omega);
  const sinO = Math.sin(Omega);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  const cosW = Math.cos(omega);
  const sinW = Math.sin(omega);

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

function applyAcceleration(state: CartesianState, acceleration: Point3, dt: number): CartesianState {
  const newVelocity = add3(state.velocity, mul3(dt, acceleration));
  const newPosition = add3(state.position, mul3(dt, newVelocity));
  return { position: newPosition, velocity: newVelocity };
}

export function getInitialState(parentState: CelestialBodyState | null, child: CelestialBody): CelestialBodyState {
  let childCartesian: CartesianState = { position: [0, 0, 0], velocity: [0, 0, 0] };
  if (parentState != null) {
    const { position, velocity } = keplerianToCartesian(child, G * parentState.mass);
    childCartesian = { position: add3(parentState.position, position), velocity: add3(parentState.velocity, velocity) };
  }
  const childState: CelestialBodyState = { ...child, ...childCartesian, satellites: [] }; // satellites to be replaced
  const satellites = child.satellites.map(grandchild => getInitialState(childState, grandchild));
  return { ...childState, satellites };
}

function incrementStateByParents(
  parents: Array<CelestialBodyState>,
  child: CelestialBodyState,
  dt: number
): CelestialBodyState {
  const satellites = child.satellites.map(grandchild => incrementStateByParents([child, ...parents], grandchild, dt));
  const acceleration = parents.reduce<Point3>(
    (acc, parent) => add3(acc, gravitationalAcceleration(subtract3(child.position, parent.position), G * parent.mass)),
    [0, 0, 0] as Point3
  );
  const newState = applyAcceleration(child, acceleration, dt);
  return { ...child, ...newState, satellites };
}

export function incrementState(state: CelestialBodyState, dt: number): CelestialBodyState {
  // TODO: subdividing dt down to 1 hour increments slows down simulation significantly at faster playback speeds
  const maxSafeDt = 3_600; // 1 hour
  const nIterations = Math.ceil(dt / maxSafeDt);
  return Array(nIterations)
    .fill(null)
    .reduce(acc => incrementStateByParents([], acc, dt / nIterations), state);
}
