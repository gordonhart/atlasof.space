import { Box, Group, Pill } from '@mantine/core';
import { SPACECRAFT_ORGANIZATIONS } from '../../../lib/spacecraft.ts';
import { SpacecraftOrganization } from '../../../lib/types.ts';
import { Thumbnail } from '../Thumbnail.tsx';

type Props = {
  organization: SpacecraftOrganization;
};
export function SpacecraftOrganizationPill({ organization }: Props) {
  const details = SPACECRAFT_ORGANIZATIONS[organization];
  return (
    <Pill>
      <Group gap={8} wrap="nowrap">
        <Box w={14}>
          <Thumbnail size={14} thumbnail={details.thumbnail} />
        </Box>
        {details.shortName}
      </Group>
    </Pill>
  );
}
