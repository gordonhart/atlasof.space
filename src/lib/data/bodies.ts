import { J2000, julianDayToEpoch, Time } from '../epoch.ts';
import { estimateAsteroidMass, estimateCometMass } from '../physics.ts';
import { SBDB_URL } from '../sbdb.ts';
import {
  asCelestialBodyId,
  CelestialBody,
  CelestialBodyId,
  CelestialBodyStyle,
  CelestialBodyType,
  HexColor,
  OrbitalRegimeId,
} from '../types.ts';
import { nameToId } from '../utils.ts';

export const AU = 1.495978707e11; // meters;
export const g = 9.807; // earth gravity

export const DEFAULT_ASTEROID_COLOR = '#8b8b8b'; // dark gray, typical for S-type asteroids
export const DEFAULT_COMET_COLOR = '#51807c';
export const DEFAULT_SPACECRAFT_COLOR = '#50C878';
const DEFAULT_CELESTIAL_BODY_FG_COLOR: { [T in CelestialBodyType]?: HexColor } = {
  [CelestialBodyType.MOON]: '#aaaaaa',
  [CelestialBodyType.ASTEROID]: DEFAULT_ASTEROID_COLOR,
  [CelestialBodyType.COMET]: DEFAULT_COMET_COLOR,
  [CelestialBodyType.DWARF_PLANET]: '#998a98',
  [CelestialBodyType.TRANS_NEPTUNIAN_OBJECT]: '#7b739e',
  [CelestialBodyType.SPACECRAFT]: DEFAULT_SPACECRAFT_COLOR,
};
const DEFAULT_CELESTIAL_BODY_BG_COLOR: { [T in CelestialBodyType]?: HexColor } = {
  [CelestialBodyType.MOON]: '#888888',
  [CelestialBodyType.ASTEROID]: '#4b4b4b',
  [CelestialBodyType.DWARF_PLANET]: '#6e636d',
  [CelestialBodyType.TRANS_NEPTUNIAN_OBJECT]: '#6d6887',
};

export function celestialBodyWithDefaults(
  body: Omit<CelestialBody, 'id' | 'style'> & { id?: CelestialBodyId; style?: CelestialBodyStyle }
): CelestialBody {
  return {
    ...body,
    id: body.id ?? asCelestialBodyId(nameToId(body.name, body.shortName)),
    style: {
      fgColor: body.style?.fgColor ?? DEFAULT_CELESTIAL_BODY_FG_COLOR[body.type] ?? DEFAULT_ASTEROID_COLOR,
      bgColor: body.style?.bgColor ?? body.style?.fgColor ?? DEFAULT_CELESTIAL_BODY_BG_COLOR[body.type],
    },
  };
}

export const SOL = celestialBodyWithDefaults({
  type: CelestialBodyType.STAR,
  name: 'Sol (The Sun)',
  shortName: 'Sol',
  influencedBy: [],
  elements: {
    wrt: null,
    epoch: J2000,
    eccentricity: 0,
    semiMajorAxis: 0,
    inclination: 0,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
    rotation: {
      axialTilt: 7.25,
      siderealPeriod: 609.12 * Time.HOUR, // 609 hours at 16º latitude; true period varies by latitude
    },
  },
  mass: 1.9885e30,
  radius: 6.957e8,
  style: { fgColor: '#fa0' },
  assets: {
    thumbnail: 'sol-thumb.jpg',
    texture: 'sol-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Sun',
  },
  facts: [
    { label: 'age', value: '4.6 billion years' },
    { label: 'star type', value: 'G-type main-sequence star (yellow dwarf)' },
    { label: 'temperature (center)', value: '15,700,000 K' },
    { label: 'temperature (corona)', value: '5,000,000 K' },
  ],
});

export const MERCURY = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Mercury',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.20563,
    semiMajorAxis: 57909050e3, // meters
    inclination: 7.005, // degrees
    longitudeAscending: 48.331, // degrees
    argumentOfPeriapsis: 29.124, // degrees
    meanAnomaly: 174.796, // degrees
    rotation: {
      axialTilt: 0.034,
      siderealPeriod: 58.6467 * Time.DAY,
    },
  },
  mass: 3.3011e23,
  radius: 2439.7e3,
  style: { fgColor: '#b3aeae' },
  assets: {
    thumbnail: 'mercury-thumb.jpg',
    texture: 'mercury-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Mercury_(planet)',
  },
  facts: [
    {
      label: 'solar day length',
      value: 'A solar day on Mercury (176 Earth days) is longer than a year (88 Earth days)',
    },
  ],
});

// TODO: add pseudo-moon Zoozve?
export const VENUS = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Venus',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.006772,
    semiMajorAxis: 108208000e3,
    inclination: 3.39458,
    longitudeAscending: 76.6799,
    argumentOfPeriapsis: 54.884,
    meanAnomaly: 50.115,
    rotation: {
      axialTilt: 2.64, // TODO: retrograde; is this modeled correctly?
      siderealPeriod: -243.02 * Time.DAY, // negative for retrograde rotation
    },
  },
  mass: 4.8675e24,
  radius: 6051.8e3,
  style: { fgColor: '#e6b667' },
  assets: {
    thumbnail: 'venus-thumb.jpg',
    texture: 'venus-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Venus',
    gallery: [
      { filename: 'venus-venera.jpg' },
      { filename: 'venus-venera2.jpg' },
      { filename: 'venus-eistla-regio.jpg' },
      { filename: 'venus-venera3.jpg' },
      { filename: 'venus-magellan.jpg' },
    ],
  },
});

export const EARTH = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Earth',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.0167086,
    semiMajorAxis: 149597870.7e3, // 1 AU
    inclination: 0.00005, // shouldn't this be 0 (plane of the ecliptic)?
    longitudeAscending: -11.26064,
    argumentOfPeriapsis: 114.20783,
    meanAnomaly: 358.617,
    rotation: {
      axialTilt: -23.4, // TODO: this points it in the right direction -- should all axial tilts be in this direction?
      siderealPeriod: 23 * Time.HOUR + 56 * Time.MINUTE + 4.1, // 23h 56 m 4.100s
      initialRotation: 170, // hand-tuned to align with real rotation
    },
  },
  mass: 5.972168e24,
  radius: 6371e3,
  style: { fgColor: '#7e87dd' },
  assets: {
    thumbnail: 'earth-thumb.jpg',
    texture: 'earth-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Earth',
  },
});

export const LUNA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Luna (The Moon)',
  shortName: 'Luna',
  influencedBy: [SOL.id, EARTH.id],
  elements: {
    wrt: EARTH.id,
    epoch: J2000,
    eccentricity: 0.0549,
    semiMajorAxis: 384400e3,
    inclination: 5.145,
    longitudeAscending: 125.08,
    argumentOfPeriapsis: 318.15,
    meanAnomaly: 0, // TODO: find
    rotation: {
      axialTilt: 6.687,
      siderealPeriod: 27.321661 * Time.DAY,
      initialRotation: 145, // hand-tuned to have the near side facing Earth
    },
  },
  mass: 7.342e22,
  radius: 1737.4e3,
  assets: {
    thumbnail: 'luna-thumb.jpg',
    texture: 'luna-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Moon',
    gallery: [
      {
        filename: 'luna-apollo-15.jpg',
        caption:
          'Apollo 15 astronaut Jim Irwin stands at the Lunar Rover, with Mt. Hadley as a backdrop, in this image taken by Dave Scott at the end of EVA-1. Newly-processed from NASA Photo ID AS15-86-11603.',
      },
      { filename: 'luna-apollo-17.jpg' },
      { filename: 'luna-change-landing.mp4' },
      { filename: 'luna-apollo-15-2.jpg' },
      { filename: 'luna-apollo-11.jpg' },
    ],
  },
});

export const EARTH_SYSTEM = [EARTH, LUNA];

