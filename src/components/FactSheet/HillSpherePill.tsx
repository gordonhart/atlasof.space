import { Group, Switch } from '@mantine/core';
import { hillRadius } from '../../lib/physics.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { asHillSphereId, CelestialBody } from '../../lib/types.ts';
import { humanDistanceUnits } from '../../lib/utils.ts';

type Props = {
  body: CelestialBody;
  parent: CelestialBody;
  settings: Settings;
  updateSettings: UpdateSettings;
};
export function HillSpherePill({ body, parent, settings, updateSettings }: Props) {
  const { semiMajorAxis: a, eccentricity: e } = body.elements;
  const hillRad = hillRadius(a, e, parent.mass, body.mass);
  const [radValue, radUnits] = humanDistanceUnits(hillRad);
  const id = asHillSphereId(body.id);

  function onToggle() {
    updateSettings(({ toggles, ...prev }) => {
      const newToggles = toggles.has(id) ? [...toggles].filter(toggle => toggle !== id) : [...toggles, id];
      return { ...prev, toggles: new Set(newToggles) };
    });
  }

  const isActive = settings.toggles.has(id);
  return (
    <Group gap={8} wrap="nowrap" fw="normal" fz="xs" c={isActive ? undefined : 'var(--mantine-color-gray-light-color)'}>
      {(radValue > 1e4 ? Number(radValue.toFixed(0)) : radValue).toLocaleString()} {radUnits}
      <Switch size="xs" radius="sm" variant="light" color={body.style.fgColor} checked={isActive} onChange={onToggle} />
    </Group>
  );
}
