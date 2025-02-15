import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { ReactNode, useMemo, useState } from 'react';
import { useDisplaySize } from '../../../hooks/useDisplaySize.ts';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { SPACECRAFT } from '../../../lib/data/spacecraft/spacecraft.ts';
import { dateToHumanReadable } from '../../../lib/epoch.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { CelestialBody, SpacecraftOrganization } from '../../../lib/types.ts';
import { Timeline } from '../Timeline.tsx';
import { OrganizationSpacecraftCard } from './OrganizationSpacecraftCard.tsx';

type Props = {
  organization: SpacecraftOrganization;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
};
export function SpacecraftOrganizationMissions({ organization, bodies, updateSettings }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const padding = useFactSheetPadding();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const foundedComponent = (
    <Paper p="xs" withBorder onMouseEnter={() => setActiveIndex(0)} onMouseLeave={() => setActiveIndex(null)}>
      <Group gap={0} align="baseline">
        <Title order={6} mr="xs">
          Founded
        </Title>
        <Text c="dimmed" fz="xs">
          {dateToHumanReadable(organization.founded)}
        </Text>
      </Group>
    </Paper>
  );

  const organizationSpacecraft = useMemo(
    () => SPACECRAFT.filter(s => s.organization === organization.id),
    [organization.id]
  );
  const spacecraftComponents: Array<[Date, ReactNode]> = organizationSpacecraft.map((spacecraft, i) => [
    spacecraft.start,
    <OrganizationSpacecraftCard
      key={`${spacecraft.name}-${i}`}
      spacecraft={spacecraft}
      bodies={bodies}
      onClick={() => updateSettings({ center: spacecraft.id, hover: null })}
      onMouseEnter={() => setActiveIndex(i + 1)}
      onMouseLeave={() => setActiveIndex(null)}
    />,
  ]);

  const dissolvedComponent =
    organization.dissolved != null ? (
      <Paper
        p="xs"
        withBorder
        onMouseEnter={() => setActiveIndex(spacecraftComponents.length + 1)}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <Group gap={0} align="baseline">
          <Title order={6} mr="xs">
            Dissolved
          </Title>
          <Text c="dimmed" fz="xs">
            {dateToHumanReadable(organization.dissolved)}
          </Text>
        </Group>
      </Paper>
    ) : null;

  const TimelineItems: Array<[Date, ReactNode]> = [
    [organization.founded, foundedComponent],
    ...spacecraftComponents,
    ...(organization.dissolved != null
      ? ([[organization.dissolved, dissolvedComponent]] as Array<[Date, ReactNode]>)
      : []),
  ];

  return (
    <Stack gap="xs" {...padding}>
      <Title order={5}>Spacecraft Missions</Title>
      <Timeline
        datedItems={TimelineItems}
        activeIndex={activeIndex ?? -1}
        end={organization.dissolved}
        accentColor={organization.color}
        width={isXsDisplay ? undefined : 160}
      />
    </Stack>
  );
}
