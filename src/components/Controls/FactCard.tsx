import { Group, Image, Paper, Stack, Text } from '@mantine/core';
import { CelestialBodyState } from '../../lib/types.ts';
import { celestialBodyTypeName, humanDistanceUnits, humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { magnitude, orbitalPeriod, surfaceGravity } from '../../lib/physics.ts';
import { g, SOL } from '../../lib/bodies.ts';
import { GalleryImages } from '../../lib/images.ts';
import { Thumbnail } from './Thumbnail.tsx';
import { useFactsStream } from '../../hooks/useFactsStream.ts';
import { LoadingCursor } from './LoadingCursor.tsx';

type Props = {
  body: CelestialBodyState;
};
export function FactCard({ body }: Props) {
  const { name, type, mass, radius, elements, velocity, color } = body;
  const { data: facts, isLoading } = useFactsStream(`${name}+${type}`);

  // TODO: period for non-sun-orbiting bodies? requires knowing the parent's mass
  const period = orbitalPeriod(elements.semiMajorAxis, SOL.mass);
  const [periodTime, periodUnits] = humanTimeUnits(period);
  const [axisValue, axisUnits] = humanDistanceUnits(elements.semiMajorAxis);
  const bullets: Array<{ label: string; value: string }> = [
    { label: 'mass', value: `${mass.toExponential(4)} kg` },
    { label: 'radius', value: `${(radius / 1e3).toLocaleString()} km` },
    { label: 'semi-major axis', value: `${axisValue.toLocaleString()} ${axisUnits}` },
    { label: 'eccentricity', value: elements.eccentricity.toLocaleString() },
    { label: 'inclination', value: `${elements.inclination.toLocaleString()}º` },
    { label: 'longitude of the ascending node', value: `${elements.longitudeAscending.toLocaleString()}º` },
    { label: 'argument of periapsis', value: `${elements.argumentOfPeriapsis.toLocaleString()}º` },
    { label: 'orbital period', value: pluralize(periodTime, periodUnits) },
    // TODO: this doesn't update live due to the passed-in body being a ref -- should fix
    { label: 'velocity', value: `${(magnitude(velocity) / 1e3).toLocaleString()} km/s` },
    { label: 'surface gravity', value: `${(surfaceGravity(mass, radius) / g).toLocaleString()} g` },
  ];
  const factBullets = factsAsBullets(facts);
  const galleryUrls = GalleryImages[name] ?? [];

  return (
    <Paper fz="xs" p="md" radius="md" withBorder bg="black" style={{ borderColor: color }}>
      <Stack gap={2}>
        <Group gap="xs" align="flex-start">
          <Stack gap="xs">
            <Group gap="xs" align="baseline">
              <Text fw="bold" size="md">
                {name}
              </Text>
              <Text inherit c="dimmed">
                {celestialBodyTypeName(type)}
              </Text>
            </Group>
            <FactGrid facts={bullets} valueWidth={120} />
          </Stack>

          <Thumbnail body={body} />
        </Group>

        {galleryUrls.length > 0 && <Gallery urls={galleryUrls} />}

        {isLoading && factBullets.length === 0 ? (
          <LoadingCursor />
        ) : (
          <FactGrid facts={factBullets} valueWidth={300} isLoading={isLoading} />
        )}
      </Stack>
    </Paper>
  );
}

function FactGrid({
  facts,
  valueWidth,
  isLoading = false,
}: {
  facts: Array<{ value: string; label: string }>;
  valueWidth: number;
  isLoading?: boolean;
}) {
  return (
    <Stack gap={2}>
      {facts.map(({ label, value }, i) => (
        <Group key={i} gap={2} align="flex-start" wrap="nowrap">
          <Text inherit w={190} c="dimmed">
            {label}
          </Text>
          <Text span inherit maw={valueWidth}>
            {value}
            {isLoading && i + 1 === facts.length && value !== '' && <LoadingCursor />}
          </Text>
        </Group>
      ))}
    </Stack>
  );
}

function Gallery({ urls }: { urls: Array<string> }) {
  const nPerRow = 3;
  const galleryGap = 4;
  const galleryImageWidth = 120;
  // TODO: click 'g' to view in detail
  return (
    <Group py="xs" gap={galleryGap} maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
      {urls.map((image, i) => (
        <Image key={i} radius="md" src={image} maw={galleryImageWidth} />
      ))}
    </Group>
  );
}

// TODO: better to have Claude generate facts as structured data
function factsAsBullets(facts: string | undefined): Array<{ label: string; value: string }> {
  if (facts == null) {
    return [];
  }

  const result: Array<{ label: string; value: string }> = [];

  // Split into lines and filter out empty lines
  const lines = facts
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  let currentLabel: string | null = null;
  let currentValues: string[] = [];

  for (const line of lines) {
    // Handle main bullet points
    if (line.startsWith('- **')) {
      // If we have a previous label/values, add them to result
      if (currentLabel != null) {
        result.push({
          label: currentLabel.toLowerCase(),
          value: currentValues.filter(v => v !== '').join(', '),
        });
        currentLabel = null;
      }

      // Parse new label and value
      const match = line.match(/- \*\*(.*?)\*\*:(.*)/);
      if (match != null) {
        currentLabel = match[1];
        const currentValue = match[2].trim();
        currentValues = currentValue !== '' ? [currentValue] : [];
      }
    }
    // Handle sub-bullets
    else if (line.startsWith('-')) {
      currentValues.push(line.replace(/^-/, '').trim());
    }
  }

  // Add the last item
  if (currentLabel != null) {
    result.push({
      label: currentLabel.toLowerCase(),
      value: currentValues.filter(v => v !== '').join(', '),
    });
  }

  return result;
}
