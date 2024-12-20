import { Grid, Group, Image, Paper, Stack, Text } from '@mantine/core';
import { CelestialBodyState } from '../../lib/types.ts';
import { Fragment } from 'react';
import { celestialBodyTypeName, humanDistanceUnits, humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { magnitude, orbitalPeriod, surfaceGravity } from '../../lib/physics.ts';
import { g, SOL } from '../../lib/constants.ts';
import { GalleryImages, Thumbnails } from '../../lib/images.ts';

type Props = {
  body: CelestialBodyState;
};
export function FactCard({ body }: Props) {
  // TODO: period for non-sun-orbiting bodies? requires knowing the parent's mass
  const period = orbitalPeriod(body.semiMajorAxis, SOL.mass);
  const [periodTime, periodUnits] = humanTimeUnits(period);
  const [axisValue, axisUnits] = humanDistanceUnits(body.semiMajorAxis);
  const satellites = body.satellites.map(({ shortName, name }) => shortName ?? name);
  const facts: Array<{ label: string; value: string }> = [
    { label: 'mass', value: `${body.mass.toExponential(4)} kg` },
    { label: 'radius', value: `${(body.radius / 1e3).toLocaleString()} km` },
    { label: 'semi-major axis', value: `${axisValue.toLocaleString()} ${axisUnits}` },
    { label: 'eccentricity', value: body.eccentricity.toLocaleString() },
    { label: 'inclination', value: `${body.inclination.toLocaleString()}º` },
    { label: 'longitude of the ascending node', value: `${body.longitudeAscending.toLocaleString()}º` },
    { label: 'argument of periapsis', value: `${body.argumentOfPeriapsis.toLocaleString()}º` },
    { label: 'orbital period', value: pluralize(periodTime, periodUnits) },
    // TODO: this doesn't update live due to the passed-in body being a ref -- should fix
    { label: 'velocity', value: `${(magnitude(body.velocity) / 1e3).toLocaleString()} km/s` },
    { label: 'surface gravity', value: `${(surfaceGravity(body.mass, body.radius) / g).toLocaleString()} g` },
    ...(satellites.length > 0 ? [{ label: 'satellites', value: satellites.join(', ') }] : []),
  ];
  const thumbnailSize = 180;
  const thumbnailUrl = Thumbnails[body.name];
  const galleryUrls = GalleryImages[body.name] ?? [];

  return (
    <Paper
      fz="xs"
      p="md"
      radius="md"
      withBorder
      style={{ backdropFilter: 'blur(4px)', borderColor: 'transparent', borderLeftColor: body.color }}
    >
      <Stack gap="xs">
        {thumbnailUrl != null && <Image radius="xl" src={thumbnailUrl} maw={thumbnailSize} mah={thumbnailSize} />}
        <Group gap="xs" align="baseline">
          <Text fw="bold" size="md">
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
        {galleryUrls.length > 0 && <Gallery urls={galleryUrls} />}
      </Stack>
    </Paper>
  );
}

function Gallery({ urls }: { urls: Array<string> }) {
  const nPerRow = 3;
  const galleryGap = 4;
  const galleryImageWidth = 120;
  // TODO: click 'g' to view in detail
  return (
    <Stack gap="xs" pt="xs">
      <Text fw="bold" size="xs">
        Gallery
      </Text>
      <Group gap={galleryGap} maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
        {urls.map((image, i) => (
          <Image key={i} radius="md" src={image} maw={galleryImageWidth} />
        ))}
      </Group>
    </Stack>
  );
}
