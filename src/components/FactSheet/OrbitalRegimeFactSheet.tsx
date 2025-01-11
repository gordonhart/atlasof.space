import { Box, Stack, Title } from '@mantine/core';
import { memo, useMemo } from 'react';
import { DEFAULT_ASTEROID_COLOR } from '../../lib/bodies.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, HeliocentricOrbitalRegime, OrbitalRegime } from '../../lib/types.ts';
import { AddSmallBodyButton } from './AddSmallBodyButton.tsx';
import { BodyCard } from './BodyCard.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';

type Props = {
  regime: OrbitalRegime;
  settings: Settings;
  updateSettings: UpdateSettings;
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
  const isAsteroidBelt = regime.name === HeliocentricOrbitalRegime.ASTEROID_BELT;
  const bodiesInRegime = useMemo(
    () => settings.bodies.filter(body => body.orbitalRegime === regime.name),
    [regime.name, JSON.stringify(settings.bodies)]
  );

  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={regime.name}
        subTitle="Orbital Regime"
        color={DEFAULT_ASTEROID_COLOR}
        onClose={() => updateSettings({ center: null })}
      />

      <FactSheetSummary obj={regime} />

      <Stack p="md" gap="xs" flex={1}>
        <Title order={5}>{isAsteroidBelt ? 'Asteroids' : 'Celestial Bodies'}</Title>
        {bodiesInRegime.map((body, i) => (
          <BodyCard key={`${body.name}-${i}`} body={body} onClick={() => updateSettings({ center: body.name })} />
        ))}
        {isAsteroidBelt && <AddSmallBodyButton bodies={settings.bodies} addBody={addBody} removeBody={removeBody} />}
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherRegimes regime={regime} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
