import { Box, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { ReactNode, useMemo, useState } from 'react';
import { useFactSheetPadding } from '../../../hooks/useFactSheetPadding.ts';
import { dateToHumanReadable } from '../../../lib/epoch.ts';
import { SPACECRAFT } from '../../../lib/spacecraft.ts';
import { UpdateSettings } from '../../../lib/state.ts';
import { SpacecraftOrganization } from '../../../lib/types.ts';
import styles from '../BodyCard.module.css';
import { Thumbnail } from '../Thumbnail.tsx';
import { Timeline } from '../Timeline.tsx';

type Props = {
  organization: SpacecraftOrganization;
  updateSettings: UpdateSettings;
};
export function SpacecraftOrganizationMissions({ organization, updateSettings }: Props) {
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
    <Paper
      key={`${spacecraft.name}-${i}`}
      className={styles.Card}
      withBorder
      p={8}
      onMouseEnter={() => setActiveIndex(i + 1)}
      onMouseLeave={() => setActiveIndex(null)}
      onClick={() => updateSettings({ center: spacecraft.id, hover: null })}
      style={{ overflow: 'auto' }}
    >
      <Group gap="xs" wrap="nowrap">
        <Box w={80} style={{ flexShrink: 0 }}>
          <Thumbnail thumbnail={spacecraft.thumbnail} size={80} radius="xs" />
        </Box>
        <Stack gap={0}>
          <Title order={6} mr="xs">
            {spacecraft.name}
          </Title>
          <Text fz="xs" c="dimmed">
            {spacecraft.start.getFullYear()}
            {spacecraft.end?.getFullYear() !== spacecraft.start.getFullYear()
              ? ` - ${spacecraft.end?.getFullYear() ?? 'Now'}`
              : ''}
          </Text>
        </Stack>
      </Group>
    </Paper>,
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
        width={160}
      />
    </Stack>
  );
}
