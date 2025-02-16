import { Box, Stack, Title } from '@mantine/core';
import { memo, useMemo } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { FocusItemType } from '../../hooks/useFocusItem.ts';
import { DEFAULT_ASTEROID_COLOR } from '../../lib/data/bodies.ts';
import { SPACECRAFT } from '../../lib/data/spacecraft/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import {
  CelestialBody,
  CelestialBodyId,
  CelestialBodyType,
  CelestialBodyTypes,
  OrbitalRegime,
  OrbitalRegimeId,
} from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { AddSmallBodyButton } from './AddSmallBodyButton.tsx';
import { CelestialBodyCard } from './CelestialBodyCard.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';
import { SpacecraftVisits } from './SpacecraftVisits.tsx';

type Props = {
  regime: OrbitalRegime;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: CelestialBodyId) => void;
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

  const smallBodies = useMemo(
    () => [CelestialBodyType.DWARF_PLANET, CelestialBodyType.ASTEROID].flatMap(type => bodiesInRegimeByType[type]),
    [bodiesInRegimeByType]
  );

  return (
    <Stack fz="xs" gap={0} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={regime.name}
        subTitle="Orbital Regime"
        color={DEFAULT_ASTEROID_COLOR}
        onClose={() => updateSettings({ center: null })}
      />

      <Box style={{ flexShrink: 0 }}>
        <FactSheetSummary item={regime} type={FocusItemType.ORBITAL_REGIME} />
      </Box>

      <Stack px={padding.px} py={padding.py} gap="xl" flex={1}>
        {Object.entries(bodiesInRegimeByType)
          .filter(([, bodies]) => bodies.length > 0)
          .map(([type, bodies], i) => (
            <Stack gap="xs" key={`${type}-${i}`}>
              <Title order={5}>{celestialBodyTypeName(type as CelestialBodyType, true)}</Title>
              {bodies.map((body, j) => (
                <CelestialBodyCard
                  key={`${body.name}-${j}`}
                  body={body}
                  onClick={() => updateSettings({ center: body.id })}
                  onHover={hovered => updateSettings({ hover: hovered ? body.id : null })}
                />
              ))}
              {regime.id === OrbitalRegimeId.ASTEROID_BELT && type === CelestialBodyType.ASTEROID && (
                <AddSmallBodyButton bodies={smallBodies} addBody={addBody} removeBody={removeBody} />
              )}
            </Stack>
          ))}
      </Stack>

      <SpacecraftVisits
        title="Spacecraft Missions"
        spacecraft={spacecraftInRegime}
        bodies={bodies}
        regime={regime}
        updateSettings={updateSettings}
        compact
      />

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherRegimes regime={regime} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
