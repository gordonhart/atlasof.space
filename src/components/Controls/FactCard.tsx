import { Grid, Group, Paper, Stack, Text } from '@mantine/core';
import { CelestialBodyState } from '../../lib/types.ts';
import { Fragment } from 'react';
import { celestialBodyTypeName, humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { magnitude, orbitalPeriod } from '../../lib/physics.ts';
import { SOL } from '../../lib/constants.ts';

type Props = {
  body: CelestialBodyState;
};
export function FactCard({ body }: Props) {
  // TODO: period for non-sun-orbiting bodies? requires knowing the parent's mass
  const period = orbitalPeriod(body.semiMajorAxis, SOL.mass);
  const [periodTime, periodUnits] = humanTimeUnits(period);
  const satellites = body.satellites.map(({ name }) => name);
  const facts: Array<{ label: string; value: string }> = [
    { label: 'mass', value: `${body.mass.toExponential(4)} kg` },
    { label: 'radius', value: `${(body.radius / 1e3).toLocaleString()} km` },
    { label: 'semi-major axis', value: `${(body.semiMajorAxis / 1e3).toLocaleString()} km` },
    { label: 'eccentricity', value: body.eccentricity.toLocaleString() },
    { label: 'inclination', value: `${body.inclination.toLocaleString()}º` },
    { label: 'longitude of the ascending node', value: `${body.longitudeAscending.toLocaleString()}º` },
    { label: 'argument of periapsis', value: `${body.argumentOfPeriapsis.toLocaleString()}º` },
    { label: 'orbital period', value: pluralize(periodTime, periodUnits) },
    // TODO: this doesn't update live due to the passed-in body being a ref -- should fix
    { label: 'velocity', value: `${(magnitude(body.velocity) / 1e3).toLocaleString()} km/s` },
    ...(satellites.length > 0 ? [{ label: 'satellites', value: satellites.join(', ') }] : []),
  ];

  return (
    <Paper
      fz="xs"
      p="md"
      radius="md"
      withBorder
      style={{ backdropFilter: 'blur(4px)', borderColor: 'transparent', borderLeftColor: body.color }}
    >
      <Stack gap="xs">
        <Group gap="xs">
          <Text inherit fw="bold">
            {body.name}
          </Text>
          <Text inherit c="dimmed">
            {celestialBodyTypeName(body.type)}
          </Text>
        </Group>
        <Grid gutter={2} w={330}>
          {facts.map(({ label, value }, i) => (
            <Fragment key={i}>
              <Grid.Col span={7}>
                <Text inherit c="dimmed">
                  {label}
                </Text>
              </Grid.Col>
              <Grid.Col span={5}>{value}</Grid.Col>
            </Fragment>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
}
