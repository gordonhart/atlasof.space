import { CelestialBody, CelestialBodyType, CelestialBodyState } from './types.ts';
import { orbitalPeriod } from './physics.ts';
import sunSrc from '../../assets/sun-thumb.jpg';
import uranusSrc from '../../assets/uranus-thumb.jpg';
import neptuneSrc from '../../assets/neptune-thumb.jpg';
import plutoSrc from '../../assets/pluto-thumb.jpg';
import arrokothSrc from '../../assets/arrokoth-thumb.jpg';

export const G = 6.6743e-11; // gravitational constant, N⋅m2⋅kg−2
export const AU = 1.496e11; // meters

const DEFAULT_MOON_COLOR = '#aaa';
const DEFAULT_ASTEROID_COLOR = '#6b6b6b'; // dark gray, typical for S-type asteroids

// TODO: for these asteroids, we're using instantaneous orbital elements instead of 'proper' orbital elements
//  collected over time. Switch?
export const ASTEROIDS: Array<CelestialBody> = [
  {
    name: '1 Ceres',
    shortName: 'Ceres',
    type: 'asteroid',
    eccentricity: 0.075823,
    semiMajorAxis: 413690250e3,
    inclination: 10.594,
    longitudeAscending: 80.305,
    argumentOfPeriapsis: 73.597,
    trueAnomaly: 0,
    mass: 9.3839e20,
    radius: 966.2e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '4 Vesta',
    shortName: 'Vesta',
    type: 'asteroid',
    eccentricity: 0.0894,
    semiMajorAxis: 2.36 * AU,
    inclination: 7.1422,
    longitudeAscending: 103.71,
    argumentOfPeriapsis: 151.66,
    trueAnomaly: 0,
    mass: 2.590271e20,
    radius: 278.6e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '2 Pallas',
    shortName: 'Pallas',
    type: 'asteroid',
    eccentricity: 0.2302,
    semiMajorAxis: 4.14e11,
    inclination: 34.93,
    longitudeAscending: 172.9,
    argumentOfPeriapsis: 310.9,
    trueAnomaly: 0,
    mass: 2.04e20,
    radius: 256e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '10 Hygiea',
    shortName: 'Hygiea',
    type: 'asteroid',
    eccentricity: 0.1125,
    semiMajorAxis: 3.1415 * AU,
    inclination: 3.8316,
    longitudeAscending: 283.2,
    argumentOfPeriapsis: 312.32,
    trueAnomaly: 0,
    mass: 8.74e19,
    radius: 215e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '3 Juno',
    shortName: 'Juno',
    mass: 2.67e19, // kg
    radius: 127e3, // m
    eccentricity: 0.2562,
    semiMajorAxis: 3.35 * AU, // meters
    inclination: 12.991, // degrees
    longitudeAscending: 169.84, // degrees
    argumentOfPeriapsis: 247.74, // degrees
    trueAnomaly: 0, // degrees (value at epoch)
    color: DEFAULT_ASTEROID_COLOR,
    type: 'asteroid',
    satellites: [],
  },
  {
    name: '162173 Ryugu',
    shortName: 'Ryugu',
    type: 'asteroid',
    eccentricity: 0.1902,
    semiMajorAxis: 1.1896 * AU,
    inclination: 5.8837,
    longitudeAscending: 251.62,
    argumentOfPeriapsis: 211.43,
    trueAnomaly: 0,
    mass: 4.5e11,
    radius: 448,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '21 Lutetia',
    shortName: 'Lutetia',
    mass: 1.7e18, // kg
    radius: 49e3, // m
    eccentricity: 0.16339,
    semiMajorAxis: 2.435 * 1.496e11, // AU to meters
    inclination: 3.064, // degrees
    longitudeAscending: 80.867, // degrees
    argumentOfPeriapsis: 249.997, // degrees
    trueAnomaly: 87.976, // degrees
    siderealRotationPeriod: 8.1655 * 3600, // hours to seconds
    color: DEFAULT_ASTEROID_COLOR,
    type: 'asteroid',
    satellites: [],
  },
  {
    name: '67P/Churyumov–Gerasimenko',
    shortName: '67P/C–G',
    mass: 1e13, // kg
    radius: 2000, // m (average radius based on dimensions)
    eccentricity: 0.64,
    semiMajorAxis: 3.463 * 1.496e11, // AU to meters
    inclination: 7.04, // degrees
    longitudeAscending: 50.19, // degrees
    argumentOfPeriapsis: 12.78, // degrees
    trueAnomaly: 0, // degrees (value at perihelion)
    siderealRotationPeriod: 12.4 * 3600, // hours to seconds
    color: DEFAULT_ASTEROID_COLOR,
    type: 'asteroid',
    satellites: [],
  },
  {
    name: '433 Eros',
    shortName: 'Eros',
    mass: 6.687e15, // kg
    radius: 8420, // m, average (highly irregular)
    eccentricity: 0.2226,
    semiMajorAxis: 1.4579 * AU, // meters
    inclination: 10.828, // degrees
    longitudeAscending: 304.32, // degrees
    argumentOfPeriapsis: 178.82, // degrees
    trueAnomaly: 0, // degrees (value at epoch)
    color: DEFAULT_ASTEROID_COLOR,
    type: 'asteroid',
    satellites: [],
  },
  {
    name: '253 Mathilde',
    shortName: 'Mathilde',
    mass: 1.033e17, // kg
    radius: 26.4e3, // m
    eccentricity: 0.26492652,
    semiMajorAxis: 2.648402147 * AU, // meters
    inclination: 6.7427122, // degrees
    longitudeAscending: 179.58936, // degrees
    argumentOfPeriapsis: 157.39642, // degrees
    trueAnomaly: 0, // degrees (value at epoch)
    color: DEFAULT_ASTEROID_COLOR,
    type: 'asteroid',
    satellites: [],
  },
];

