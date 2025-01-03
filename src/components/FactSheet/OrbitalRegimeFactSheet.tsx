import { CelestialBody, HeliocentricOrbitalRegime, OrbitalRegime } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import { Box, Stack, Title } from '@mantine/core';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { DEFAULT_ASTEROID_COLOR } from '../../lib/bodies.ts';
import { useMemo } from 'react';
import { BodyCard } from './BodyCard.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';
import { AddSmallBodyButton } from './AddSmallBodyButton.tsx';

type Props = {
  regime: OrbitalRegime;
  state: AppState;
  updateState: (update: Partial<AppState>) => void;
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
};
export function OrbitalRegimeFactSheet({ regime, state, updateState, addBody, removeBody }: Props) {
  const isAsteroidBelt = regime.name === HeliocentricOrbitalRegime.ASTEROID_BELT;
  const bodiesInRegime = useMemo(
    () => state.bodies.filter(body => body.orbitalRegime === regime.name),
    [regime.name, JSON.stringify(state.bodies)]
  );

  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={regime.name}
        subTitle="Orbital Regime"
        color={DEFAULT_ASTEROID_COLOR}
        onClose={() => updateState({ center: null })}
      />

      <FactSheetSummary obj={regime} />

      <Stack p="md" gap="xs" flex={1}>
        <Title order={5}>{isAsteroidBelt ? 'Asteroids' : 'Celestial Bodies'}</Title>
        {bodiesInRegime.map((body, i) => (
          <BodyCard key={`${body.name}-${i}`} body={body} onClick={() => updateState({ center: body.name })} />
        ))}
        {isAsteroidBelt && <AddSmallBodyButton state={state} addBody={addBody} removeBody={removeBody} />}
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherRegimes regime={regime} updateState={updateState} />
      </Box>
    </Stack>
  );
}
