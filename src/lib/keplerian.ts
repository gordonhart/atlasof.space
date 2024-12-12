import {CelestialObject, DT, G, MASSES} from "./constants.ts";

export type KeplerianElements = {
  eccentricity: number; // ratio
  semiMajorAxis: number; // meters
  inclination: number; // degrees
  longitudeAscending: number; // degrees
  argumentOfPeriapsis: number; // degrees
  trueAnomaly: number; // degrees
};
export type CartesianState = {
  position: [number, number, number]; // meters
  velocity: [number, number, number]; // meters per second
};

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
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
  const cosO = Math.cos(Omega), sinO = Math.sin(Omega);
  const cosI = Math.cos(i), sinI = Math.sin(i);
  const cosW = Math.cos(omega), sinW = Math.sin(omega);

  // Combined rotation matrix to transform from orbital plane to inertial frame
  const rotationMatrix = [
    [cosO * cosW - sinO * sinW * cosI, -cosO * sinW - sinO * cosW * cosI, sinO * sinI],
    [sinO * cosW + cosO * sinW * cosI, -sinO * sinW + cosO * cosW * cosI, -cosO * sinI],
    [sinW * sinI, cosW * sinI, cosI],
  ];

  // Transform position and velocity to inertial frame
  const positionInertial = rotationMatrix.map((row) =>
    row[0] * positionOrbital[0] + row[1] * positionOrbital[1]
  ) as [number, number, number];

  const velocityInertial = rotationMatrix.map((row) =>
    row[0] * velocityOrbital[0] + row[1] * velocityOrbital[1]
  ) as [number, number, number];

  return {
    position: positionInertial,
    velocity: velocityInertial,
  };
}

function computeAcceleration(
  position: [number, number, number],
  mu: number
): [number, number, number] {
  const r = Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2);
  const factor = -mu / (r ** 3);
  return [factor * position[0], factor * position[1], factor * position[2]];
}