export const TRANS_NEPTUNIAN_OBJECTS: Array<CelestialBody> = [
  {
    name: '134340 Pluto',
    shortName: 'Pluto',
    thumbnail: plutoSrc,
    type: 'trans-neptunian-object',
    eccentricity: 0.2488,
    semiMajorAxis: 5906440628e3,
    inclination: 17.16,
    longitudeAscending: 110.299,
    argumentOfPeriapsis: 113.834,
    trueAnomaly: 0,
    mass: 1.3025e22,
    radius: 1188.3e3,
    siderealRotationPeriod: 6 * 24 * 60 * 60 + 9 * 60 * 60 + 17.6 * 60, // - 6 days 9 hr 17.6 min (sideways)
    color: '#E7C7A4',
    satellites: [
      {
        name: 'Charon',
        type: 'moon',
        eccentricity: 0.00005,
        semiMajorAxis: 19596e3,
        inclination: 0.0,
        longitudeAscending: 0,
        argumentOfPeriapsis: 0,
        trueAnomaly: 0,
        mass: 1.586e21,
        radius: 606e3,
        siderealRotationPeriod: 6 * 24 * 60 * 60 + 9 * 60 * 60 + 17 * 60 + 35.89, // mutually tidally locked w/ pluto
        color: DEFAULT_MOON_COLOR,
        satellites: [],
      },
    ],
  },
  {
    name: '136199 Eris',
    shortName: 'Eris',
    type: 'trans-neptunian-object',
    eccentricity: 0.43607,
    semiMajorAxis: 67.864 * AU,
    inclination: 44.04,
    longitudeAscending: 35.951,
    argumentOfPeriapsis: 151.639,
    trueAnomaly: 0,
    mass: 1.6466e22,
    radius: 1163e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '136108 Haumea',
    shortName: 'Haumea',
    type: 'trans-neptunian-object',
    eccentricity: 0.19642,
    semiMajorAxis: 43.116 * AU,
    inclination: 28.2137,
    longitudeAscending: 122.167,
    argumentOfPeriapsis: 239.041,
    trueAnomaly: 0,
    mass: 4.006e21,
    radius: 780e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '136472 Makemake',
    shortName: 'Makemake',
    type: 'trans-neptunian-object',
    eccentricity: 0.16126,
    semiMajorAxis: 45.43 * AU,
    inclination: 28.9835,
    longitudeAscending: 79.62,
    argumentOfPeriapsis: 294.834,
    trueAnomaly: 0,
    mass: 3.1e21,
    radius: 715e3,
    color: DEFAULT_ASTEROID_COLOR,
    satellites: [],
  },
  {
    name: '486958 Arrokoth', // also known as Ultima Thule
    shortName: 'Arrokoth',
    thumbnail: arrokothSrc,
    mass: 7.485e14, // kg
    radius: 18e3, // m (average radius based on length of 36 km)
    eccentricity: 0.04172,
    semiMajorAxis: 44.581 * AU,
    inclination: 2.4512, // degrees
    longitudeAscending: 158.998, // degrees
    argumentOfPeriapsis: 174.418, // degrees
    trueAnomaly: 0, // degrees (value at perihelion)
    color: DEFAULT_ASTEROID_COLOR,
    type: 'trans-neptunian-object',
    satellites: [],
  },
];