export const MARS = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Mars',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.0935,
    semiMajorAxis: 227939366e3,
    inclination: 1.85,
    longitudeAscending: 49.57854,
    argumentOfPeriapsis: 286.502,
    meanAnomaly: 19.412,
    rotation: {
      axialTilt: 25.19,
      siderealPeriod: Time.DAY + 37 * Time.MINUTE + 22.66, // 24 hr 37 min 22.66 sec
    },
  },
  mass: 6.4171e23,
  radius: 3389.5e3,
  style: { fgColor: '#c96c3c' },
  assets: {
    thumbnail: 'mars-thumb.jpg',
    texture: 'mars-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Mars',
    gallery: [
      { filename: 'mars-curiosity.jpg' },
      { filename: 'mars-perseverance.jpg' },
      { filename: 'mars-ingenuity.mp4' },
      { filename: 'mars-viking.jpg' },
      { filename: 'mars-korolev.jpg' },
    ],
  },
});

export const PHOBOS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Phobos',
  influencedBy: [SOL.id, MARS.id],
  elements: {
    wrt: MARS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0151,
    semiMajorAxis: 9376e3,
    inclination: 1.093 + MARS.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
    rotation: {
      axialTilt: 0,
      siderealPeriod: 7 * Time.HOUR + 39 * Time.MINUTE + 12, // synchronous
    },
  },
  mass: 1.0659e16,
  radius: 11.2667e3,
  assets: {
    thumbnail: 'phobos-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Phobos_(moon)',
  },
});

export const DEIMOS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Deimos',
  influencedBy: [SOL.id, MARS.id],
  elements: {
    wrt: MARS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.00033,
    semiMajorAxis: 23458e3,
    inclination: 0.93 + MARS.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
    rotation: {
      axialTilt: 0,
      siderealPeriod: 30.312 * Time.HOUR, // synchronous
    },
  },
  mass: 1.4762e15,
  radius: 6.2e3,
  assets: {
    thumbnail: 'deimos-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Deimos_(moon)',
  },
});

export const MARS_SYSTEM = [MARS, PHOBOS, DEIMOS];

// TODO: for these asteroids, we're using instantaneous orbital elements instead of 'proper' orbital elements
//  collected over time. Switch?
export const CERES = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '1 Ceres',
  shortName: 'Ceres',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459600.5'),
    eccentricity: 0.075823,
    semiMajorAxis: 413690250e3,
    inclination: 10.594,
    longitudeAscending: 80.305,
    argumentOfPeriapsis: 73.597,
    meanAnomaly: 291.4,
    rotation: {
      axialTilt: 4,
      siderealPeriod: 9.07417 * Time.HOUR,
    },
  },
  mass: 9.3839e20,
  radius: 966.2e3 / 2,
  assets: {
    thumbnail: 'ceres-thumb.jpg',
    texture: 'ceres-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)',
  },
});

export const PALLAS = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '2 Pallas',
  shortName: 'Pallas',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2453300.5'),
    eccentricity: 0.2302,
    semiMajorAxis: 4.14e11,
    inclination: 34.93,
    longitudeAscending: 172.9,
    argumentOfPeriapsis: 310.9,
    meanAnomaly: 40.6,
  },
  mass: 2.04e20,
  radius: 256e3,
  assets: {
    thumbnail: 'pallas-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/2_Pallas',
  },
});

export const JUNO = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '3 Juno',
  shortName: 'Juno',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.2562,
    semiMajorAxis: 3.35 * AU, // meters
    inclination: 12.991, // degrees
    longitudeAscending: 169.84, // degrees
    argumentOfPeriapsis: 247.74, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  mass: 2.67e19, // kg
  radius: 127e3, // m
  assets: {
    thumbnail: 'juno-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/3_Juno',
  },
});

export const VESTA = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '4 Vesta',
  shortName: 'Vesta',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2453300.5'),
    eccentricity: 0.0894,
    semiMajorAxis: 2.36 * AU,
    inclination: 7.1422,
    longitudeAscending: 103.71,
    argumentOfPeriapsis: 151.66,
    meanAnomaly: 169.4,
  },
  mass: 2.590271e20,
  radius: 278.6e3,
  assets: {
    thumbnail: 'vesta-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/4_Vesta',
  },
});

export const HEBE = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '6 Hebe',
  shortName: 'Hebe',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.2024234177620576,
    semiMajorAxis: 362930294023.13635,
    inclination: 14.7343613757291,
    longitudeAscending: 138.6198303084144,
    argumentOfPeriapsis: 239.6481345551401,
    meanAnomaly: 248.2729238857798,
  },
  mass: 1.24e19,
  radius: 92.59e3,
  assets: {
    thumbnail: 'hebe-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/6_Hebe',
  },
});

export const IRIS = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '7 Iris',
  shortName: 'Iris',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.2298579625141813,
    semiMajorAxis: 356947274432.7954,
    inclination: 5.51947889466475,
    longitudeAscending: 259.4989908638725,
    argumentOfPeriapsis: 145.5201004327357,
    meanAnomaly: 314.7578447776537,
  },
  mass: 13.5e18,
  radius: 99.915e3,
  assets: {
    thumbnail: 'iris-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/7_Iris',
  },
});

export const HYGIEA = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '10 Hygiea',
  shortName: 'Hygiea',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.1125,
    semiMajorAxis: 3.1415 * AU,
    inclination: 3.8316,
    longitudeAscending: 283.2,
    argumentOfPeriapsis: 312.32,
    meanAnomaly: 0,
  },
  mass: 8.74e19,
  radius: 215e3,
  assets: {
    thumbnail: 'hygiea-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/10_Hygiea',
  },
});

export const PSYCHE = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '16 Psyche',
  shortName: 'Psyche',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.1341242551713989,
    semiMajorAxis: 437195001460.578,
    inclination: 3.097229304279378,
    longitudeAscending: 150.01901994,
    argumentOfPeriapsis: 229.5887902320436,
    meanAnomaly: 321.8655831010872,
  },
  mass: 2.29e19,
  radius: 111.5e3,
  assets: {
    thumbnail: 'psyche-thumb.jpg',
    gallery: [{ filename: 'psyche-illustration.jpg' }, { filename: 'psyche-mission-illustration.jpg' }],
    wiki: 'https://en.wikipedia.org/wiki/16_Psyche',
  },
  facts: [
    {
      label: 'spacecraft mission',
      value: 'NASA launched a mission to Psyche on October 13th, 2023, expected to arrive in 2029',
    },
    { label: 'estimated value', value: 'Estimated $10,000 quadrillion due to size and metallic composition' },
    { label: 'material composition', value: 'Believed to be mainly iron and nickel' },
  ],
});

export const LUTETIA = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '21 Lutetia',
  shortName: 'Lutetia',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.16339,
    semiMajorAxis: 2.435 * 1.496e11, // AU to meters
    inclination: 3.064, // degrees
    longitudeAscending: 80.867, // degrees
    argumentOfPeriapsis: 249.997, // degrees
    meanAnomaly: 87.976, // degrees
    rotation: {
      axialTilt: 96,
      siderealPeriod: 8.1655 * Time.HOUR,
    },
  },
  mass: 1.7e18, // kg
  radius: 49e3, // m
  assets: {
    thumbnail: 'lutetia-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/21_Lutetia',
  },
});

export const IDA = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '243 Ida',
  shortName: 'Ida',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.04468707145845256,
    semiMajorAxis: 427849743875.60846,
    inclination: 1.130081146832236,
    longitudeAscending: 323.584684217808,
    argumentOfPeriapsis: 114.1278027764417,
    meanAnomaly: 286.6317462477484,
  },
  mass: 4.2e16,
  radius: 15.7e3,
  assets: {
    thumbnail: 'ida-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/243_Ida',
    search: 'Q149012',
  },
});

export const MATHILDE = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '253 Mathilde',
  shortName: 'Mathilde',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.26492652,
    semiMajorAxis: 2.648402147 * AU, // meters
    inclination: 6.7427122, // degrees
    longitudeAscending: 179.58936, // degrees
    argumentOfPeriapsis: 157.39642, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  mass: 1.033e17, // kg
  radius: 26.4e3, // m
  assets: {
    thumbnail: 'mathilde-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/253_Mathilde',
  },
});

