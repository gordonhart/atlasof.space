import { Box, Group, Stack, Title } from '@mantine/core';
import { memo } from 'react';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { FocusItemType } from '../../../hooks/useFocusItem.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../../../lib/data/organizations.ts';
import { ORBITAL_REGIMES } from '../../../lib/data/regimes.ts';
import { dateToISO } from '../../../lib/epoch.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, CelestialBodyType, Spacecraft } from '../../../lib/types.ts';
import { celestialBodyTypeName } from '../../../lib/utils.ts';
import { FactGrid } from '../FactGrid.tsx';
import { FactSheetSummary } from '../FactSheetSummary.tsx';
import { FactSheetTitle } from '../FactSheetTitle.tsx';
import { OrbitalRegimePill } from '../OrbitalRegimePill.tsx';
import { Thumbnail } from '../Thumbnail.tsx';
import { WikiLinkPill } from '../WikiLinkPill.tsx';
import { MissionTimeline } from './MissionTimeline.tsx';
import { OtherSpacecraft } from './OtherSpacecraft.tsx';
import { RelatedSpacecraft } from './RelatedSpacecraft.tsx';
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

  const organizationPill = (
    <SpacecraftOrganizationPill
      organization={SPACECRAFT_ORGANIZATIONS[spacecraft.organization]}
      updateSettings={updateSettings}
    />
  );
  const orbitalRegimes = (
    <Group gap={4}>
      {spacecraft.orbitalRegimes?.map(regimeId => (
        <OrbitalRegimePill key={regimeId} regime={ORBITAL_REGIMES[regimeId]} updateSettings={updateSettings} />
      ))}
    </Group>
  );
  const orbitalRegimeBullet =
    spacecraft.orbitalRegimes != null && (spacecraft.orbitalRegimes?.length ?? 0) > 0
      ? { label: `orbital regime${spacecraft.orbitalRegimes.length > 1 ? 's' : ''}`, value: orbitalRegimes }
      : null;

  const bullets = [
    { label: 'organization', value: organizationPill },
    ...(orbitalRegimeBullet != null ? [orbitalRegimeBullet] : []),
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
    <Stack fz="xs" gap={0} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={spacecraft.name}
        subTitle={celestialBodyTypeName(CelestialBodyType.SPACECRAFT)}
        color={spacecraft.color}
        onClose={() => updateSettings({ center: null })}
        onHover={hovered => updateSettings({ hover: hovered ? spacecraft.id : null })}
      />

      <Box>
        <FactSheetSummary item={spacecraft} type={FocusItemType.SPACECRAFT} />
      </Box>

      <Stack gap={2} flex={1}>
        <Group {...padding} gap="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap="xs">
            <Title order={5}>Key Facts</Title>
            <FactGrid facts={bullets} keysWidth={120} />
          </Stack>
          <Box style={{ flexShrink: 1 }}>
            <Thumbnail key={spacecraft.name} thumbnail={spacecraft.thumbnail} size={240} />
          </Box>
        </Group>

        <MissionTimeline spacecraft={spacecraft} bodies={bodies} hover={hover} updateSettings={updateSettings} />
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        <RelatedSpacecraft spacecraft={spacecraft} updateSettings={updateSettings} />
        <OtherSpacecraft spacecraft={spacecraft} updateSettings={updateSettings} />
      </Box>
    </Stack>
  );
});
