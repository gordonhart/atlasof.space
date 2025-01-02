export type SmallBodyNotFound = {
  code: string; // e.g. '200'
  moreInfo: string; // e.g. 'https://ssd-api.jpl.nasa.gov/doc/sbdb.html'
  message: string;
};

type SmallBodyElement = {
  name: string; // e.g. 'e'
  value: string; // e.g. '.2226906033843441'
  sigma: string; // e.g. '9.3856E-9'
  title: string; // e.g. 'eccentricity'
  label: string; // e.g. 'e'
  units: string | null; // e.g. 'au'
};

type SmallBodyOrbit = {
  first_obs: string; // e.g. '1893-10-29'
  comment: string | null;
  soln_date: string; // e.g. '2021-05-24 17:55:05'
  cov_epoch: string; // e.g. '2453311.5'
  pe_used: string; // e.g. 'DE441'
  rms: string; // e.g. '.29796'
  condition_code: string; // e.g. '0'
  source: string; // e.g. 'JPL'
  equinox: string; // e.g. 'J2000'
  moid_jup: string; // e.g. '3.29197'
  orbit_id: string; // e.g. '659'
  not_valid_before: string | null;
  moid: string; // e.g. '.15023'
  model_pars: Array<unknown>; // TODO
  last_obs: string; // e.g. '2021-05-13'
  sb_used: string; // e.g. 'SB441-N16'
  n_obs_used: number;
  two_body: unknown; // TODO
  producer: string; // e.g. 'Giorgini'
  t_jup: string; // e.g. '4.582'
  n_dop_obs_used: number;
  epoch: string; // e.g. '2460600.5'
  data_arc: string; // e.g. '46582'
  not_valid_after: unknown; // TODO
  n_del_obs_used: number;
  elements: Array<SmallBodyElement>;
};

type SmallBodyObject = {
  spkid: string; // e.g. '20000433'
  shortname: string; // e.g. '433 Eros'
  fullname: string;
  orbit_class: {
    name: string; // e.g. 'Amor'
    code: string; // e.g. 'AMO'
  };
  neo: boolean;
  pha: boolean;
  kind: string; // e.g. 'an'
  des: string; // e.g. '433'
  orbit_id: string; // e.g. '659'
  prefix: string | null;
};

type SmallBodyPhysicalParameter = {
  name: string; // e.g. 'H';
  value: string; // e.g. '10.41';
  notes: string | null;
  desc: string;
  ref: string; // e.g. 'E2024D82';
  sigma: string | null;
  title: string; // e.g. 'absolute magnitude';
  units: string | null;
};

type SmallBodyDiscovery = {
  location: string; // e.g. 'Socorro'
  cref: string; // e.g. 'MPC batch dated 2013-04-25'
  name: string; // e.g. 'Bennu'
  who: string; // e.g. 'LINEAR'
  discovery: string; // e.g. 'Discovered 1999 Sept. 11 by the Lincoln Laboratory Near-Earth Asteroid Research Team at Socorro.'
  site: unknown; // TODO
  ref: string; // e.g. '20051019/Numbers.arc'
  citation: string; // e.g. "Bennu was an Egyptian mythological figure associated with Osiris, Atum and Ra.  This minor planet is the target of the OSIRIS-REx sample return mission.  OSIRIS-REx's Touch-and-Go Sampler evokes Bennu's image as a heron. Name suggested by Michael Toler Puzio (b. 2004) via a naming contest for students."
  date: string; // e.g. '1999-Sep-11'
};

export type SmallBodyResponse = {
  orbit: SmallBodyOrbit;
  object: SmallBodyObject;
  phys_par: Array<SmallBodyPhysicalParameter>;
  discovery: SmallBodyDiscovery;
  signature: { source: string; version: string };
};

export function isNotFound(obj: unknown): obj is SmallBodyNotFound {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    typeof obj.code === 'string' &&
    'moreInfo' in obj &&
    typeof obj.moreInfo === 'string' &&
    'message' in obj &&
    typeof obj.message === 'string'
  );
}