export const EROS = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '433 Eros',
  shortName: 'Eros',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM, // NEA
  elements: {
    wrt: SOL.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.2226,
    semiMajorAxis: 1.4579 * AU, // meters
    inclination: 10.828, // degrees
    longitudeAscending: 304.32, // degrees
    argumentOfPeriapsis: 178.82, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  mass: 6.687e15, // kg
  radius: 8420, // m, average (highly irregular)
  assets: {
    thumbnail: 'eros-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/433_Eros',
  },
});

export const GASPRA = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '951 Gaspra',
  shortName: 'Gaspra',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.1732495684718864,
    semiMajorAxis: 330592928867.86774,
    inclination: 4.106111105065087,
    longitudeAscending: 252.9889923571982,
    argumentOfPeriapsis: 129.9547895107816,
    meanAnomaly: 293.0013480495998,
  },
  mass: 2.5e15,
  radius: 6.1e3,
  assets: {
    thumbnail: 'gaspra-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/951_Gaspra',
  },
});

export const STEINS = celestialBodyWithDefaults({
  id: asCelestialBodyId('steins'),
  type: CelestialBodyType.ASTEROID,
  name: '2867 Šteins',
  shortName: 'Šteins',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.1455164445582001,
    semiMajorAxis: 353830229254.9914,
    inclination: 9.929375137550416,
    longitudeAscending: 55.33347402049609,
    argumentOfPeriapsis: 251.3574059590774,
    meanAnomaly: 112.7677797374499,
  },
  mass: 179840597118453.84, // estimate
  radius: 2.58e3,
  assets: {
    thumbnail: 'steins-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/2867_%C5%A0teins',
  },
});

export const TOUTATIS = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '4179 Toutatis',
  shortName: 'Toutatis',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2454797.5'),
    eccentricity: 0.6288,
    semiMajorAxis: 2.5321 * AU,
    inclination: 0.446,
    longitudeAscending: 124.3,
    argumentOfPeriapsis: 278.75,
    meanAnomaly: 5.122,
  },
  mass: 1.9e13,
  radius: 1.225e3,
  assets: {
    thumbnail: 'toutatis-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/4179_Toutatis',
  },
});

export const NEREUS = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '4660 Nereus',
  shortName: 'Nereus',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459396.5'),
    eccentricity: 0.36004,
    semiMajorAxis: 1.4889 * AU, // meters
    inclination: 1.4316, // degrees
    longitudeAscending: 314.41, // degrees
    argumentOfPeriapsis: 158.12, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
    rotation: {
      axialTilt: 0, // TODO: find
      siderealPeriod: 15.16 * Time.HOUR,
    },
  },
  mass: estimateAsteroidMass(165), // not known
  radius: 165, // m
  assets: {
    thumbnail: 'nereus-thumb.gif',
    wiki: 'https://en.wikipedia.org/wiki/4660_Nereus',
  },
});

export const ANNEFRANK = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '5535 Annefrank',
  shortName: 'Annefrank',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458000.5'),
    eccentricity: 0.0634,
    semiMajorAxis: 2.2124 * AU,
    inclination: 4.2473,
    longitudeAscending: 120.64,
    argumentOfPeriapsis: 9.1351,
    meanAnomaly: 23.021,
  },
  mass: estimateAsteroidMass(4.34e3),
  radius: 4.34e3,
  assets: {
    thumbnail: 'annefrank-thumb.png',
    wiki: 'https://en.wikipedia.org/wiki/5535_Annefrank',
  },
});

export const BRAILLE = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '9969 Braille',
  shortName: 'Braille',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458000.5'),
    eccentricity: 0.4334,
    semiMajorAxis: 2.341 * AU,
    inclination: 28.999,
    longitudeAscending: 241.95,
    argumentOfPeriapsis: 356.11,
    meanAnomaly: 16.88,
  },
  mass: 7.8e12,
  radius: 800, // m
  assets: {
    thumbnail: 'braille-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/9969_Braille',
  },
});

export const ITOKAWA = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '25143 Itokawa',
  shortName: 'Itokawa',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.28025543912428,
    semiMajorAxis: 198088010254.65103,
    inclination: 1.621180357660033,
    longitudeAscending: 69.07689932024779,
    argumentOfPeriapsis: 162.8201675534644,
    meanAnomaly: 142.5740672564167,
  },
  mass: 3.51e10,
  radius: 165,
  assets: {
    thumbnail: 'itokawa-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/25143_Itokawa',
  },
});

export const DIDYMOS = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '65803 Didymos',
  shortName: 'Didymos',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM, // NEA
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2460600.5'),
    eccentricity: 0.3832511742413838,
    semiMajorAxis: 245729426006.04123,
    inclination: 3.41417645416608,
    longitudeAscending: 72.9859763839095,
    argumentOfPeriapsis: 319.602659066438,
    meanAnomaly: 339.9299652879553,
  },
  mass: 5.2e11,
  radius: 382.5,
  assets: {
    thumbnail: 'didymos-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/65803_Didymos',
    search: 'Q2265762',
  },
});

export const BENNU = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '101955 Bennu',
  shortName: 'Bennu',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2455562.5'),
    eccentricity: 0.2038,
    semiMajorAxis: 1.1264 * AU,
    inclination: 6.0349,
    longitudeAscending: 2.0609,
    argumentOfPeriapsis: 66.2231,
    meanAnomaly: 101.7039,
  },
  mass: 7.329e10,
  radius: 245.03,
  assets: {
    thumbnail: 'bennu-thumb.png',
    gallery: [{ filename: 'bennu-landing.jpg' }, { filename: 'bennu-rotation.gif' }, { filename: 'bennu-surface.jpg' }],
    wiki: 'https://en.wikipedia.org/wiki/101955_Bennu',
  },
});

export const DINKINESH = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '152830 Dinkinesh',
  shortName: 'Dinkinesh',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.ASTEROID_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2460000.5'),
    eccentricity: 0.112,
    semiMajorAxis: 2.191 * AU,
    inclination: 2.094,
    longitudeAscending: 21.38,
    argumentOfPeriapsis: 66.711,
    meanAnomaly: 25.239,
  },
  mass: estimateAsteroidMass(395),
  radius: 395,
  assets: {
    thumbnail: 'dinkinesh-thumb.png',
    wiki: 'https://en.wikipedia.org/wiki/152830_Dinkinesh',
  },
});

export const RYUGU = celestialBodyWithDefaults({
  type: CelestialBodyType.ASTEROID,
  name: '162173 Ryugu',
  shortName: 'Ryugu',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2455907.5'),
    eccentricity: 0.1902,
    semiMajorAxis: 1.1896 * AU,
    inclination: 5.8837,
    longitudeAscending: 251.62,
    argumentOfPeriapsis: 211.43,
    meanAnomaly: 3.9832,
  },
  mass: 4.5e11,
  radius: 448,
  assets: {
    thumbnail: 'ryugu-thumb.jpg',
    gallery: [
      { filename: 'ryugu-surface.jpg' },
      { filename: 'ryugu-surface2.jpg' },
      { filename: 'ryugu-rotation.gif' },
    ],
    wiki: 'https://en.wikipedia.org/wiki/162173_Ryugu',
  },
});

export const ASTEROIDS = [
  CERES,
  PALLAS,
  JUNO,
  VESTA,
  HEBE,
  IRIS,
  HYGIEA,
  PSYCHE,
  LUTETIA,
  IDA,
  MATHILDE,
  EROS,
  GASPRA,
  STEINS,
  TOUTATIS,
  NEREUS,
  ANNEFRANK,
  BRAILLE,
  ITOKAWA,
  DIDYMOS,
  BENNU,
  DINKINESH,
  RYUGU,
];

