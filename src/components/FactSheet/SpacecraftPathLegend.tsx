import { Box, Group, Stack, Text, Title } from '@mantine/core';
import { Spacecraft } from '../../lib/types.ts';

type Props = {
  color: Spacecraft['color'];
};
export function SpacecraftPathLegend({ color }: Props) {
  const width = 15;
  return (
    <Group gap="xs" align="flex-start">
      <Stack gap={0}>
        <Title order={6}>Future Trajectory</Title>
        <Text c="dimmed" size="xs">
          Next 3 months
        </Text>
      </Stack>
      <Group pt={12} gap={5}>
        <Box h={1} w={width} bg={color} />
        <Box h={1} w={width} bg={color} />
        <Box h={1} w={width} bg={color} />
        <Box h={1} w={width} bg={color} />
        <Box h={1} w={width} bg={color} />
      </Group>
    </Group>
  );
}
