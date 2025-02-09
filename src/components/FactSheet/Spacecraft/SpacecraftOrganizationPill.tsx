import { Box, Group, Pill } from '@mantine/core';
import { UpdateSettings } from '../../../lib/state.ts';
import { SpacecraftOrganization } from '../../../lib/types.ts';
import styles from '../RelatedBodies.module.css';
import { Thumbnail } from '../Thumbnail.tsx';

type Props = {
  organization: SpacecraftOrganization;
  updateSettings?: UpdateSettings;
};
export function SpacecraftOrganizationPill({ organization, updateSettings }: Props) {
  const { id, thumbnail, shortName } = organization;
  return (
    <Pill
      className={updateSettings != null ? styles.LinkPill : undefined}
      onClick={updateSettings != null ? () => updateSettings({ center: id, hover: null }) : undefined}
    >
      <Group gap={8} wrap="nowrap">
        <Box w={14}>
          <Thumbnail size={14} thumbnail={thumbnail} />
        </Box>
        {shortName}
      </Group>
    </Pill>
  );
}
