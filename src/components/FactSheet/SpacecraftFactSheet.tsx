import { Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_SPACECRAFT_COLOR, g } from '../../lib/bodies.ts';
import { dateToHumanReadable, epochToDate } from '../../lib/epoch.ts';
import { magnitude, radiansToDegrees } from '../../lib/physics.ts';
import { ModelState, Settings, UpdateSettings } from '../../lib/state.ts';
import { Spacecraft } from '../../lib/types.ts';
import { humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { FactGrid } from './FactGrid.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { SpacecraftPathLegend } from './SpacecraftPathLegend.tsx';

type Props = {
  spacecraft: Spacecraft;
  settings: Settings;
  updateSettings: UpdateSettings;
  model: ModelState;
};

export function SpacecraftFactSheet({ spacecraft, settings, updateSettings, model }: Props) {
  const spacecraftModel = model.spacecraft!;
  const maxGees = useRef(magnitude(spacecraftModel.acceleration) / g);
  const [launchDate, setLaunchDate] = useState<Date | null>(null);
  const [t, tUnits] = humanTimeUnits(spacecraftModel.launchTime != null ? model.time - spacecraftModel.launchTime : 0);

  useEffect(() => {
    if (spacecraftModel.launchTime == null) return;
    setLaunchDate(new Date(Number(epochToDate(settings.epoch)) + spacecraftModel.launchTime * 1000));
  }, [spacecraftModel.launchTime, JSON.stringify(settings.epoch)]);

  maxGees.current = Math.max(magnitude(spacecraftModel.acceleration) / g, maxGees.current);

  // TODO: is this correct? inclination as the angle between Z travel and XY travel
  const inclination = radiansToDegrees(
    Math.atan2(spacecraftModel.velocity[2], magnitude(spacecraftModel.velocity.slice(0, 2)))
  );
  const eclipticHeading = radiansToDegrees(Math.atan2(spacecraftModel.orientation[1], spacecraftModel.orientation[0]));

  const facts = [
    { label: 'mission started', value: launchDate != null ? dateToHumanReadable(launchDate) : 'not launched' },
    { label: 'mission duration', value: `${pluralize(Number(t.toFixed(1)), tUnits)}` },
    { label: 'mass', value: `${spacecraft.mass.toLocaleString()} kg` },
    { label: 'thrust', value: `${spacecraft.thrust.toLocaleString()} N` },
    { label: 'velocity', value: `${(magnitude(spacecraftModel.velocity) / 1e3).toFixed(1)} km/s` },
    { label: 'acceleration', value: `${magnitude(spacecraftModel.acceleration).toFixed(3)} m/s` },
    { label: 'max acceleration', value: `${maxGees.current.toFixed(3)} g` },
    { label: 'crew status', value: maxGees.current > 5 ? 'dead' : 'alive' },
    { label: 'ecliptic heading', value: `${eclipticHeading.toFixed(3)}º` },
    { label: 'inclination', value: `${inclination.toFixed(3)}º` },
    { label: 'engine', value: spacecraft.controls.fire ? 'on' : 'off' },
  ];

  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={spacecraft.name}
        subTitle="Fictional Spacecraft"
        color={DEFAULT_SPACECRAFT_COLOR}
        onClose={() => updateSettings({ center: null })}
        onHover={hovered => updateSettings({ hover: hovered ? spacecraft.name : null })}
      />
      <Stack p="md" gap="xs" flex={1}>
        <FactGrid facts={facts} />
      </Stack>

      <Stack p="md" style={{ justifySelf: 'flex-end' }}>
        <SpacecraftPathLegend color={spacecraft.color} />
      </Stack>
    </Stack>
  );
}
