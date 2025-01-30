import { Anchor, Box, Group, Stack, Title } from '@mantine/core';
import { memo, useMemo } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { dateToHumanReadable } from '../../lib/epoch.ts';
import { Spacecraft } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyId, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName, DEFAULT_SPACECRAFT_COLOR, notNullish } from '../../lib/utils.ts';
import { BodyCard } from './BodyCard.tsx';
import { FactGrid } from './FactGrid.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { SpacecraftOrganizationPill } from './SpacecraftOrganizationPill.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';
import { Thumbnail } from './Thumbnail.tsx';

type Props = {
  spacecraft: Spacecraft;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
};
export const SpacecraftFactSheet = memo(function SpacecraftFactSheet({ spacecraft, bodies, updateSettings }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const bodyById = useMemo(
    () => bodies.reduce<Record<CelestialBodyId, CelestialBody>>((acc, body) => ({ ...acc, [body.id]: body }), {}),
    [JSON.stringify(bodies)]
  );

  const bullets = [
    { label: 'organization', value: <SpacecraftOrganizationPill organization={spacecraft.organization} /> },
    ...(spacecraft.crew != null ? [{ label: 'crew', value: spacecraft.crew.join(', ') }] : []),
    { label: 'launch date', value: dateToHumanReadable(spacecraft.start) },
    { label: 'launch mass', value: `${spacecraft.launchMass.toLocaleString()} kg` },
    ...(spacecraft.power != null ? [{ label: 'power', value: `${spacecraft.power.toLocaleString()} watts` }] : []),
    { label: 'status', value: <SpacecraftStatusPill status={spacecraft.status} /> },
    {
      label: 'learn more',
      value: (
        <Anchor inherit href={spacecraft.wiki} target="_blank">
          Wikipedia
        </Anchor>
      ),
    },
  ];

  const visitedBodies = spacecraft.visited.map(({ id }) => bodyById[id]).filter(notNullish);
  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={spacecraft.name}
        subTitle={celestialBodyTypeName(CelestialBodyType.SPACECRAFT)}
        color={DEFAULT_SPACECRAFT_COLOR}
        onClose={() => updateSettings({ center: null })}
        onHover={hovered => updateSettings({ hover: hovered ? spacecraft.id : null })}
      />

      {isXsDisplay ? (
        <Group gap={0} justify="space-between" align="flex-start" wrap="nowrap" w="100%">
          <FactSheetSummary obj={spacecraft} />
          <Box pt="md" pr="md" style={{ flexShrink: 0 }}>
            <Thumbnail key={spacecraft.name} thumbnail={spacecraft.thumbnail} size={160} />
          </Box>
        </Group>
      ) : (
        <FactSheetSummary obj={spacecraft} />
      )}

      <Stack gap={2} flex={1}>
        <Group pt="xl" px="md" gap="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap="xs">
            <Title order={5}>Key Facts</Title>
            <FactGrid facts={bullets} />
          </Stack>
          {!isXsDisplay && (
            <Box style={{ flexShrink: 1 }}>
              <Thumbnail key={spacecraft.name} thumbnail={spacecraft.thumbnail} size={220} />
            </Box>
          )}
        </Group>

        <Stack gap="xs" p="md" pt="lg">
          <Title order={5}>Mission Timeline</Title>
          {visitedBodies.map((body, i) => (
            <BodyCard
              key={`${body.name}-${i}`}
              body={body}
              onClick={() => updateSettings({ center: body.id, hover: null })}
              onHover={hovered => updateSettings({ hover: hovered ? body.id : null })}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
});
