import { AU } from './bodies';
import { CelestialBody, KeplerianElements } from './types.ts';
import { parseHTML } from 'linkedom';
import { julianDayToEpoch } from './epoch.ts';

export const MINOR_PLANET_CENTER = 'https://minorplanetcenter.net//iau/NatSats/NaturalSatellites.html';

export function parseMoonsHtml(parent: CelestialBody, html: string): Record<string, KeplerianElements> {
  const { document } = parseHTML(html);
  const results: Record<string, KeplerianElements> = {};

  const bodies = document.querySelectorAll('h2'); // Titles indicate celestial objects
  bodies.forEach(body => {
    const pre = body.nextElementSibling;
    if (pre == null || pre.localName !== 'pre') return;

    const name = body.textContent;
    if (name == null) return;

    const data = pre.textContent ?? '';
    const matches = {
      epoch: data.match(/Epoch\s+(.+?)\s+=\s+(JDT\s+\d+\.\d+)/)?.[2]?.split(' ')[1],
      meanAnomaly: data.match(/M\s+([\d.]+)/)?.[1],
      semiMajorAxis: data.match(/a\s+([\d.]+)/)?.[1],
      eccentricity: data.match(/\ne\s+([\d.]+)/)?.[1],
      inclination: data.match(/Incl\.\s+([\d.]+)/)?.[1],
      longitudeAscending: data.match(/Node\s+([\d.]+)/)?.[1],
      argumentOfPeriapsis: data.match(/Peri\.\s+([\d.]+)/)?.[1],
    };

    if (Object.values(matches).some(match => match == null)) return;
    results[name] = {
      wrt: parent.name,
      epoch: julianDayToEpoch(`JD${matches.epoch}`),
      source: MINOR_PLANET_CENTER,
      meanAnomaly: parseFloat(matches.meanAnomaly!),
      eccentricity: parseFloat(matches.eccentricity!),
      semiMajorAxis: parseFloat(matches.semiMajorAxis!) * AU,
      inclination: parseFloat(matches.inclination!),
      longitudeAscending: parseFloat(matches.longitudeAscending!),
      argumentOfPeriapsis: parseFloat(matches.argumentOfPeriapsis!),
    };
  });

  return results;
}