export const CG67P = celestialBodyWithDefaults({
  id: asCelestialBodyId('cg67p'),
  type: CelestialBodyType.COMET,
  name: '67P/Churyumov–Gerasimenko',
  shortName: '67P/C–G',
  influencedBy: [SOL.id],
  mass: 1e13, // kg
  radius: 2000, // m (average radius based on dimensions)
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2460000.5'),
    eccentricity: 0.64989,
    semiMajorAxis: 3.457 * AU,
    inclination: 3.8719,
    longitudeAscending: 36.33,
    argumentOfPeriapsis: 22.15,
    meanAnomaly: 73.57,
    rotation: {
      axialTilt: 52,
      siderealPeriod: 12.4 * Time.HOUR,
    },
  },
  assets: {
    thumbnail: 'cg67p-thumb.jpg',
    gallery: [{ filename: 'cg67p-animation.gif' }, { filename: 'cg67p-thumb2.jpg' }, { filename: 'cg67p-thumb3.jpg' }],
    wiki: 'https://en.wikipedia.org/wiki/67P/Churyumov%E2%80%93Gerasimenko',
  },
});

export const HALLEY = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: "Halley's Comet (1P/Halley)",
  shortName: 'Halley',
  influencedBy: [SOL.id],
  mass: 2.2e14,
  radius: 5.5e3, // average radius based on dimensions
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2474040.5'),
    eccentricity: 0.96658,
    semiMajorAxis: 17.737 * AU,
    inclination: 161.96,
    longitudeAscending: 59.396,
    argumentOfPeriapsis: 112.05,
    meanAnomaly: 0.07323,
  },
  assets: {
    thumbnail: 'halley-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Halley%27s_Comet',
  },
});

export const HALE_BOPP = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: 'Hale-Bopp (C/1995 O1)',
  shortName: 'Hale-Bopp',
  influencedBy: [SOL.id],
  mass: 1.3e19,
  radius: 30e3, // average radius based on dimensions
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459837.5'),
    eccentricity: 0.99498,
    semiMajorAxis: 177.43 * AU,
    inclination: 89.3,
    longitudeAscending: 282.73,
    argumentOfPeriapsis: 130.41,
    meanAnomaly: 3.8784,
  },
  assets: {
    thumbnail: 'hale-bopp-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Comet_Hale%E2%80%93Bopp',
  },
});

export const BORRELLY = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: "Borrelly's Comet (19P/Borrelly)",
  shortName: 'Borrelly',
  influencedBy: [SOL.id],
  mass: 2e13,
  radius: 2.4e3,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459279.5'),
    eccentricity: 0.6379142835777641,
    semiMajorAxis: 3.606964684326838 * AU,
    inclination: 29.3186623395529,
    longitudeAscending: 74.30084258786506,
    argumentOfPeriapsis: 351.8616063839783,
    meanAnomaly: 312.1229200779977,
  },
  assets: {
    thumbnail: 'borrelly-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/19P/Borrelly',
  },
});

export const TEMPEL = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: '9P/Tempel 1',
  shortName: 'Tempel 1',
  influencedBy: [SOL.id],
  mass: 7.2e13,
  radius: 3.2e3, // oblong
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2457461.5'),
    eccentricity: 0.5097153029324003,
    semiMajorAxis: 3.146206212969314 * AU,
    inclination: 10.47337655895403,
    longitudeAscending: 68.75447718427989,
    argumentOfPeriapsis: 179.1960457087085,
    meanAnomaly: 334.9969963096004,
  },
  assets: {
    thumbnail: 'tempel-1-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Tempel_1',
  },
});

export const HARTLEY = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: '103P/Hartley 2',
  shortName: 'Hartley 2',
  influencedBy: [SOL.id],
  mass: 3e11,
  radius: 570,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2460146.5'),
    eccentricity: 0.6938071328607858,
    semiMajorAxis: 3.475233576688153 * AU,
    inclination: 13.61020331340449,
    longitudeAscending: 219.7506522429561,
    argumentOfPeriapsis: 181.3013988764762,
    meanAnomaly: 347.2946368735635,
  },
  assets: {
    thumbnail: 'hartley-2-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/103P/Hartley',
  },
});

export const WILD = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: '81P/Wild 2',
  shortName: 'Wild 2',
  influencedBy: [SOL.id],
  mass: 2.3e13,
  radius: 2.25e3, // oblong
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458808.5'),
    eccentricity: 0.5373989073846863,
    semiMajorAxis: 3.449745576963111 * AU,
    inclination: 3.237004173608168,
    longitudeAscending: 136.1102208500619,
    argumentOfPeriapsis: 41.72523085114398,
    meanAnomaly: 187.5966814232084,
  },
  assets: {
    thumbnail: 'wild-2-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/81P/Wild',
  },
});

export const GRIGG_SKJELLERUP = celestialBodyWithDefaults({
  type: CelestialBodyType.COMET,
  name: '26P/Grigg–Skjellerup',
  shortName: 'Grigg-Skjellerup',
  influencedBy: [SOL.id],
  radius: 1.3e3,
  mass: estimateCometMass(1.3e3),
  elements: {
    wrt: SOL.id,
    source: SBDB_URL,
    epoch: julianDayToEpoch('JD2456017.5'),
    eccentricity: 0.6396679618697105,
    semiMajorAxis: 3.024224445052753 * AU,
    inclination: 22.45511403015216,
    longitudeAscending: 211.633966473815,
    argumentOfPeriapsis: 1.896085645552865,
    meanAnomaly: 273.4178382900974,
  },
  assets: {
    thumbnail: 'grigg-skjellerup-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/26P/Grigg%E2%80%93Skjellerup',
  },
});

export const COMETS: Array<CelestialBody> = [
  CG67P,
  HALLEY,
  HALE_BOPP,
  BORRELLY,
  TEMPEL,
  HARTLEY,
  WILD,
  GRIGG_SKJELLERUP,
];

export const MARINER_2 = celestialBodyWithDefaults({
  name: 'Mariner 2',
  type: CelestialBodyType.SPACECRAFT,
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD'),
    eccentricity: 0.16278,
    semiMajorAxis: 0.86 * AU,
    inclination: 0,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 203.6,
  radius: 3, // TODO: find real dimensions? not important
  assets: {
    thumbnail: 'mariner-2-thumb.jpg',
    search: 'Mariner 2',
  },
});

export const TESLA_ROADSTER = celestialBodyWithDefaults({
  name: "Elon Musk's Tesla Roadster",
  shortName: 'Roadster',
  type: CelestialBodyType.SPACECRAFT,
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.25591503690056,
    semiMajorAxis: 1.325313962984 * AU,
    inclination: 1.0737669848641,
    longitudeAscending: 316.80045452644,
    argumentOfPeriapsis: 177.89825115403,
    meanAnomaly: 99.302874432786,
  },
  mass: 1300,
  radius: 2,
  assets: { thumbnail: 'roadster-thumb.jpg' },
});

export const SPACECRAFT = [MARINER_2, TESLA_ROADSTER];

export const PLUTO = celestialBodyWithDefaults({
  name: '134340 Pluto',
  shortName: 'Pluto',
  type: CelestialBodyType.DWARF_PLANET,
  // TODO: Charon is large enough that Charon and Pluto co-orbit their barycenter; this is not reflected by this
  //  parent-child relationship
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.2488,
    semiMajorAxis: 5906440628e3,
    inclination: 17.16,
    longitudeAscending: 110.299,
    argumentOfPeriapsis: 113.834,
    meanAnomaly: 14.53,
    rotation: {
      axialTilt: 122.53,
      siderealPeriod: 6 * Time.DAY + 9 * Time.HOUR + 17.6 * Time.MINUTE, // - 6 days 9 hr 17.6 min (sideways)
    },
  },
  mass: 1.3025e22,
  radius: 1188.3e3,
  style: { fgColor: '#E7C7A4' },
  facts: [{ label: 'class', value: 'plutino' }],
  assets: {
    thumbnail: 'pluto-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Pluto',
  },
});

