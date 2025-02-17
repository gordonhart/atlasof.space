import { Group, Stack, Title } from '@mantine/core';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../../../lib/data/organizations.ts';
import { SpacecraftOrganization } from '../../../lib/types.ts';
import { SpacecraftOrganizationPill } from '../Spacecraft/SpacecraftOrganizationPill.tsx';

type Props = {
  organization: SpacecraftOrganization;
};
export function OtherSpacecraftOrganizations({ organization }: Props) {
  const padding = useFactSheetPadding();
  const otherOrganizations = Object.values(SPACECRAFT_ORGANIZATIONS).filter(({ id }) => id !== organization.id);

  return (
    <Stack gap="xs" {...padding}>
      <Title order={5}>Other Organizations</Title>
      <Group gap={8}>
        {otherOrganizations.map((otherOrganization, i) => (
          <SpacecraftOrganizationPill key={`${otherOrganization.id}-${i}`} organization={otherOrganization} />
        ))}
      </Group>
    </Stack>
  );
}
