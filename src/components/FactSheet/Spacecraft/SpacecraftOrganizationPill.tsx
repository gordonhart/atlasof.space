import { Box, Group, Pill } from '@mantine/core';
import { useAppState } from '../../../lib/state.ts';
import { SpacecraftOrganization } from '../../../lib/types.ts';
import styles from '../RelatedBodies.module.css';
import { Thumbnail } from '../Thumbnail.tsx';

type Props = {
  organization: SpacecraftOrganization;
  disableClick?: boolean;
};
export function SpacecraftOrganizationPill({ organization, disableClick = false }: Props) {
  const updateSettings = useAppState(state => state.updateSettings);
  const { id, thumbnail, shortName } = organization;
  return (
    <Pill
      className={!disableClick ? styles.LinkPill : undefined}
      onClick={!disableClick ? () => updateSettings({ center: id, hover: null }) : undefined}
    >
      <Group gap={8} wrap="nowrap">
        <Box w={14}>
          <Thumbnail size={14} thumbnail={thumbnail} alt={organization.shortName} />
        </Box>
        {shortName}
      </Group>
    </Pill>
  );
}
