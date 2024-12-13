import { ELEMENTS, G, MIN_STEPS_PER_PERIOD, MU_SOL, ORBITAL_PERIOD_MOONS, ORBITAL_PERIODS } from './constants.ts';
import { subtract3, degreesToRadians, add3, mul3 } from './formulas.ts';
import { CartesianState, CelestialBody, CelestialBodyName, KeplerianElements, Point3 } from './types.ts';
import { keys, map, mapObjIndexed, omit, toPairs } from 'ramda';

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
  const rotationMatrix = [
    [cosO * cosW - sinO * sinW * cosI, -cosO * sinW - sinO * cosW * cosI, sinO * sinI],
    [sinO * cosW + cosO * sinW * cosI, -sinO * sinW + cosO * cosW * cosI, -cosO * sinI],
    [sinW * sinI, cosW * sinI, cosI],
  ];

  // Transform position and velocity to inertial frame
  const positionInertial = rotationMatrix.map(
    row => row[0] * positionOrbital[0] + row[1] * positionOrbital[1]
  ) as Point3;
  const velocityInertial = rotationMatrix.map(
    row => row[0] * velocityOrbital[0] + row[1] * velocityOrbital[1]
  ) as Point3;

  return {
    position: positionInertial,
    velocity: velocityInertial,
  };
}

function computeAcceleration(
  position: Point3, // WRT center of mass of the object we are orbiting around
  mu: number
): Point3 {
  const r = Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2);
  return mul3(-mu / r ** 3, position);
}

function applyAcceleration(state: CartesianState, acceleration: Point3, dt: number): CartesianState {
  const newVelocity = add3(state.velocity, mul3(dt, acceleration));
  const newPosition = add3(state.position, mul3(dt, newVelocity));
  return { position: newPosition, velocity: newVelocity };
}

export const STATE: Record<Exclude<CelestialBodyName, 'sol'>, CartesianState> = map(
  (e: KeplerianElements) => keplerianToCartesian(e, MU_SOL),
  omit(['sol'], ELEMENTS)
);

function getInitialMoonsState() {
  return mapObjIndexed(
    (parentBody: CelestialBody, parentName: Omit<CelestialBodyName, 'sol'>) => {
      const parentCartesian = keplerianToCartesian(parentBody, G * ELEMENTS.sol.mass);
      return map((moonBody: CelestialBody) => {
        const moonCartesian = keplerianToCartesian(moonBody, G * ELEMENTS[parentName].mass);
        return {
          position: add3(moonCartesian.position, parentCartesian.position),
          velocity: add3(moonCartesian.velocity, parentCartesian.velocity),
        };
      }, parentBody.moons ?? {});
    },
    omit(['sol'], ELEMENTS)
  );
}

export const STATE_MOONS: { [body: string]: { [moon: string]: CartesianState } } = getInitialMoonsState();

export function resetState() {
  keys(STATE).forEach(name => {
    STATE[name] = keplerianToCartesian(ELEMENTS[name], MU_SOL);
  });
  toPairs(getInitialMoonsState()).forEach(([name, moonState]) => {
    STATE_MOONS[name] = moonState;
  });
}

function incrementBody(name: Exclude<CelestialBodyName, 'sol'>, state: CartesianState, mu: number, dt: number) {
  const maxSafeDt = ORBITAL_PERIODS[name] / MIN_STEPS_PER_PERIOD;
  if (dt > maxSafeDt) {
    // subdivide dt into at least MIN_STEPS_PER_PERIOD steps per orbit to ensure stability at fast simulation speeds
    const nIterations = Math.ceil(dt / maxSafeDt);
    return Array(nIterations)
      .fill(null)
      .reduce<CartesianState>(acc => incrementBody(name, acc, mu, dt / nIterations), state);
  }
  return applyAcceleration(state, computeAcceleration(state.position, mu), dt);
}

// TODO: this multi-step implementation doesn't really work for the tight orbits of many moons. basically unusable
//  currently, need to debug
function incrementMoon(
  parentName: Exclude<CelestialBodyName, 'sol'>,
  parentState: CartesianState,
  moonName: string,
  moonState: CartesianState,
  dt: number
) {
  const maxSafeDt = ORBITAL_PERIOD_MOONS[parentName][moonName] / MIN_STEPS_PER_PERIOD;
  if (dt > maxSafeDt) {
    const nIterations = Math.ceil(dt / maxSafeDt);
    return Array(nIterations)
      .fill(null)
      .reduce<{ parentState: CartesianState; moonState: CartesianState }>(
        acc => ({
          parentState: incrementBody(parentName, acc.parentState, MU_SOL, dt / nIterations),
          moonState: incrementMoon(parentName, acc.parentState, moonName, acc.moonState, dt / nIterations),
        }),
        { parentState, moonState }
      ).moonState;
  }
  const accelerationSun = computeAcceleration(moonState.position, G * ELEMENTS.sol.mass);
  const positionWrtParent = subtract3(moonState.position, STATE[parentName].position);
  const accelerationParent = computeAcceleration(positionWrtParent, G * ELEMENTS[parentName].mass);
  return applyAcceleration(moonState, add3(accelerationParent, accelerationSun), dt);
}

export function incrementBodies(dt: number) {
  keys(STATE).forEach(name => {
    // important that the moons come first as they depend on the position of the parent planet
    Object.entries(STATE_MOONS[name] ?? {}).forEach(([moonName, moonState]) => {
      STATE_MOONS[name][moonName] = incrementMoon(name, STATE[name], moonName, moonState, dt);
    });
    STATE[name] = incrementBody(name, STATE[name], MU_SOL, dt);
  });
}
