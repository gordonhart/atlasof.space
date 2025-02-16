import { Box, Button, Collapse, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSphere } from '@tabler/icons-react';
import { hillRadius } from '../../lib/physics.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { asHillSphereId, CelestialBody } from '../../lib/types.ts';
import { humanDistanceUnits } from '../../lib/utils.ts';

type Props = {
  body: CelestialBody;
  parent: CelestialBody;
  updateSettings: UpdateSettings;
};
export function HillSpherePill({ body, parent, updateSettings }: Props) {
  const [opened, { toggle }] = useDisclosure(false);
  const { semiMajorAxis: a, eccentricity: e } = body.elements;
  const hillRad = hillRadius(a, e, parent.mass, body.mass);
  const [radValue, radUnits] = humanDistanceUnits(hillRad);

  function onToggle() {
    updateSettings({ hover: opened ? null : asHillSphereId(body.id) });
    toggle();
  }

  return (
    <Stack
      gap={4}
      onMouseEnter={() => updateSettings({ hover: asHillSphereId(body.id) })}
      onMouseLeave={() => updateSettings(opened ? {} : { hover: null })}
    >
      <Box>
        <Button size="compact-xs" variant={opened ? 'outline' : 'subtle'} color="gray" fw="normal" onClick={onToggle}>
          <Group gap={4} wrap="nowrap">
            <IconSphere size={14} />
            {radValue.toLocaleString()} {radUnits}
          </Group>
        </Button>
      </Box>

      <Collapse in={opened}>
        <Text inherit c="dimmed" fs="italic" maw={320}>
          The Hill sphere marks the region where a planet's gravitational pull is stronger than that of the star it
          orbits.
        </Text>
      </Collapse>
    </Stack>
  );
}