// TODO: Charon and Pluto's other moons are inclined relative to Pluto's equator
export const CHARON = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Charon',
  influencedBy: [SOL.id, PLUTO.id],
  elements: {
    wrt: PLUTO.id,
    epoch: julianDayToEpoch('JD2452600.5'),
    eccentricity: 0.000161,
    semiMajorAxis: 19595.764e3,
    inclination: 0.08,
    longitudeAscending: 223.046,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0, // TODO: find
    rotation: {
      axialTilt: 0, // TODO: verify -- pretty sure it's not tilted WRT its orbit around Pluto
      siderealPeriod: 6 * Time.DAY + 9 * Time.HOUR + 17 * Time.MINUTE + 35.89, // mutually tidally locked w/ pluto
    },
  },
  mass: 1.586e21,
  radius: 606e3,
  assets: {
    thumbnail: 'charon-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Charon_(moon)',
  },
});

export const STYX = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Styx',
  influencedBy: [SOL.id, PLUTO.id],
  elements: {
    wrt: PLUTO.id,
    epoch: julianDayToEpoch('JD2455743.5'), // 2011-July-01-UTC
    eccentricity: 0.005787,
    semiMajorAxis: 42656e3,
    inclination: 0.809,
    longitudeAscending: 183.4,
    argumentOfPeriapsis: 296.1,
    meanAnomaly: 0, // TODO
    rotation: {
      axialTilt: 82,
      siderealPeriod: 3.24 * Time.DAY,
    },
  },
  mass: 7.5e15,
  radius: 12e3 / 2, // rough; not spherical
  assets: {
    thumbnail: 'styx-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Styx_(moon)',
  },
});

export const NIX = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Nix',
  influencedBy: [SOL.id, PLUTO.id],
  elements: {
    wrt: PLUTO.id,
    epoch: julianDayToEpoch('JD2455743.5'), // 2011-July-01-UTC
    eccentricity: 0.002036,
    semiMajorAxis: 48694e3,
    inclination: 0.133,
    longitudeAscending: 3.7,
    argumentOfPeriapsis: 221.6,
    meanAnomaly: 0, // TODO
  },
  mass: 2.6e16,
  radius: 35e3 / 2, // not spherical
  assets: {
    thumbnail: 'nix-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Nix_(moon)',
  },
});

export const KERBEROS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Kerberos',
  influencedBy: [SOL.id, PLUTO.id],
  elements: {
    wrt: PLUTO.id,
    epoch: julianDayToEpoch('JD2455743.5'), // 2011-July-01-UTC
    eccentricity: 0.00328,
    semiMajorAxis: 57783e3,
    inclination: 0.389,
    longitudeAscending: 225.2,
    argumentOfPeriapsis: 187.6,
    meanAnomaly: 0, // TODO
    rotation: {
      axialTilt: 96, // TODO: verify that this is WRT its own orbit
      siderealPeriod: 5.31 * Time.DAY,
    },
  },
  mass: 1.65e16,
  radius: 12e3 / 2, // not spherical
  assets: {
    thumbnail: 'kerberos-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Kerberos_(moon)',
  },
});

export const HYDRA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Hydra',
  influencedBy: [SOL.id, PLUTO.id],
  elements: {
    wrt: PLUTO.id,
    epoch: julianDayToEpoch('JD2455743.5'), // 2011-July-01-UTC
    eccentricity: 0.005862,
    semiMajorAxis: 64738e3,
    inclination: 0.242,
    longitudeAscending: 189.7,
    argumentOfPeriapsis: 192.2,
    meanAnomaly: 0, // TODO
  },
  mass: 3.01e16,
  radius: 19e3, // not spherical
  assets: {
    thumbnail: 'hydra-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Hydra_(moon)',
  },
});

export const PLUTO_SYSTEM = [PLUTO, CHARON, STYX, NIX, KERBEROS, HYDRA];

export const QUAOAR = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '50000 Quaoar',
  shortName: 'Quaoar',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459000.5'),
    eccentricity: 0.04106,
    semiMajorAxis: 43.694 * AU,
    inclination: 7.9895,
    longitudeAscending: 188.927,
    argumentOfPeriapsis: 147.48,
    meanAnomaly: 301.104,
  },
  mass: 1.2e21,
  radius: 545e3,
  assets: {
    thumbnail: 'quaoar-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Quaoar',
  },
});

export const SEDNA = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '90377 Sedna',
  shortName: 'Sedna',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_OORT_CLOUD,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458900.5'),
    eccentricity: 0.8496,
    semiMajorAxis: 506 * AU,
    inclination: 11.9307,
    longitudeAscending: 144.248,
    argumentOfPeriapsis: 311.352,
    meanAnomaly: 358.117,
  },
  mass: 2.5e21, // very rough estimate
  radius: 906e3 / 2,
  facts: [{ label: 'class', value: 'sednoid' }],
  assets: {
    thumbnail: 'sedna-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Sedna_(dwarf_planet)',
  },
});

export const ORCUS = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '90482 Orcus',
  shortName: 'Orcus',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459000.5'),
    eccentricity: 0.22701,
    semiMajorAxis: 39.174 * AU,
    inclination: 20.592,
    longitudeAscending: 268.799,
    argumentOfPeriapsis: 72.31,
    meanAnomaly: 181.735,
  },
  mass: 6.348e20, // very rough estimate
  radius: 910e3 / 2,
  facts: [{ label: 'class', value: 'plutino' }],
  assets: {
    thumbnail: 'orcus-thumb.gif',
    wiki: 'https://en.wikipedia.org/wiki/Orcus_(dwarf_planet)',
  },
});

export const ERIS = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '136199 Eris',
  shortName: 'Eris',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459000.5'),
    eccentricity: 0.43607,
    semiMajorAxis: 67.864 * AU,
    inclination: 44.04,
    longitudeAscending: 35.951,
    argumentOfPeriapsis: 151.639,
    meanAnomaly: 205.989,
  },
  mass: 1.6466e22,
  radius: 1163e3,
  assets: {
    thumbnail: 'eris-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Eris_(dwarf_planet)',
  },
  // TODO: add moon Dysnomia (rough orbital elements are known)
});

export const HAUMEA = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '136108 Haumea',
  shortName: 'Haumea',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459200.5'),
    eccentricity: 0.19642,
    semiMajorAxis: 43.116 * AU,
    inclination: 28.2137,
    longitudeAscending: 122.167,
    argumentOfPeriapsis: 239.041,
    meanAnomaly: 218.205,
  },
  mass: 4.006e21,
  radius: 780e3,
  assets: {
    thumbnail: 'haumea-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Haumea',
  },
});

export const MAKEMAKE = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '136472 Makemake',
  shortName: 'Makemake',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458900.5'),
    eccentricity: 0.16126,
    semiMajorAxis: 45.43 * AU,
    inclination: 28.9835,
    longitudeAscending: 79.62,
    argumentOfPeriapsis: 294.834,
    meanAnomaly: 165.514,
  },
  mass: 3.1e21,
  radius: 715e3,
  assets: {
    thumbnail: 'makemake-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Makemake',
  },
});

export const ARROKOTH = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '486958 Arrokoth', // also known as Ultima Thule
  shortName: 'Arrokoth',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: 7.485e14, // kg
  radius: 18e3, // m (average radius based on length of 36 km)
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458600.5'),
    eccentricity: 0.04172,
    semiMajorAxis: 44.581 * AU,
    inclination: 2.4512, // degrees
    longitudeAscending: 158.998, // degrees
    argumentOfPeriapsis: 174.418, // degrees
    meanAnomaly: 316.551, // degrees
  },
  assets: {
    thumbnail: 'arrokoth-thumb.jpg',
    gallery: [{ filename: 'arrokoth-rotation.gif' }],
    wiki: 'https://en.wikipedia.org/wiki/486958_Arrokoth',
  },
});

export const GONGGONG = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '225088 Gonggong',
  shortName: 'Gonggong',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: 1.75e21, // kg
  radius: 615e3, // m
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459200.5'),
    eccentricity: 0.49943,
    semiMajorAxis: 67.485 * AU,
    inclination: 30.6273, // degrees
    longitudeAscending: 336.8573, // degrees
    argumentOfPeriapsis: 207.6675, // degrees
    meanAnomaly: 106.496, // degrees
  },
  assets: {
    thumbnail: 'gonggong-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Gonggong_(dwarf_planet)',
  },
});

