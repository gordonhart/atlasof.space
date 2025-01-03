import { CelestialBody, OrbitalRegime } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import { Box, Stack, Title } from '@mantine/core';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { DEFAULT_ASTEROID_COLOR } from '../../lib/bodies.ts';
import { useMemo } from 'react';
import { BodyCard } from './BodyCard.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';

type Props = {
  regime: OrbitalRegime;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
  width?: number;
};
export function OrbitalRegimeFactSheet({ regime, bodies, updateState, width }: Props) {
  const bodiesInRegime = useMemo(
    () => bodies.filter(body => body.orbitalRegime === regime.name),
    [regime.name, JSON.stringify(bodies)]
  );

  return (
    <Stack w={width} fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={regime.name}
        subTitle="Orbital Regime"
        color={DEFAULT_ASTEROID_COLOR}
        onClose={() => updateState({ center: null })}
      />

      <FactSheetSummary obj={regime} />

      <Stack p="md" gap="xs" flex={1}>
        <Title order={5}>Celestial Bodies</Title>
        {bodiesInRegime.map((body, i) => (
          <BodyCard key={`${body.name}-${i}`} body={body} onClick={() => updateState({ center: body.name })} />
        ))}
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherRegimes regime={regime} updateState={updateState} />
      </Box>
    </Stack>
  );
}
