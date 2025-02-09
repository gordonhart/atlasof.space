import { Box, Group, Pill } from '@mantine/core';
import { SPACECRAFT_ORGANIZATIONS } from '../../../lib/data/organizations.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { SpacecraftOrganizationId } from '../../../lib/types.ts';
import styles from '../RelatedBodies.module.css';
import { Thumbnail } from '../Thumbnail.tsx';

type Props = {
  organization: SpacecraftOrganizationId;
  updateSettings?: UpdateSettings;
};
export function SpacecraftOrganizationPill({ organization, updateSettings }: Props) {
  const details = SPACECRAFT_ORGANIZATIONS[organization];
  return (
    <Pill
      className={updateSettings != null ? styles.LinkPill : undefined}
      onClick={updateSettings != null ? () => updateSettings({ center: organization, hover: null }) : undefined}
    >
      <Group gap={8} wrap="nowrap">
        <Box w={14}>
          <Thumbnail size={14} thumbnail={details.thumbnail} />
        </Box>
        {details.shortName}
      </Group>
    </Pill>
  );
}
