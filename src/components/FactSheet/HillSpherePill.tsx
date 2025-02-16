import { Pill } from '@mantine/core';
import { hillRadius } from '../../lib/physics.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { asHillSphereId, CelestialBody } from '../../lib/types.ts';
import { humanDistanceUnits } from '../../lib/utils.ts';
import styles from './RelatedBodies.module.css';

type Props = {
  body: CelestialBody;
  parent: CelestialBody;
  updateSettings: UpdateSettings;
};
export function HillSpherePill({ body, parent, updateSettings }: Props) {
  const { semiMajorAxis: a, eccentricity: e } = body.elements;
  const hillRad = hillRadius(a, e, parent.mass, body.mass);
  const [radValue, radUnits] = humanDistanceUnits(hillRad);
  return (
    <Pill
      className={styles.LinkPill}
      onMouseEnter={() => updateSettings({ hover: asHillSphereId(body.id) })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      {radValue.toLocaleString()} {radUnits}
    </Pill>
  );
}
