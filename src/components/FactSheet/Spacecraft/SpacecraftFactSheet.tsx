import { Box, Group, Stack, Title } from '@mantine/core';
import { memo } from 'react';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { dateToISO } from '../../../lib/epoch.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, CelestialBodyType, Spacecraft } from '../../../lib/types.ts';
import { celestialBodyTypeName, DEFAULT_SPACECRAFT_COLOR } from '../../../lib/utils.ts';
import { FactGrid } from '../FactGrid.tsx';
import { FactSheetSummary } from '../FactSheetSummary.tsx';
import { FactSheetTitle } from '../FactSheetTitle.tsx';
import { Thumbnail } from '../Thumbnail.tsx';
import { WikiLinkPill } from '../WikiLinkPill.tsx';
import { MissionTimeline } from './MissionTimeline.tsx';
import { OtherSpacecraft } from './OtherSpacecraft.tsx';
import { SpacecraftOrganizationPill } from './SpacecraftOrganizationPill.tsx';

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
  const padding = useFactSheetPadding();

  const bullets = [
    { label: 'organization', value: <SpacecraftOrganizationPill organization={spacecraft.organization} /> },
    { label: 'learn more', value: <WikiLinkPill url={spacecraft.wiki} /> },
    ...(spacecraft.crew != null ? [{ label: 'crew', value: spacecraft.crew.join(', ') }] : []),
    { label: 'launched', value: dateToISO(spacecraft.start) },
    ...(spacecraft.end != null
      ? [{ label: spacecraft.status.status.toLowerCase(), value: dateToISO(spacecraft.end) }]
      : []),
    { label: 'launch mass', value: `${spacecraft.launchMass.toLocaleString()} kg` },
    ...(spacecraft.power != null ? [{ label: 'power', value: `${spacecraft.power.toLocaleString()} watts` }] : []),
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

      <Box>
        <FactSheetSummary obj={spacecraft} />
      </Box>

      <Stack gap={2} flex={1}>
        <Group {...padding} gap="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap="xs">
            <Title order={5}>Key Facts</Title>
            <FactGrid facts={bullets} keysWidth={120} />
          </Stack>
          <Box style={{ flexShrink: 1 }}>
            <Thumbnail key={spacecraft.name} thumbnail={spacecraft.thumbnail} size={220} />
          </Box>
        </Group>

        <MissionTimeline spacecraft={spacecraft} bodies={bodies} hover={hover} updateSettings={updateSettings} />
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        <OtherSpacecraft spacecraft={spacecraft} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
