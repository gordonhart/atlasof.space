import { Box, Stack, Title } from '@mantine/core';
import { memo, useMemo } from 'react';
import { DEFAULT_ASTEROID_COLOR } from '../../lib/bodies.ts';
import { Settings } from '../../lib/state.ts';
import {
  CelestialBody,
  CelestialBodyType,
  CelestialBodyTypes,
  HeliocentricOrbitalRegime,
  OrbitalRegime,
} from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { AddSmallBodyButton } from './AddSmallBodyButton.tsx';
import { BodyCard } from './BodyCard.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';

type Props = {
  regime: OrbitalRegime;
  settings: Settings;
  updateSettings: (update: Partial<Settings>) => void;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export const OrbitalRegimeFactSheet = memo(function OrbitalRegimeFactSheetComponent({
  regime,
  settings,
  updateSettings,
  addBody,
  removeBody,
}: Props) {
  const bodiesInRegimeByType = useMemo(() => {
    const bodiesInRegime = settings.bodies.filter(body => body.orbitalRegime === regime.name);
    const types = Object.fromEntries(CelestialBodyTypes.map(t => [t, [] as Array<CelestialBody>]));
    return bodiesInRegime.reduce((acc, body) => {
      acc[body.type].push(body);
      return acc;
    }, types);
  }, [regime.name, JSON.stringify(settings.bodies)]);

  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={regime.name}
        subTitle="Orbital Regime"
        color={DEFAULT_ASTEROID_COLOR}
        onClose={() => updateSettings({ center: null })}
      />

      <FactSheetSummary obj={regime} />

      <Stack p="md" gap="lg" flex={1}>
        {Object.entries(bodiesInRegimeByType)
          .filter(([, bodies]) => bodies.length > 0)
          .map(([type, bodies], i) => (
            <Stack gap="xs" key={`${type}-${i}`}>
              <Title order={5}>{celestialBodyTypeName(type as CelestialBodyType, true)}</Title>
              {bodies.map((body, j) => (
                <BodyCard
                  key={`${body.name}-${j}`}
                  body={body}
                  onClick={() => updateSettings({ center: body.name })}
                  onHover={hovered => updateSettings({ hover: hovered ? body.name : null })}
                />
              ))}
              {regime.name === HeliocentricOrbitalRegime.ASTEROID_BELT && type === CelestialBodyType.ASTEROID && (
                <AddSmallBodyButton bodies={settings.bodies} addBody={addBody} removeBody={removeBody} />
              )}
            </Stack>
          ))}
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherRegimes regime={regime} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
