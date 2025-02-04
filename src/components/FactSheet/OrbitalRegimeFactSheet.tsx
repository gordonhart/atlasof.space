import { Box, Stack, Title } from '@mantine/core';
import { memo, useMemo } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { orbitalRegimeDisplayName } from '../../lib/regimes.ts';
import { SPACECRAFT } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import {
  CelestialBody,
  CelestialBodyType,
  CelestialBodyTypes,
  OrbitalRegimeId,
  OrbitalRegime,
} from '../../lib/types.ts';
import { celestialBodyTypeName, DEFAULT_ASTEROID_COLOR } from '../../lib/utils.ts';
import { AddSmallBodyButton } from './AddSmallBodyButton.tsx';
import { BodyCard } from './BodyCard.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';
import { SpacecraftVisits } from './SpacecraftVisits.tsx';

type Props = {
  regime: OrbitalRegime;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: string) => void;
};
export const OrbitalRegimeFactSheet = memo(function OrbitalRegimeFactSheetComponent({
  regime,
  bodies,
  updateSettings,
  addBody,
  removeBody,
}: Props) {
  const padding = useFactSheetPadding();

  const bodiesInRegimeByType = useMemo(() => {
    const bodiesInRegime = bodies.filter(body => body.orbitalRegime === regime.id);
    const types = Object.fromEntries(CelestialBodyTypes.map(t => [t, [] as Array<CelestialBody>]));
    return bodiesInRegime.reduce((acc, body) => {
      acc[body.type].push(body);
      return acc;
    }, types);
  }, [regime.id, JSON.stringify(bodies)]);

  const spacecraftInRegime = useMemo(
    () => SPACECRAFT.filter(({ orbitalRegimes }) => orbitalRegimes?.includes(regime.id) ?? false),
    [regime.id]
  );

  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={orbitalRegimeDisplayName(regime.id)}
        subTitle="Orbital Regime"
        color={DEFAULT_ASTEROID_COLOR}
        onClose={() => updateSettings({ center: null })}
      />

      <Box style={{ flexShrink: 0 }}>
        <FactSheetSummary obj={regime} />
      </Box>

      <Stack px={padding.px} py={padding.py} gap="xl" flex={1}>
        {Object.entries(bodiesInRegimeByType)
          .filter(([, bodies]) => bodies.length > 0)
          .map(([type, bodies], i) => (
            <Stack gap="xs" key={`${type}-${i}`}>
              <Title order={5}>{celestialBodyTypeName(type as CelestialBodyType, true)}</Title>
              {bodies.map((body, j) => (
                <BodyCard
                  key={`${body.name}-${j}`}
                  body={body}
                  onClick={() => updateSettings({ center: body.id })}
                  onHover={hovered => updateSettings({ hover: hovered ? body.id : null })}
                />
              ))}
              {regime.id === OrbitalRegimeId.ASTEROID_BELT && type === CelestialBodyType.ASTEROID && (
                <AddSmallBodyButton bodies={bodies} addBody={addBody} removeBody={removeBody} />
              )}
            </Stack>
          ))}
      </Stack>

      <SpacecraftVisits
        title="Spacecraft Missions"
        spacecraft={spacecraftInRegime}
        regime={regime}
        updateSettings={updateSettings}
      />

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherRegimes regime={regime} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
