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
function gravitationalAcceleration(position: Point3, mu: number): Point3 {
  const r = magnitude(position);
  return mul3(-mu / r ** 3, position);
}

// TODO: this is a finicky implementation as the position must lie exactly on the ellipse
export function trueAnomalyFromPosition(position: Point3, semiMajorAxis: number, eccentricity: number) {
  const rMag = magnitude(position);
  const cosV = (semiMajorAxis * (1 - eccentricity ** 2)) / (rMag * eccentricity) - 1 / eccentricity;
  return Math.acos(cosV);
}

/*
def true_anomaly_from_mean(M, e, tolerance=1e-8, max_iterations=100):
    """
    Calculate true anomaly from mean anomaly using Newton-Raphson iteration.

    Parameters:
    M (float): Mean anomaly in radians
    e (float): Eccentricity (0 <= e < 1)
    tolerance (float): Convergence tolerance
    max_iterations (int): Maximum number of iterations

    Returns:
    float: True anomaly in radians
    """
    # Normalize mean anomaly to be between 0 and 2π
    M = M % (2 * np.pi)

    # Initial guess (use M as starting value)
    E = M

    # Newton-Raphson iteration to solve Kepler's equation
    for i in range(max_iterations):
        delta = (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
        E = E - delta

        if abs(delta) < tolerance:
            break

    # Calculate true anomaly from eccentric anomaly
    numerator = np.sqrt(1 - e**2) * np.sin(E)
    denominator = 1 - e * np.cos(E)
    true_anomaly = np.arctan2(numerator, cos_E - e)

    # Ensure true anomaly is in the correct quadrant
    if true_anomaly < 0:
        true_anomaly += 2 * np.pi

    return true_anomaly
 */
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

function applyAcceleration(state: CartesianState, acceleration: Point3, dt: number): CartesianState {
  const newVelocity = add3(state.velocity, mul3(dt, acceleration));
  const newPosition = add3(state.position, mul3(dt, newVelocity));
  return { position: newPosition, velocity: newVelocity };
}

function applyRotation({ siderealRotationPeriod, rotation }: CelestialBodyState, dt: number): number {
  return siderealRotationPeriod == null ? rotation : (rotation + (360 * dt) / siderealRotationPeriod) % 360;
}

export function getInitialState(parentState: CelestialBodyState | null, child: CelestialBody): CelestialBodyState {
  let childCartesian: CartesianState = { position: [0, 0, 0], velocity: [0, 0, 0] };
  if (parentState != null) {
    const { position, velocity } = keplerianToCartesian(child.elements, G * parentState.mass);
    childCartesian = { position: add3(parentState.position, position), velocity: add3(parentState.velocity, velocity) };
  }
  const childState: CelestialBodyState = { ...child, ...childCartesian, rotation: 0, satellites: [] }; // satellites to be replaced
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
  const rotation = applyRotation(child, dt);
  return { ...child, ...newState, rotation, satellites };
}

export function incrementState(state: CelestialBodyState, dt: number): CelestialBodyState {
  // TODO: subdividing dt down to 1 hour increments slows down simulation significantly at faster playback speeds.
  //  Potential fix: identify fast-period bodies and subdivide those as necessary, but leave others at the requested dt?
  const maxSafeDt = 3_600; // 1 hour
  const nIterations = Math.ceil(dt / maxSafeDt);
  return Array(nIterations)
    .fill(null)
    .reduce(acc => incrementStateByParents([], acc, dt / nIterations), state);
}
