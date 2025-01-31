import { Box, Group, Stack, Title } from '@mantine/core';
import { memo } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { dateToISO } from '../../lib/epoch.ts';
import { Spacecraft } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName, DEFAULT_SPACECRAFT_COLOR } from '../../lib/utils.ts';
import { FactGrid } from './FactGrid.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { MissionTimeline } from './MissionTimeline.tsx';
import { OtherSpacecraft } from './OtherSpacecraft.tsx';
import { SpacecraftOrganizationPill } from './SpacecraftOrganizationPill.tsx';
import { SpacecraftStatusPill } from './SpacecraftStatusPill.tsx';
import { Thumbnail } from './Thumbnail.tsx';
import { WikiLinkPill } from './WikiLinkPill.tsx';

type Props = {
  spacecraft: Spacecraft;
  bodies: Array<CelestialBody>;
  hover: string | null;
  updateSettings: UpdateSettings;
};
export const SpacecraftFactSheet = memo(function SpacecraftFactSheet({
  spacecraft,
  bodies,
  hover,
  updateSettings,
}: Props) {
  const { xs: isXsDisplay } = useDisplaySize();

  const bullets = [
    { label: 'organization', value: <SpacecraftOrganizationPill organization={spacecraft.organization} /> },
    ...(spacecraft.crew != null ? [{ label: 'crew', value: spacecraft.crew.join(', ') }] : []),
    { label: 'launch date', value: dateToISO(spacecraft.start) },
    ...(spacecraft.end != null ? [{ label: 'mission end date', value: dateToISO(spacecraft.end) }] : []),
    { label: 'launch mass', value: `${spacecraft.launchMass.toLocaleString()} kg` },
    ...(spacecraft.power != null ? [{ label: 'power', value: `${spacecraft.power.toLocaleString()} watts` }] : []),
    { label: 'status', value: <SpacecraftStatusPill status={spacecraft.status} /> },
    { label: 'learn more', value: <WikiLinkPill url={spacecraft.wiki} /> },
  ];

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

        <MissionTimeline spacecraft={spacecraft} bodies={bodies} hover={hover} updateSettings={updateSettings} />
      </Stack>

      <Box pt="md" style={{ justifySelf: 'flex-end' }}>
        <OtherSpacecraft spacecraft={spacecraft} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
