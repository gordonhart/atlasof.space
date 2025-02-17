import { matchPath } from 'react-router-dom';
import { SOLAR_SYSTEM } from './data/bodies.ts';
import { SPACECRAFT_ORGANIZATIONS } from './data/organizations.ts';
import { SPACECRAFT } from './data/spacecraft/spacecraft.ts';
import { ItemId } from './state.ts';
import { asCelestialBodyId, asOrbitalRegimeId, asOrganizationId, asSpacecraftId, OrbitalRegimeId } from './types.ts';

export const ROUTE_TEMPLATES = [
  '/:bodyId?',
  '/regime/:regimeId',
  '/spacecraft/:spacecraftId',
  '/organization/:organizationId',
];

export function itemIdAsRoute(itemId: ItemId | null) {
  if (itemId == null) return '/';
  const [type, id] = itemId.split('/', 2);
  if (type === 'body') return `/${id}`;
  if (type === 'regime') return `/regime/${id}`;
  if (type === 'spacecraft') return `/spacecraft/${id}`;
  if (type === 'organization') return `/organization/${id}`;
  return '/'; // fallback, shouldn't get here
}

export function getInitialCenter() {
  const pathname = window.location.pathname;
  const pathMatch = ROUTE_TEMPLATES.find(path => matchPath(path, pathname));
  if (pathMatch == null) return null;
  const match = matchPath(pathMatch, pathname);
  const { bodyId, regimeId, spacecraftId, organizationId } = match?.params ?? {};
  if (bodyId != null) return asCelestialBodyId(bodyId);
  if (regimeId != null) return asOrbitalRegimeId(regimeId);
  if (spacecraftId != null) return asSpacecraftId(spacecraftId);
  if (organizationId != null) return asOrganizationId(organizationId);
  return null;
}

export const ROUTES = [
  null, // root
  ...SOLAR_SYSTEM.map(({ id }) => id),
  ...SPACECRAFT.map(({ id }) => id),
  ...Object.values(SPACECRAFT_ORGANIZATIONS).map(({ id }) => id),
  ...Object.values(OrbitalRegimeId),
].map(itemIdAsRoute);