export const SOL2: CelestialBody = {
  name: 'Sol',
  type: 'sun',
  thumbnail: sunSrc as string, // TODO: cast shouldn't be necessary
  eccentricity: 0,
  semiMajorAxis: 0,
  inclination: 0,
  longitudeAscending: 0,
  argumentOfPeriapsis: 0,
  trueAnomaly: 0,
  mass: 1.9885e30,
  radius: 6.957e8,
  siderealRotationPeriod: 609.12 * 60 * 60, // 609 hours at 16º latitude; true period varies by latitude
  color: '#fa0',
  satellites: [
    {
      name: 'Mercury',
      type: 'planet',
      eccentricity: 0.2056,
      semiMajorAxis: 57909050e3, // meters
      inclination: 7.005, // degrees
      longitudeAscending: 48.331, // degrees
      argumentOfPeriapsis: 29.124, // degrees
      trueAnomaly: 0, // degrees (choose initial position as desired)
      mass: 3.3011e23,
      radius: 2439.7e3,
      siderealRotationPeriod: 58.6467 * 24 * 60 * 60, // 58 days
      color: '#b3aeae',
      satellites: [],
    },
    {
      name: 'Venus',
      type: 'planet',
      eccentricity: 0.006772,
      semiMajorAxis: 108208000e3,
      inclination: 3.39458,
      longitudeAscending: 76.6799,
      argumentOfPeriapsis: 54.884,
      trueAnomaly: 0, // starting at periapsis // TODO: set real values
      mass: 4.8675e24,
      radius: 6051.8e3,
      siderealRotationPeriod: -243.02 * 24 * 60 * 60, // 243 days; negative for retrograde rotation
      color: '#e6b667',
      satellites: [],
    },
    {
      name: 'Earth',
      type: 'planet',
      eccentricity: 0.0167086,
      semiMajorAxis: 149597870.7e3, // 1 AU
      inclination: 0.00005,
      longitudeAscending: -11.26064,
      argumentOfPeriapsis: 114.20783,
      trueAnomaly: 0,
      mass: 5.972168e24,
      radius: 6371e3,
      siderealRotationPeriod: 23 * 60 * 60 + 56 * 60 + 4.1, // 23h 56 m 4.100s
      color: '#7e87dd',
      satellites: [
        {
          name: 'Luna',
          type: 'moon',
          eccentricity: 0.0549,
          semiMajorAxis: 384400e3,
          inclination: 5.145,
          longitudeAscending: 125.08,
          argumentOfPeriapsis: 318.15,
          trueAnomaly: 0,
          mass: 7.342e22,
          radius: 1737.4e3,
          siderealRotationPeriod: 27.321661 * 24 * 60 * 60,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        /* {
          name: 'ISS',
          type: 'moon',
          eccentricity: 0.000767, // Orbital eccentricity (nearly circular)
          semiMajorAxis: 6787.4e3, // Semi-major axis in meters (~6787 km)
          inclination: 51.64, // Inclination in degrees (relative to the equatorial plane)
          longitudeAscending: 0, // Longitude of ascending node (changes due to precession)
          argumentOfPeriapsis: 0, // Argument of periapsis (nearly circular, not significant)
          trueAnomaly: 0, // Starting at periapsis
          mass: 419725,
          radius: 50, // roughly
          color: '#fff',
          satellites: [],
        }, */
      ],
    },
    {
      name: 'Mars',
      type: 'planet',
      eccentricity: 0.0935,
      semiMajorAxis: 227939200e3,
      inclination: 1.85,
      longitudeAscending: 49.558,
      argumentOfPeriapsis: 286.502,
      trueAnomaly: 0,
      mass: 6.4171e23,
      radius: 3389.5e3,
      siderealRotationPeriod: 24 * 60 * 60 + 37 * 60 + 22.66, // 24 hr 37 min 22.66 sec
      color: '#c96c3c',
      satellites: [
        {
          name: 'Phobos',
          type: 'moon',
          eccentricity: 0.0151,
          semiMajorAxis: 9376e3,
          inclination: 1.093,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.0659e16,
          radius: 11.2667e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Deimos',
          type: 'moon',
          eccentricity: 0.00033,
          semiMajorAxis: 23458e3,
          inclination: 1.788,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.4762e15,
          radius: 6.2e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
      ],
    },
    ...ASTEROIDS,
    {
      name: 'Jupiter',
      type: 'planet',
      eccentricity: 0.0489,
      semiMajorAxis: 778340821e3,
      inclination: 1.305,
      longitudeAscending: 100.556,
      argumentOfPeriapsis: 14.753,
      trueAnomaly: 0,
      mass: 1.8982e27,
      radius: 69911e3,
      siderealRotationPeriod: 9 * 60 * 60 + 55 * 60 + 30, // 9 hr 55 min 30 sec
      color: '#e9be76',
      satellites: [
        {
          name: 'Io',
          type: 'moon',
          eccentricity: 0.0041,
          semiMajorAxis: 421800e3,
          inclination: 0.036,
          longitudeAscending: 0, // approximate
          argumentOfPeriapsis: 0, // approximated for circular orbits
          trueAnomaly: 0,
          mass: 8.931938e22,
          radius: 1821.6e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Europa',
          type: 'moon',
          eccentricity: 0.0094,
          semiMajorAxis: 671100e3,
          inclination: 0.466,
          longitudeAscending: 0, // approximate
          argumentOfPeriapsis: 0, // approximated for circular orbits
          trueAnomaly: 0,
          mass: 4.799844e22,
          radius: 1560.8e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Ganymede',
          type: 'moon',
          eccentricity: 0.0013,
          semiMajorAxis: 1070400e3,
          inclination: 0.177,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.4819e23,
          radius: 2634.1e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Callisto',
          type: 'moon',
          eccentricity: 0.0074,
          semiMajorAxis: 1882700e3,
          inclination: 0.192,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.075938e23,
          radius: 2410.3e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
      ],
    },
    {
      name: 'Saturn',
      type: 'planet',
      eccentricity: 0.0565,
      semiMajorAxis: 1433449370e3,
      inclination: 2.485,
      longitudeAscending: 113.715,
      argumentOfPeriapsis: 92.431,
      trueAnomaly: 0,
      mass: 5.6834e26,
      radius: 58232e3,
      siderealRotationPeriod: 10 * 60 * 60 + 32 * 60 + 35, // 10 hr 32 min 35 sec
      color: '#d7be87',
      satellites: [
        {
          name: 'Mimas',
          type: 'moon',
          eccentricity: 0.0196,
          semiMajorAxis: 185540e3,
          inclination: 1.574,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 3.7493e19,
          radius: 198.2e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Enceladus',
          type: 'moon',
          eccentricity: 0.0047,
          semiMajorAxis: 238040e3,
          inclination: 0.009,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.08022e20,
          radius: 252.1e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Tethys',
          type: 'moon',
          eccentricity: 0.0001,
          semiMajorAxis: 294670e3,
          inclination: 1.091,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 6.17449e20,
          radius: 531.1e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Dione',
          type: 'moon',
          eccentricity: 0.0022,
          semiMajorAxis: 377420e3,
          inclination: 0.028,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.095452e21,
          radius: 561.4e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Rhea',
          type: 'moon',
          eccentricity: 0.001,
          semiMajorAxis: 527070e3,
          inclination: 0.345,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 2.306518e21,
          radius: 763.8e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Titan',
          type: 'moon',
          eccentricity: 0.0288,
          semiMajorAxis: 1221870e3,
          inclination: 0.348,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.3452e23,
          radius: 2574.7e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        {
          name: 'Iapetus',
          type: 'moon',
          eccentricity: 0.0286,
          semiMajorAxis: 3560820e3,
          inclination: 15.47,
          longitudeAscending: 0,
          argumentOfPeriapsis: 0,
          trueAnomaly: 0,
          mass: 1.805635e21,
          radius: 734.5e3,
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
      ],
    },
    {
      name: 'Uranus',
      type: 'planet',
      thumbnail: uranusSrc,
      eccentricity: 0.0457,
      semiMajorAxis: 2876679082e3,
      inclination: 0.772,
      longitudeAscending: 74.006,
      argumentOfPeriapsis: 170.964,
      trueAnomaly: 0,
      mass: 8.681e25,
      radius: 25362e3,
      siderealRotationPeriod: -17 * 60 * 60 + 14 * 60 + 24, // -17 hr 14 min 24 sec
      color: '#9bcee6',
      satellites: [
        // TODO: add the main moons: Miranda, Ariel, Umbriel, Titania, Oberon
        //  there are more but we can ignore those for now
      ],
    },
    {
      name: 'Neptune',
      type: 'planet',
      thumbnail: neptuneSrc,
      eccentricity: 0.0086,
      semiMajorAxis: 4503443661e3,
      inclination: 1.77,
      longitudeAscending: 131.784,
      argumentOfPeriapsis: 44.971,
      trueAnomaly: 0,
      mass: 1.02409e26,
      radius: 24622e3,
      siderealRotationPeriod: 16 * 60 * 60 + 6.6 * 60, // 16 hr 6.6 min
      color: '#5a7cf6',
      satellites: [
        {
          name: 'Triton',
          type: 'moon',
          eccentricity: 0.000016,
          semiMajorAxis: 354759e3,
          inclination: 129.608, // to Neptune's orbit -- is this the right inclination to use?
          longitudeAscending: 177.70910343, // TODO: some uncertainty with these two values
          argumentOfPeriapsis: 260.64357,
          trueAnomaly: 0,
          mass: 2.1389e22,
          radius: 1353.4e3,
          siderealRotationPeriod: 5 * 24 * 60 * 60 + 21 * 60 * 60 + 2 * 60 + 53, // 5 d, 21 h, 2 min, 53 s
          color: DEFAULT_MOON_COLOR,
          satellites: [],
        },
        // TODO: there are many more
      ],
    },
    ...TRANS_NEPTUNIAN_OBJECTS,
  ],
};
export const SOL = {
  ...SOL2,
  // satellites: SOL2.satellites.filter(({ type }) => type === 'sun' || type === 'planet'),
  // satellites: SOL2.satellites.filter(({ name }) => name === 'Mercury'),
};

export const ASTEROID_BELT = { min: 2.2 * AU, max: 3.2 * AU };
export const KUIPER_BELT = { min: 30 * AU, max: 55 * AU };

function getCelestialBodyNames(body: CelestialBody): Array<string> {
  return [body.name, ...body.satellites.flatMap(b => getCelestialBodyNames(b))];
}
export const CELESTIAL_BODY_NAMES: Array<string> = getCelestialBodyNames(SOL);

function getCelestialBodyClasses(body: CelestialBody): Array<CelestialBodyType> {
  return [body.type, ...body.satellites.flatMap(b => getCelestialBodyClasses(b))];
}
export const CELESTIAL_BODY_CLASSES: Array<CelestialBodyType> = getCelestialBodyClasses(SOL);

function getCelestialBodyOrbitalPeriodsAboutParent(
  parent: CelestialBody | null,
  child: CelestialBody
): Record<string, number> {
  return child.satellites.reduce<Record<string, number>>(
    (acc, grandchild) => ({ ...acc, ...getCelestialBodyOrbitalPeriodsAboutParent(child, grandchild) }),
    { [child.name]: parent != null ? orbitalPeriod(child.semiMajorAxis, parent.mass) : 1 }
  );
}
export const ORBITAL_PERIODS: Record<string, number> = getCelestialBodyOrbitalPeriodsAboutParent(null, SOL);

// TODO: this could be more performant, maybe constructing an index of the state tree once then just looking up
export function findCelestialBody(state: CelestialBodyState, name: string): CelestialBodyState | undefined {
  if (name === state.name) {
    return state;
  }
  for (const child of state.satellites) {
    const found = findCelestialBody(child, name);
    if (found != null) {
      return found;
    }
  }
}
