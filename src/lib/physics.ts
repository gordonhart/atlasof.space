import { G, SOL } from './constants.ts';
import { degreesToRadians, add3, mul3 } from './formulas.ts';
import { CartesianState, CelestialBody, CelestialBodyState, KeplerianElements, Point3 } from './types.ts';
import { pick } from 'ramda';

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
  const positionInertial: Point3 = rotationMatrix.map(row => row[0] * positionOrbital[0] + row[1] * positionOrbital[1]);
  const velocityInertial: Point3 = rotationMatrix.map(row => row[0] * velocityOrbital[0] + row[1] * velocityOrbital[1]);

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

export function getInitialState(parentState: CelestialBodyState | null, child: CelestialBody): CelestialBodyState {
  let childCartesian = { position: [0, 0, 0], velocity: [0, 0, 0] };
  if (parentState != null) {
    const { position, velocity } = keplerianToCartesian(child, G * parentState.mass);
    childCartesian = { position: add3(parentState.position, position), velocity: add3(parentState.velocity, velocity) };
  }
  const childState: CelestialBodyState = { ...child, ...childCartesian, satellites: [] }; // satellites to be replaced
  const satellites = child.satellites.map(grandchild => getInitialState(childState, grandchild));
  return { ...childState, satellites };
}

export function resetState() {
  STATE = getInitialState(null, SOL);
}

/*
function incrementBody(
  name: Exclude<CelestialBodyName, 'sol'>,
  state: CartesianState,
  mu: number,
  dt: number
): CartesianState {
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
 */

/*
// TODO: this multi-step implementation doesn't really work for the tight orbits of many moons. basically unusable
//  currently, need to debug.
//    - Hypothesis: if the moon is broken into N steps, but the planet is not, then the two will diverge (!!!)
function incrementMoon(
  parentName: Exclude<CelestialBodyName, 'sol'>,
  parentState: CartesianState,
  moonName: string,
  moonState: CartesianState,
  dt: number
): CartesianState {
  const maxSafeDt = ORBITAL_PERIOD_MOONS[parentName][moonName] / MIN_STEPS_PER_PERIOD;
  // console.log(`orbital period of ${moonName} is ${ORBITAL_PERIOD_MOONS[parentName][moonName]}`);
  if (dt > maxSafeDt) {
    const nIterations = Math.ceil(dt / maxSafeDt);
    const safeDt = dt / nIterations;
    // console.log(`modeling ${moonName} in ${nIterations}`);
    return Array(nIterations)
      .fill(null)
      .reduce<{ parentState: CartesianState; moonState: CartesianState }>(
        acc => {
          const nextParentState = incrementBody(parentName, acc.parentState, MU_SOL, safeDt);
          return {
            parentState: nextParentState,
            moonState: incrementMoon(parentName, nextParentState, moonName, acc.moonState, safeDt),
          };
        },
        { parentState, moonState }
      ).moonState;
  }
  const accelerationSun = computeAcceleration(moonState.position, G * ELEMENTS.sol.mass);
  const positionWrtParent = subtract3(moonState.position, STATE[parentName].position);
  const accelerationParent = computeAcceleration(positionWrtParent, G * ELEMENTS[parentName].mass);
  return applyAcceleration(moonState, add3(accelerationParent, accelerationSun), dt);
}
 */

export function incrementState(state: CelestialBodyState, dt: number): CelestialBodyState {
  // compute acceleration for leaf nodes first, apply acceleration from all parents
  // compute acceleration for inner nodes, apply acceleration from all parent
  // return root with updated children
  function incrementStateInner(parent: CelestialBodyState | null, child: CelestialBodyState): CelestialBodyState {
    const satellites = child.satellites.map(grandchild => incrementStateInner(child, grandchild));
    let newState = pick(['position', 'velocity'], child);
    if (parent != null) {
      newState = applyAcceleration(child, computeAcceleration(child.position, parent.mass * G), dt);
    }
    return { ...child, ...newState, satellites };
  }

  return incrementStateInner(null, state);
}
