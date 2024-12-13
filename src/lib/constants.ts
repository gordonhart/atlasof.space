import { orbitalPeriod } from './formulas.ts';
import { CelestialBody } from './types.ts';

export const G = 6.6743e-11; // gravitational constant, N⋅m2⋅kg−2
export const DT = 60 * 60 * 6; // time step -- 6 hours
export const AU = 1.496e11; // meters

export const SOL: CelestialBody = {
  name: 'Sol',
  eccentricity: 0,
  semiMajorAxis: 0,
  inclination: 0,
  longitudeAscending: 0,
  argumentOfPeriapsis: 0,
  trueAnomaly: 0,
  mass: 1.9885e30,
  radius: 6.957e8,
  color: '#fa0',
  satellites: [
    {
      name: 'Mercury',
      eccentricity: 0.2056,
      semiMajorAxis: 57909050e3, // meters
      inclination: 7.005, // degrees
      longitudeAscending: 48.331, // degrees
      argumentOfPeriapsis: 29.124, // degrees
      trueAnomaly: 0, // degrees (choose initial position as desired)
      mass: 3.3011e23,
      radius: 2439.7e3,
      color: '#888',
      satellites: [],
    },
    {
      name: 'Venus',
      eccentricity: 0.006772,
      semiMajorAxis: 108208000e3,
      inclination: 3.39458,
      longitudeAscending: 76.6799,
      argumentOfPeriapsis: 54.884,
      trueAnomaly: 0, // starting at periapsis // TODO: set real values
      mass: 4.8675e24,
      radius: 6051.8e3,
      color: '#fe8',
      satellites: [],
    },
    {
      name: 'Earth',
      eccentricity: 0.0167086,
      semiMajorAxis: 149597870.7e3, // 1 AU
      inclination: 0.00005,
      longitudeAscending: -11.26064,
      argumentOfPeriapsis: 114.20783,
      trueAnomaly: 0,
      mass: 5.972168e24,
      radius: 6371e3,
      color: '#3fb',
      satellites: [
        {
          name: 'Luna',
          eccentricity: 0.0549,
          semiMajorAxis: 384400e3,
          inclination: 5.145,
          longitudeAscending: 125.08,
          argumentOfPeriapsis: 318.15,
          trueAnomaly: 0,
          mass: 7.342e22,
          radius: 1737.4e3,
          color: '#bbb',
          satellites: [],
        },
      ],
    },
    {
      name: 'Mars',
      eccentricity: 0.0935,
      semiMajorAxis: 227939200e3,
      inclination: 1.85,
      longitudeAscending: 49.558,
      argumentOfPeriapsis: 286.502,
      trueAnomaly: 0,
      mass: 6.4171e23,
      radius: 3389.5e3,
      color: '#f53',
      satellites: [], // TODO: phobos, deimos
    },
    {
      name: 'Ceres',
      eccentricity: 0.075823,
      semiMajorAxis: 413690250e3,
      inclination: 10.594,
      longitudeAscending: 80.305,
      argumentOfPeriapsis: 73.597,
      trueAnomaly: 0,
      mass: 9.3839e20,
      radius: 966.2e3,
      color: '#bbb',
      satellites: [],
    },
    {
      name: 'Jupiter',
      eccentricity: 0.0489,
      semiMajorAxis: 778340821e3,
      inclination: 1.305,
      longitudeAscending: 100.556,
      argumentOfPeriapsis: 14.753,
      trueAnomaly: 0,
      mass: 1.8982e27,
      radius: 69911e3,
      color: '#fa2',
      satellites: [
        {
          name: 'Io',
          eccentricity: 0.0041,
          semiMajorAxis: 421800e3,
          inclination: 0.036,
          longitudeAscending: 0, // approximate
          argumentOfPeriapsis: 0, // approximated for circular orbits
          trueAnomaly: 0,
          mass: 8.931938e22,
          radius: 1821.6e3,
          color: '#bbb',
          satellites: [],
        },
        {
          name: 'Europa',
          eccentricity: 0.0094,
          semiMajorAxis: 671100e3,
          inclination: 0.466,
          longitudeAscending: 0, // approximate
          argumentOfPeriapsis: 0, // approximated for circular orbits
          trueAnomaly: 0,
          mass: 4.799844e22,
          radius: 1560.8e3,
          color: '#bbb',
          satellites: [],
        },
        {
          name: 'Ganymede',
          eccentricity: 0.0013,
          semiMajorAxis: 1070400e3,
          inclination: 0.177,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.4819e23,
          radius: 2634.1e3,
          color: '#bbb',
          satellites: [],
        },
        {
          name: 'Callisto',
          eccentricity: 0.0074,
          semiMajorAxis: 1882700e3,
          inclination: 0.192,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.075938e23,
          radius: 2410.3e3,
          color: '#bbb',
          satellites: [],
        },
      ],
    },
    {
      name: 'Saturn',
      eccentricity: 0.0565,
      semiMajorAxis: 1433449370e3,
      inclination: 2.485,
      longitudeAscending: 113.715,
      argumentOfPeriapsis: 92.431,
      trueAnomaly: 0,
      mass: 5.6834e26,
      radius: 58232e3,
      color: '#faa',
      satellites: [], // TODO
    },
    {
      name: 'Uranus',
      eccentricity: 0.0457,
      semiMajorAxis: 2876679082e3,
      inclination: 0.772,
      longitudeAscending: 74.006,
      argumentOfPeriapsis: 170.964,
      trueAnomaly: 0,
      mass: 8.681e25,
      radius: 25362e3,
      color: '#fec',
      satellites: [], // TODO
    },
    {
      name: 'Uranus',
      eccentricity: 0.0086,
      semiMajorAxis: 4503443661e3,
      inclination: 1.77,
      longitudeAscending: 131.784,
      argumentOfPeriapsis: 44.971,
      trueAnomaly: 0,
      mass: 1.02409e26,
      radius: 24622e3,
      color: '#2bc',
      satellites: [], // TODO
    },
    {
      name: 'Pluto',
      eccentricity: 0.2488,
      semiMajorAxis: 5906440628e3,
      inclination: 17.16,
      longitudeAscending: 110.299,
      argumentOfPeriapsis: 113.834,
      trueAnomaly: 0,
      mass: 1.3025e22,
      radius: 1188.3e3,
      color: '#ddd',
      satellites: [],
    },
  ],
};

function getCelestialBodyNames(body: CelestialBody): Array<string> {
  return [body.name, ...body.satellites.flatMap(b => getCelestialBodyNames(b))];
}

function getCelestialBodyOrbitalPeriodsAboutParent(
  parent: CelestialBody | null,
  child: CelestialBody
): Record<string, number> {
  return child.satellites.reduce<Record<string, number>>(
    (acc, grandchild) => ({ ...acc, ...getCelestialBodyOrbitalPeriodsAboutParent(child, grandchild) }),
    { [child.name]: parent != null ? orbitalPeriod(child.semiMajorAxis, parent.mass) : 1 }
  );
}
export const CELESTIAL_BODY_NAMES: Array<string> = getCelestialBodyNames(SOL);
export const ORBITAL_PERIODS: Record<string, number> = getCelestialBodyOrbitalPeriodsAboutParent(null, SOL);

export const MU_SOL = SOL.mass * G; // 1.32712440018e20; // m^3/s^2, gravitational parameter for the Sun
export const MIN_STEPS_PER_PERIOD = 64; // ensure stability of simulation by requiring N frames per period