export const VP113 = celestialBodyWithDefaults({
  type: CelestialBodyType.DWARF_PLANET,
  name: '2012 VP113',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_OORT_CLOUD,
  mass: 1e21, // very very rough guess -- not known
  radius: 574e3 / 2, // m
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459800.5'),
    eccentricity: 0.7036,
    semiMajorAxis: 271.5 * AU,
    inclination: 24.0563, // degrees
    longitudeAscending: 90.787, // degrees
    argumentOfPeriapsis: 293.8, // degrees
    meanAnomaly: 3.5, // degrees
  },
  facts: [{ label: 'class', value: 'sednoid' }],
  assets: {
    thumbnail: 'vp113-thumb.gif',
    search: '2012 VP113',
    wiki: 'https://en.wikipedia.org/wiki/2012_VP113',
  },
});

export const LELEAKUHONUA = celestialBodyWithDefaults({
  id: asCelestialBodyId('leleakuhonua'),
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '541132 Leleākūhonua',
  shortName: 'Leleākūhonua',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_OORT_CLOUD,
  mass: 1e20, // unknown, extremely rough guess
  radius: 110e3 / 2,
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459000.5'),
    eccentricity: 0.93997,
    semiMajorAxis: 1085 * AU,
    inclination: 11.654, // degrees
    longitudeAscending: 300.78, // degrees
    argumentOfPeriapsis: 117.778, // degrees
    meanAnomaly: 359.418, // degrees
  },
  facts: [{ label: 'class', value: 'sednoid' }],
  assets: {
    thumbnail: 'leleakuhonua-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/541132_Lele%C4%81k%C5%ABhonua',
  },
});

export const RR205 = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '2021 RR205',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_OORT_CLOUD,
  mass: estimateAsteroidMass(150e3), // unknown
  radius: 150e3, // very rough estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2460000.5'),
    eccentricity: 0.94395,
    semiMajorAxis: 990.9 * AU,
    inclination: 7.644,
    longitudeAscending: 108.345,
    argumentOfPeriapsis: 208.574,
    meanAnomaly: 0.363,
  },
  facts: [{ label: 'class', value: 'sednoid (disputed)' }],
  assets: {
    thumbnail: 'rr205-thumb.png',
    wiki: 'https://en.wikipedia.org/wiki/2021_RR205',
  },
});

export const FARFAROUT = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '2018 AG37 (FarFarOut)',
  shortName: 'FarFarOut',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.INNER_OORT_CLOUD,
  mass: estimateAsteroidMass(200e3), // unknown
  radius: 200e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2458540.5'),
    eccentricity: 0.655,
    semiMajorAxis: 80.2 * AU,
    inclination: 18.68,
    longitudeAscending: 68.35,
    argumentOfPeriapsis: 231.9,
    meanAnomaly: 186.9,
  },
  assets: {
    thumbnail: 'farfarout-thumb.gif',
    wiki: 'https://en.wikipedia.org/wiki/2018_AG37',
  },
});

export const ALBION = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '15760 Albion',
  shortName: 'Albion',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: estimateAsteroidMass(60e3), // unknown
  radius: 60e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459000.5'),
    eccentricity: 0.07096,
    semiMajorAxis: 43.925 * AU,
    inclination: 2.1797,
    longitudeAscending: 359.276,
    argumentOfPeriapsis: 0.7765,
    meanAnomaly: 34.041,
  },
  assets: {
    thumbnail: 'albion-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/15760_Albion',
  },
});

export const ARAWN = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '15810 Arawn',
  shortName: 'Arawn',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: estimateAsteroidMass(70e3), // unknown
  radius: 70e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2457800.5'),
    eccentricity: 0.1206,
    semiMajorAxis: 39.48 * AU,
    inclination: 3.8074,
    longitudeAscending: 144.69,
    argumentOfPeriapsis: 101.89,
    meanAnomaly: 30.638,
  },
  facts: [{ label: 'class', value: 'plutino' }],
  assets: {
    thumbnail: 'arawn-thumb.gif',
    wiki: 'https://en.wikipedia.org/wiki/15810_Arawn',
  },
});

export const VARUNA = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '20000 Varuna',
  shortName: 'Varuna',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: estimateAsteroidMass(330e3), // unknown
  radius: 330e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459000.5'),
    eccentricity: 0.05617,
    semiMajorAxis: 42.718 * AU,
    inclination: 17.221,
    longitudeAscending: 97.372,
    argumentOfPeriapsis: 262.22,
    meanAnomaly: 119.121,
    rotation: {
      siderealPeriod: 6.343572 * Time.HOUR, // this is the synodic period, close to sidereal but not exact
      axialTilt: 0,
    },
  },
  facts: [{ label: 'class', value: 'cubewano' }],
  assets: {
    thumbnail: 'varuna-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/20000_Varuna',
  },
});

export const TX300 = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '(55636) 2002 TX300',
  shortName: '2002 TX300',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: 1.2e19, // estimate
  radius: 143e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2457400.5'),
    eccentricity: 0.12174,
    semiMajorAxis: 43.116 * AU,
    inclination: 25.87838,
    longitudeAscending: 324.6984,
    argumentOfPeriapsis: 338.958,
    meanAnomaly: 73.7618,
    rotation: {
      siderealPeriod: 12.101 * Time.HOUR,
      axialTilt: 0,
    },
  },
  facts: [{ label: 'class', value: 'cubewano' }],
  assets: {
    thumbnail: 'tx300-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/(55636)_2002_TX300',
  },
});

export const CHAOS = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '19521 Chaos',
  shortName: 'Chaos',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: estimateAsteroidMass(320e3), // estimate
  radius: 320e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2457400.5'),
    eccentricity: 0.10567,
    semiMajorAxis: 45.796 * AU,
    inclination: 12.0502,
    longitudeAscending: 50.0239,
    argumentOfPeriapsis: 58.4097,
    meanAnomaly: 337.2998,
  },
  facts: [{ label: 'class', value: 'cubewano' }],
  assets: {
    thumbnail: 'chaos-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/19521_Chaos',
    search: '19521 Chaos',
  },
});

export const IXION = celestialBodyWithDefaults({
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '28978 Ixion',
  shortName: 'Ixion',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.KUIPER_BELT,
  mass: estimateAsteroidMass(354.8e3), // estimate
  radius: 354.8e3, // estimate
  elements: {
    wrt: SOL.id,
    epoch: julianDayToEpoch('JD2459200.5'),
    eccentricity: 0.24579,
    semiMajorAxis: 39.802 * AU,
    inclination: 19.6,
    longitudeAscending: 71.011,
    argumentOfPeriapsis: 298.314,
    meanAnomaly: 289.587,
  },
  facts: [{ label: 'class', value: 'plutino' }],
  assets: {
    thumbnail: 'ixion-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/28978_Ixion',
  },
});

export const TRANS_NEPTUNIAN_OBJECTS: Array<CelestialBody> = [
  QUAOAR,
  SEDNA,
  ORCUS,
  HAUMEA,
  ERIS,
  MAKEMAKE,
  GONGGONG,
  ARROKOTH,
  VP113,
  LELEAKUHONUA,
  RR205,
  FARFAROUT,
  ALBION,
  ARAWN,
  VARUNA,
  TX300,
  CHAOS,
  IXION,
  // OUMUAMUA,
];

export const JUPITER = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Jupiter',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.OUTER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.0489,
    semiMajorAxis: 778340821e3,
    inclination: 1.303,
    longitudeAscending: 100.464,
    argumentOfPeriapsis: 273.867,
    meanAnomaly: 20.02,
    rotation: {
      axialTilt: 3.13,
      siderealPeriod: 9 * Time.HOUR + 55 * Time.MINUTE + 30, // 9 hr 55 min 30 sec
    },
  },
  mass: 1.8982e27,
  radius: 69911e3,
  style: { fgColor: '#e9be76' },
  assets: {
    thumbnail: 'jupiter-thumb.jpg',
    texture: 'jupiter-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Jupiter',
  },
});

