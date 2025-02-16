import { Box, Group, Stack } from '@mantine/core';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { FocusItemType } from '../../../hooks/useFocusItem.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, SpacecraftOrganization } from '../../../lib/types.ts';
import { FactSheetSummary } from '../FactSheetSummary.tsx';
import { FactSheetTitle } from '../FactSheetTitle.tsx';
import { Thumbnail } from '../Thumbnail.tsx';
import { OtherSpacecraftOrganizations } from './OtherSpacecraftOrganizations.tsx';
import { SpacecraftOrganizationMissions } from './SpacecraftOrganizationMissions.tsx';

type Props = {
  organization: SpacecraftOrganization;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
};
export function SpacecraftOrganizationFactSheet({ organization, bodies, updateSettings }: Props) {
  const padding = useFactSheetPadding();
  return (
    <Stack fz="xs" gap={0} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={organization.shortName}
        subTitle="Organization"
        color={organization.color}
        onClose={() => updateSettings({ center: null })}
      />

      <Group gap={0} justify="space-between" align="flex-start" wrap="nowrap" w="100%">
        <FactSheetSummary item={organization} type={FocusItemType.ORGANIZATION} />
        <Box pt={padding.px} pr={padding.px} style={{ flexShrink: 0 }}>
          <Thumbnail thumbnail={organization.thumbnail} alt={organization.shortName} size={100} />
        </Box>
      </Group>

      <SpacecraftOrganizationMissions organization={organization} bodies={bodies} updateSettings={updateSettings} />

      <Stack gap={0} flex={1} justify="flex-end">
        <OtherSpacecraftOrganizations organization={organization} updateSettings={updateSettings} />
      </Stack>
    </Stack>
  );
}
