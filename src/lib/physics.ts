import { ELEMENTS, MU_SUN, ORBITAL_PERIODS } from './constants.ts';
import { filterKeys, mapValues } from './utils.ts';
import { degreesToRadians } from './formulas.ts';
import { CartesianState, CelestialObject, KeplerianElements } from './types.ts';

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
  const cosO = Math.cos(Omega),
    sinO = Math.sin(Omega);
  const cosI = Math.cos(i),
    sinI = Math.sin(i);
  const cosW = Math.cos(omega),
    sinW = Math.sin(omega);

  // Combined rotation matrix to transform from orbital plane to inertial frame
  const rotationMatrix = [
    [cosO * cosW - sinO * sinW * cosI, -cosO * sinW - sinO * cosW * cosI, sinO * sinI],
    [sinO * cosW + cosO * sinW * cosI, -sinO * sinW + cosO * cosW * cosI, -cosO * sinI],
    [sinW * sinI, cosW * sinI, cosI],
  ];

  // Transform position and velocity to inertial frame
  const positionInertial = rotationMatrix.map(row => row[0] * positionOrbital[0] + row[1] * positionOrbital[1]) as [
    number,
    number,
    number,
  ];

  const velocityInertial = rotationMatrix.map(row => row[0] * velocityOrbital[0] + row[1] * velocityOrbital[1]) as [
    number,
    number,
    number,
  ];

  return {
    position: positionInertial,
    velocity: velocityInertial,
  };
}

function computeAcceleration(position: [number, number, number], mu: number): [number, number, number] {
  const r = Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2);
  const factor = -mu / r ** 3;
  return [factor * position[0], factor * position[1], factor * position[2]];
}

function updateState(state: CartesianState, acceleration: [number, number, number], dt: number): CartesianState {
  const newVelocity: [number, number, number] = [
    state.velocity[0] + acceleration[0] * dt,
    state.velocity[1] + acceleration[1] * dt,
    state.velocity[2] + acceleration[2] * dt,
  ];

  const newPosition: [number, number, number] = [
    state.position[0] + newVelocity[0] * dt,
    state.position[1] + newVelocity[1] * dt,
    state.position[2] + newVelocity[2] * dt,
  ];

  return {
    position: newPosition,
    velocity: newVelocity,
  };
}

export const STATE: Record<Exclude<CelestialObject, 'sol'>, CartesianState> = mapValues(
  filterKeys(ELEMENTS, (k: CelestialObject) => k !== 'sol'),
  (e: KeplerianElements) => keplerianToCartesian(e, MU_SUN)
);

export function resetState() {
  Object.keys(STATE).forEach(name => {
    STATE[name] = keplerianToCartesian(ELEMENTS[name], MU_SUN);
  });
}

function incrementBody(name: Exclude<CelestialObject, 'sol'>, body: CartesianState, mu: number, dt: number) {
  const maxSafeDt = ORBITAL_PERIODS[name] / 52;
  if (dt > maxSafeDt) {
    // subdivide dt into at least 52 steps per orbit to ensure stability at fast simulation speeds
    const nIterations = Math.ceil(dt / maxSafeDt);
    return Array(nIterations)
      .fill(null)
      .reduce(acc => incrementBody(name, acc, mu, dt / nIterations), body);
  }
  return updateState(body, computeAcceleration(body.position, mu), dt);
}

export function incrementBodiesKeplerian(dt: number) {
  Object.keys(STATE).forEach(name => {
    STATE[name] = incrementBody(name, STATE[name], MU_SUN, dt);
  });
}