export const IO = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Io',
  influencedBy: [SOL.id, JUPITER.id],
  elements: {
    wrt: JUPITER.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0041,
    semiMajorAxis: 421800e3,
    inclination: 0.05 + JUPITER.elements.rotation!.axialTilt,
    longitudeAscending: 0, // approximate
    argumentOfPeriapsis: 0, // approximated for circular orbits
    meanAnomaly: 0,
  },
  mass: 8.931938e22,
  radius: 1821.6e3,
  style: { fgColor: '#fcf794' },
  assets: {
    thumbnail: 'io-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Io_(moon)',
  },
});

export const EUROPA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Europa',
  influencedBy: [SOL.id, JUPITER.id],
  elements: {
    wrt: JUPITER.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0094,
    semiMajorAxis: 671100e3,
    inclination: 0.466 + JUPITER.elements.rotation!.axialTilt,
    longitudeAscending: 0, // approximate
    argumentOfPeriapsis: 0, // approximated for circular orbits
    meanAnomaly: 0,
  },
  mass: 4.799844e22,
  radius: 1560.8e3,
  style: { fgColor: '#b6d3d1' },
  assets: {
    thumbnail: 'europa-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Europa_(moon)',
  },
  facts: [
    {
      label: 'volume of water',
      value:
        "Europa's subsurface ocean is believed to contain about twice as much water as all of Earth's oceans, combined",
    },
  ],
});

export const GANYMEDE = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Ganymede',
  influencedBy: [SOL.id, JUPITER.id],
  elements: {
    wrt: JUPITER.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0013,
    semiMajorAxis: 1070400e3,
    inclination: 0.177 + JUPITER.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.4819e23,
  radius: 2634.1e3,
  assets: {
    thumbnail: 'ganymede-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Ganymede_(moon)',
  },
});

export const CALLISTO = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Callisto',
  influencedBy: [SOL.id, JUPITER.id],
  elements: {
    wrt: JUPITER.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0074,
    semiMajorAxis: 1882700e3,
    inclination: 2.017,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.075938e23,
  radius: 2410.3e3,
  assets: {
    thumbnail: 'callisto-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Callisto_(moon)',
  },
});

// TODO: there are more moons
// TODO: at the very least, Amalthea?
export const JUPITER_SYSTEM = [JUPITER, IO, EUROPA, GANYMEDE, CALLISTO];

export const SATURN = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Saturn',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.OUTER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.0565,
    semiMajorAxis: 1433.53e9,
    inclination: 2.485,
    longitudeAscending: 113.665,
    argumentOfPeriapsis: 339.392,
    meanAnomaly: 317.02,
    rotation: {
      axialTilt: 26.73,
      siderealPeriod: 10 * Time.HOUR + 32 * Time.MINUTE + 35, // 10 hr 32 min 35 sec
    },
  },
  mass: 5.6834e26,
  radius: 58232e3,
  rings: [
    // TODO: separate ring objects for different bands? only have one texture for now
    {
      name: 'DCBAF', // represents the main rings, from innermost to outermost
      start: 70000e3, // rough value from Saturn's center for start of D ring
      end: 142000e3, // rough value from Saturn's center for end of F ring
      texture: 'saturn-rings-texture.png',
    },
  ],
  style: { fgColor: '#d7be87' },
  assets: {
    thumbnail: 'saturn-thumb.jpg',
    texture: 'saturn-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Saturn',
  },
});

export const MIMAS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Mimas',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0196,
    semiMajorAxis: 185540e3,
    inclination: 1.574 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 3.7493e19,
  radius: 198.2e3,
  assets: {
    thumbnail: 'mimas-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Mimas',
  },
});

export const ENCELADUS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Enceladus',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0047,
    semiMajorAxis: 238040e3,
    inclination: 0.009 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.08022e20,
  radius: 252.1e3,
  assets: {
    thumbnail: 'enceladus-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Enceladus',
  },
});

export const TETHYS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Tethys',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0001,
    semiMajorAxis: 294670e3,
    inclination: 1.091 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 6.17449e20,
  radius: 531.1e3,
  assets: {
    thumbnail: 'tethys-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Tethys_(moon)',
  },
});

export const DIONE = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Dione',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0022,
    semiMajorAxis: 377420e3,
    inclination: 0.028 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.095452e21,
  radius: 561.4e3,
  assets: {
    thumbnail: 'dione-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Dione_(moon)',
  },
});

export const RHEA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Rhea',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.001,
    semiMajorAxis: 527070e3,
    inclination: 0.345 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 2.306518e21,
  radius: 763.8e3,
  assets: {
    thumbnail: 'rhea-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Rhea_(moon)',
  },
});

export const TITAN = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Titan',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0288,
    semiMajorAxis: 1221870e3,
    inclination: 0.34854 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.3452e23,
  radius: 2574.7e3,
  style: { fgColor: '#f1e193' },
  assets: {
    thumbnail: 'titan-thumb.jpg',
    gallery: [{ filename: 'huygens-descent.mp4' }, { filename: 'huygens.jpg' }],
    wiki: 'https://en.wikipedia.org/wiki/Titan_(moon)',
  },
});

export const IAPETUS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Iapetus',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0286,
    semiMajorAxis: 3560820e3,
    inclination: 15.47 + SATURN.elements.rotation!.axialTilt,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.805635e21,
  radius: 734.5e3,
  assets: {
    thumbnail: 'iapetus-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Iapetus_(moon)',
  },
});

export const HYPERION = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Hyperion',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.1230061,
    semiMajorAxis: 1481009e3,
    inclination: 0.43 + SATURN.elements.rotation!.axialTilt, // 0.43ª relative to saturn's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 5.551e18,
  radius: 135e3,
  assets: {
    thumbnail: 'hyperion-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Hyperion_(moon)',
  },
});

export const PHOEBE = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Phoebe',
  influencedBy: [SOL.id, SATURN.id],
  elements: {
    wrt: SATURN.id,
    epoch: julianDayToEpoch('JD2460000.5'),
    eccentricity: 0.1796752,
    semiMajorAxis: 0.0861776 * AU, // 12960000e3,
    inclination: 151.78 + SATURN.elements.rotation!.axialTilt, // 0.43ª relative to saturn's equator
    longitudeAscending: 269.35082,
    argumentOfPeriapsis: 15.26338,
    meanAnomaly: 174.44144,
    rotation: {
      axialTilt: 152.14,
      siderealPeriod: 9.2735 * Time.HOUR,
    },
  },
  mass: 8.3123e18,
  radius: 106.5e3,
  assets: {
    thumbnail: 'phoebe-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Phoebe_(moon)',
  },
});

export const SATURN_SYSTEM = [SATURN, MIMAS, ENCELADUS, TETHYS, DIONE, RHEA, TITAN, IAPETUS, HYPERION, PHOEBE];

export const URANUS = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Uranus',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.OUTER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000,
    eccentricity: 0.04717,
    semiMajorAxis: 19.19126 * AU,
    inclination: 0.773,
    longitudeAscending: 74.006,
    argumentOfPeriapsis: 96.998857,
    meanAnomaly: 142.2386,
    rotation: {
      axialTilt: 82.23, // TODO: retrograde -- modeled correctly?
      siderealPeriod: -17 * Time.HOUR + 14 * Time.MINUTE + 24, // -17 hr 14 min 24 sec
    },
  },
  mass: 8.681e25,
  radius: 25362e3,
  style: { fgColor: '#9bcee6' },
  // rings: [], // TODO
  assets: {
    thumbnail: 'uranus-thumb.jpg',
    texture: 'uranus-texture.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Uranus',
  },
});

