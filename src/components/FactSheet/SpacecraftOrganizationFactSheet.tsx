import { Box, Group, Stack } from '@mantine/core';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { SpacecraftOrganization } from '../../lib/types.ts';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { OtherSpacecraftOrganizations } from './OtherSpacecraftOrganizations.tsx';
import { SpacecraftOrganizationMissions } from './SpacecraftOrganizationMissions.tsx';
import { Thumbnail } from './Thumbnail.tsx';

type Props = {
  organization: SpacecraftOrganization;
  updateSettings: UpdateSettings;
};

export function SpacecraftOrganizationFactSheet({ organization, updateSettings }: Props) {
  const padding = useFactSheetPadding();
  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={organization.shortName}
        subTitle="Organization"
        color={organization.color}
        onClose={() => updateSettings({ center: null })}
      />

      <Group gap={0} justify="space-between" align="flex-start" wrap="nowrap" w="100%">
        <FactSheetSummary obj={organization} />
        <Box pt={padding.px} pr={padding.px} style={{ flexShrink: 0 }}>
          <Thumbnail size={100} thumbnail={organization.thumbnail} />
        </Box>
      </Group>

      <SpacecraftOrganizationMissions organization={organization} updateSettings={updateSettings} />

      <Stack gap={0} flex={1} justify="flex-end">
        <OtherSpacecraftOrganizations organization={organization} updateSettings={updateSettings} />
      </Stack>
    </Stack>
  );
}