function updateState(
  state: CartesianState,
  acceleration: [number, number, number],
  dt: number
): CartesianState {
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

/*
const MERCURY_ELEMENTS: KeplerianElements = {
  eccentricity: 0.2056,
  semiMajorAxis: 57909000000, // 57.909e9 m
  inclination: 7.004,
  longitudeAscending: 48.33167,
  argumentOfPeriapsis: 29.022,
  trueAnomaly: NaN,
}
 */

const mercuryElements: KeplerianElements = {
  eccentricity: 0.2056,
  semiMajorAxis: 57909050e3, // meters
  inclination: 7.005, // degrees
  longitudeAscending: 48.331, // degrees
  argumentOfPeriapsis: 29.124, // degrees
  trueAnomaly: 0, // degrees
};
const venusElements: KeplerianElements = {
  eccentricity: 0.006772, // Ratio
  semiMajorAxis: 108208000e3, // Meters (1 AU = 149,597,870.7 km)
  inclination: 3.39458, // Degrees
  longitudeAscending: 76.6799, // Degrees
  argumentOfPeriapsis: 54.884, // Degrees
  trueAnomaly: 0, // Degrees (choose initial position as desired)
};
const earthElements: KeplerianElements = {
  eccentricity: 0.0167086, // Ratio
  semiMajorAxis: 149597870.7e3, // Meters (1 AU)
  inclination: 0.00005, // Degrees
  longitudeAscending: -11.26064, // Degrees
  argumentOfPeriapsis: 114.20783, // Degrees
  trueAnomaly: 0, // Degrees (choose initial position as desired)
};
const marsElements: KeplerianElements = {
  eccentricity: 0.0935, // Ratio
  semiMajorAxis: 227939200e3, // Meters
  inclination: 1.850, // Degrees
  longitudeAscending: 49.558, // Degrees
  argumentOfPeriapsis: 286.502, // Degrees
  trueAnomaly: 0, // Degrees (choose initial position as desired)
};
const ceresElements: KeplerianElements = {
  eccentricity: 0.075823, // Ratio
  semiMajorAxis: 413690250e3, // Meters
  inclination: 10.594, // Degrees
  longitudeAscending: 80.305, // Degrees
  argumentOfPeriapsis: 73.597, // Degrees
  trueAnomaly: 0, // Degrees
};
export const jupiterElements: KeplerianElements = {
  eccentricity: 0.0489, // Ratio
  semiMajorAxis: 778340821e3, // Meters
  inclination: 1.305, // Degrees
  longitudeAscending: 100.556, // Degrees
  argumentOfPeriapsis: 14.753, // Degrees
  trueAnomaly: 0, // Degrees
};
const saturnElements: KeplerianElements = {
  eccentricity: 0.0565, // Ratio
  semiMajorAxis: 1433449370e3, // Meters
  inclination: 2.485, // Degrees
  longitudeAscending: 113.715, // Degrees
  argumentOfPeriapsis: 92.431, // Degrees
  trueAnomaly: 0, // Degrees
};
const uranusElements: KeplerianElements = {
  eccentricity: 0.0457, // Ratio
  semiMajorAxis: 2876679082e3, // Meters
  inclination: 0.772, // Degrees
  longitudeAscending: 74.006, // Degrees
  argumentOfPeriapsis: 170.964, // Degrees
  trueAnomaly: 0, // Degrees
};
const neptuneElements: KeplerianElements = {
  eccentricity: 0.0086, // Ratio
  semiMajorAxis: 4503443661e3, // Meters
  inclination: 1.770, // Degrees
  longitudeAscending: 131.784, // Degrees
  argumentOfPeriapsis: 44.971, // Degrees
  trueAnomaly: 0, // Degrees
};
export const plutoElements: KeplerianElements = {
  eccentricity: 0.2488, // Ratio
  semiMajorAxis: 5906440628e3, // Meters
  inclination: 17.16, // Degrees
  longitudeAscending: 110.299, // Degrees
  argumentOfPeriapsis: 113.834, // Degrees
  trueAnomaly: 0, // Degrees
};

const muSun = MASSES['sol'] * G;
// 1.32712440018e20; // m^3/s^2, gravitational parameter for the Sun

// TODO: this is a pretty inelegant way to manage celestial state
export const STATE: Record<Exclude<CelestialObject, 'sol'>, CartesianState> = {
  mercury: keplerianToCartesian(mercuryElements, muSun),
  venus: keplerianToCartesian(venusElements, muSun),
  earth: keplerianToCartesian(earthElements, muSun),
  mars: keplerianToCartesian(marsElements, muSun),
  ceres: keplerianToCartesian(ceresElements, muSun),
  jupiter: keplerianToCartesian(jupiterElements, muSun),
  saturn: keplerianToCartesian(saturnElements, muSun),
  uranus: keplerianToCartesian(uranusElements, muSun),
  neptune: keplerianToCartesian(neptuneElements, muSun),
  pluto: keplerianToCartesian(plutoElements, muSun),
}

export function resetState() {
  STATE.mercury = keplerianToCartesian(mercuryElements, muSun);
  STATE.venus = keplerianToCartesian(venusElements, muSun);
  STATE.earth = keplerianToCartesian(earthElements, muSun);
  STATE.mars = keplerianToCartesian(marsElements, muSun);
  STATE.ceres = keplerianToCartesian(ceresElements, muSun);
  STATE.jupiter = keplerianToCartesian(jupiterElements, muSun);
  STATE.saturn = keplerianToCartesian(saturnElements, muSun);
  STATE.uranus = keplerianToCartesian(uranusElements, muSun);
  STATE.neptune = keplerianToCartesian(neptuneElements, muSun);
  STATE.pluto = keplerianToCartesian(plutoElements, muSun);
}

export function incrementBodiesKeplerian(dt: number = DT) {
  STATE.mercury = updateState(STATE.mercury, computeAcceleration(STATE.mercury.position, muSun), dt);
  STATE.venus = updateState(STATE.venus, computeAcceleration(STATE.venus.position, muSun), dt);
  STATE.earth = updateState(STATE.earth, computeAcceleration(STATE.earth.position, muSun), dt);
  STATE.mars = updateState(STATE.mars, computeAcceleration(STATE.mars.position, muSun), dt);
  STATE.ceres = updateState(STATE.ceres, computeAcceleration(STATE.ceres.position, muSun), dt);
  STATE.jupiter = updateState(STATE.jupiter, computeAcceleration(STATE.jupiter.position, muSun), dt);
  STATE.saturn = updateState(STATE.saturn, computeAcceleration(STATE.saturn.position, muSun), dt);
  STATE.uranus = updateState(STATE.uranus, computeAcceleration(STATE.uranus.position, muSun), dt);
  STATE.neptune = updateState(STATE.neptune, computeAcceleration(STATE.neptune.position, muSun), dt);
  STATE.pluto = updateState(STATE.pluto, computeAcceleration(STATE.pluto.position, muSun), dt);
}