export const PUCK = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Puck',
  influencedBy: [SOL.id, URANUS.id],
  elements: {
    wrt: URANUS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.00012,
    semiMajorAxis: 86004.444e3,
    inclination: 0.31921 + URANUS.elements.rotation!.axialTilt, // inclination WRT Uranus's equator; offset by axial tilt
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.91e18,
  radius: 81e3 / 2,
  assets: {
    thumbnail: 'puck-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Puck_(moon)',
  },
});

export const MIRANDA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Miranda',
  influencedBy: [SOL.id, URANUS.id],
  elements: {
    wrt: URANUS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0013,
    semiMajorAxis: 129390e3,
    inclination: 4.232 + URANUS.elements.rotation!.axialTilt, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 6.293e19,
  radius: 235.8e3,
  assets: {
    thumbnail: 'miranda-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Miranda_(moon)',
  },
});

export const ARIEL = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Ariel',
  influencedBy: [SOL.id, URANUS.id],
  elements: {
    wrt: URANUS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0012,
    semiMajorAxis: 190900e3,
    inclination: 0.26 + URANUS.elements.rotation!.axialTilt, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.2331e21,
  radius: 578.9e3,
  assets: {
    thumbnail: 'ariel-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Ariel_(moon)',
  },
});

export const UMBRIEL = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Umbriel',
  influencedBy: [SOL.id, URANUS.id],
  elements: {
    wrt: URANUS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0039,
    semiMajorAxis: 266000e3,
    inclination: 0.128 + URANUS.elements.rotation!.axialTilt, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.2885e21,
  radius: 584.7e3,
  assets: {
    thumbnail: 'umbriel-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Umbriel',
  },
});

export const TITANIA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Titania',
  influencedBy: [SOL.id, URANUS.id],
  elements: {
    wrt: URANUS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0011,
    semiMajorAxis: 435910e3,
    inclination: 0.34 + URANUS.elements.rotation!.axialTilt, // inclination WRT Uranus's equator; offset by axial tilt
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 3.455e21,
  radius: 788.4e3,
  assets: {
    thumbnail: 'titania-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Titania_(moon)',
  },
});

export const OBERON = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Oberon',
  influencedBy: [SOL.id, URANUS.id],
  elements: {
    wrt: URANUS.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0014,
    semiMajorAxis: 583520e3,
    inclination: 0.058 + URANUS.elements.rotation!.axialTilt, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 3.1104e21,
  radius: 761.4e3,
  assets: {
    thumbnail: 'oberon-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Oberon_(moon)',
  },
});

export const URANUS_SYSTEM = [URANUS, PUCK, MIRANDA, ARIEL, UMBRIEL, TITANIA, OBERON];

export const NEPTUNE = celestialBodyWithDefaults({
  type: CelestialBodyType.PLANET,
  name: 'Neptune',
  influencedBy: [SOL.id],
  orbitalRegime: OrbitalRegimeId.OUTER_SYSTEM,
  elements: {
    wrt: SOL.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.008678,
    semiMajorAxis: 4503443661e3,
    inclination: 1.77,
    longitudeAscending: 131.783,
    argumentOfPeriapsis: 273.187,
    meanAnomaly: 259.883,
    rotation: {
      axialTilt: 28.32,
      siderealPeriod: 16 * Time.HOUR + 6.6 * Time.MINUTE, // 16 hr 6.6 min
    },
  },
  mass: 1.02409e26,
  radius: 24622e3,
  style: { fgColor: '#5a7cf6' },
  assets: {
    thumbnail: 'neptune-thumb.jpg',
    texture: 'neptune-texture.jpg',
    gallery: [{ filename: 'neptune-moons.png', caption: 'Captured by JWST' }],
    wiki: 'https://en.wikipedia.org/wiki/Neptune',
  },
});

export const TRITON = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Triton',
  influencedBy: [SOL.id, NEPTUNE.id],
  elements: {
    wrt: NEPTUNE.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.000016,
    semiMajorAxis: 354759e3,
    inclination: 129.608, // to Neptune's orbit -- is this the right inclination to use?
    longitudeAscending: 177.70910343, // TODO: some uncertainty with these two values
    argumentOfPeriapsis: 260.64357,
    meanAnomaly: 0,
    rotation: {
      axialTilt: 0,
      siderealPeriod: 5 * Time.DAY + 21 * Time.HOUR + 2 * Time.MINUTE + 53, // 5 d, 21 h, 2 min, 53 s
    },
  },
  mass: 2.1389e22,
  radius: 1353.4e3,
  assets: {
    thumbnail: 'triton-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Triton_(moon)',
  },
});

export const PROTEUS = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Proteus',
  influencedBy: [SOL.id, NEPTUNE.id],
  elements: {
    wrt: NEPTUNE.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.0005,
    semiMajorAxis: 117646e3,
    inclination: 0.524 + NEPTUNE.elements.rotation!.axialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.5e19, // wide uncertainty bars
  radius: 209e3,
  assets: {
    thumbnail: 'proteus-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Proteus_(moon)',
  },
});

export const NEREID = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Nereid',
  influencedBy: [SOL.id, NEPTUNE.id],
  elements: {
    wrt: NEPTUNE.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.749,
    semiMajorAxis: 5504000e3,
    inclination: 5.8, // to the ecliptic
    longitudeAscending: 326.0,
    argumentOfPeriapsis: 290.3,
    meanAnomaly: 318.0,
  },
  mass: 3.57e19,
  radius: 357e3 / 2,
  assets: {
    thumbnail: 'nereid-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Nereid_(moon)',
  },
});

export const DESPINA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Despina',
  influencedBy: [SOL.id, NEPTUNE.id],
  elements: {
    wrt: NEPTUNE.id,
    epoch: J2000, // TODO: verify
    eccentricity: 0.00038,
    semiMajorAxis: 52525.95e3,
    inclination: 0.216 + NEPTUNE.elements.rotation!.axialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.1e18, // high uncertainty
  radius: 75e3,
  assets: {
    thumbnail: 'despina-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Despina_(moon)',
  },
});

export const LARISSA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Larissa',
  influencedBy: [SOL.id, NEPTUNE.id],
  elements: {
    wrt: NEPTUNE.id,
    epoch: julianDayToEpoch('JD2447756.5'), // Epoch 18 August 1989
    eccentricity: 0.001393,
    semiMajorAxis: 73548.26e3,
    inclination: 0.251 + NEPTUNE.elements.rotation!.axialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.5e18, // very high uncertainty
  radius: 97e3,
  assets: {
    thumbnail: 'larissa-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Larissa_(moon)',
  },
});

export const GALATEA = celestialBodyWithDefaults({
  type: CelestialBodyType.MOON,
  name: 'Galatea',
  influencedBy: [SOL.id, NEPTUNE.id],
  elements: {
    wrt: NEPTUNE.id,
    epoch: julianDayToEpoch('JD2447756.5'), // Epoch 18 August 1989
    eccentricity: 0.00022,
    semiMajorAxis: 61952.57e3,
    inclination: 0.052 + NEPTUNE.elements.rotation!.axialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.5e18, // very high uncertainty
  radius: 97e3,
  assets: {
    thumbnail: 'galatea-thumb.jpg',
    wiki: 'https://en.wikipedia.org/wiki/Galatea_(moon)',
  },
});

// TODO: there are more moons
export const NEPTUNE_SYSTEM = [NEPTUNE, TRITON, DESPINA, GALATEA, LARISSA, PROTEUS, NEREID];

export const SOLAR_SYSTEM = [
  SOL,
  MERCURY,
  VENUS,
  ...EARTH_SYSTEM,
  ...MARS_SYSTEM,
  ...JUPITER_SYSTEM,
  ...SATURN_SYSTEM,
  ...URANUS_SYSTEM,
  ...NEPTUNE_SYSTEM,
  ...PLUTO_SYSTEM,
  // position these last such that they are underneath other objects
  ...ASTEROIDS,
  ...COMETS,
  ...TRANS_NEPTUNIAN_OBJECTS,
  // ...SPACECRAFT, // TODO: remove these entirely? clash with new spacecraft definitions
];
