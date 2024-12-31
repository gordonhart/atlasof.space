import { memo } from 'react';
import { IconX } from '@tabler/icons-react';
import { ActionIcon, Box, Group, Image, Stack, Table, Text, Title } from '@mantine/core';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeDescription, humanDistanceUnits, humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { orbitalPeriod, surfaceGravity } from '../../lib/physics.ts';
import { g } from '../../lib/bodies.ts';
import { GalleryImages } from '../../lib/images.ts';
import { Thumbnail } from './Thumbnail.tsx';
import { useFactsStream } from '../../hooks/useFactsStream.ts';
import { LoadingCursor } from './LoadingCursor.tsx';
import { iconSize } from '../Controls/constants.ts';
import { MajorMoons } from './MajorMoons.tsx';
import { AppState } from '../../lib/state.ts';
import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { ParentBody } from './ParentBody.tsx';
import { OtherBodies } from './OtherBodies.tsx';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
  width?: number;
};
export const FactSheet = memo(function FactSheetComponent({ body, bodies, updateState, width }: Props) {
  const { name, type, mass, radius, elements, rotation } = body;
  const { data: facts, isLoading } = useFactsStream(`${name}+${type}`);

  const parent = bodies.find(({ name }) => name === body.elements.wrt);
  const period = orbitalPeriod(elements.semiMajorAxis, parent?.mass ?? 1);
  const [periodTime, periodUnits] = humanTimeUnits(period);
  const [axisValue, axisUnits] = humanDistanceUnits(elements.semiMajorAxis);
  const [rotationTime, rotationUnits] = humanTimeUnits(Math.abs(rotation?.siderealPeriod ?? 0));
  const bullets: Array<{ label: string; value: string }> = [
    { label: 'mass', value: `${mass.toExponential(4)} kg` },
    { label: 'radius', value: `${(radius / 1e3).toLocaleString()} km` },
    // prettier-ignore
    ...(body.type !== CelestialBodyType.STAR ? [
      { label: 'semi-major axis', value: `${axisValue.toLocaleString()} ${axisUnits}` },
      { label: 'eccentricity', value: elements.eccentricity.toLocaleString() },
      { label: 'inclination', value: `${elements.inclination.toLocaleString()}º` },
      { label: 'longitude of the ascending node', value: `${elements.longitudeAscending.toLocaleString()}º` },
      { label: 'argument of periapsis', value: `${elements.argumentOfPeriapsis.toLocaleString()}º` },
    ] : []),
    ...(parent != null ? [{ label: 'orbital period', value: pluralize(periodTime, periodUnits) }] : []),
    // prettier-ignore
    ...(rotation != null ? [
      {
        label: 'sidereal rotation period',
        value: `${pluralize(rotationTime, rotationUnits)}${rotation.siderealPeriod < 0 ? ' (retrograde)' : ''}`,
      },
      { label: 'axial tilt', value: `${rotation.axialTilt.toLocaleString()}º` },
    ] : []),
    { label: 'surface gravity', value: `${(surfaceGravity(mass, radius) / g).toLocaleString()} g` },
    ...(body.facts ?? []),
    // TODO: add simulation-dependent bullets: velocity, distance from Sun, distance from Earth
  ];
  const factBullets = factsAsBullets(facts);
  const galleryUrls = GalleryImages[name] ?? [];

  return (
    <Stack w={width} fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <Group
        pos="sticky"
        top={0}
        bg="black"
        p="md"
        gap="xs"
        justify="space-between"
        wrap="nowrap"
        style={{ borderBottom: `1px solid ${body.color}` }}
      >
        <Caret position="tl" color={body.color} />
        <Caret position="br" color={body.color} />
        <Group gap="xs" align="baseline">
          <Title order={2}>{name}</Title>
          <Title order={6} c="dimmed">
            {celestialBodyTypeDescription(body)}
          </Title>
        </Group>
        <ActionIcon onClick={() => updateState({ center: null })}>
          <IconX size={iconSize} />
        </ActionIcon>
      </Group>

      <Box pt="md" px="md" mih={77 /* measured height of 3 lines + top padding */} style={{ flexShrink: 0 }}>
        <Summary body={body} />
      </Box>

      <Stack gap={2} flex={1}>
        <Group pt="xl" px="md" gap="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap="xs">
            <Title order={5}>Key Facts</Title>
            <FactGrid facts={bullets} />
          </Stack>
          <Box style={{ flexShrink: 1 }}>
            <Thumbnail key={body.name} body={body} size={220} />
          </Box>
        </Group>

        <Box px="md">
          {isLoading && factBullets.length === 0 ? (
            <LoadingCursor />
          ) : (
            <FactGrid facts={factBullets} isLoading={isLoading} />
          )}
        </Box>
      </Stack>

      <Box style={{ justifySelf: 'flex-end' }}>
        {galleryUrls.length > 0 && <Gallery urls={galleryUrls} />}
        <MajorMoons body={body} bodies={bodies} updateState={updateState} />
        <ParentBody body={body} bodies={bodies} updateState={updateState} />
        <OtherBodies body={body} bodies={bodies} updateState={updateState} />
      </Box>
    </Stack>
  );
});

function Summary({ body }: { body: CelestialBody }) {
  const { data: summary, isLoading } = useSummaryStream(body);
  return (
    <Text size="sm">
      {summary}
      {isLoading && <LoadingCursor />}
    </Text>
  );
}

function FactGrid({
  facts,
  isLoading = false,
}: {
  facts: Array<{ value: string; label: string }>;
  isLoading?: boolean;
}) {
  return (
    <Table fz="xs" horizontalSpacing={0} verticalSpacing={2} withRowBorders={false}>
      <Table.Tbody>
        {facts.map(({ label, value }, i) => (
          <Table.Tr key={i} style={{ verticalAlign: 'top' }}>
            <Table.Td style={{ width: 190 }}>
              <Text inherit c="dimmed">
                {label}
              </Text>
            </Table.Td>
            <Table.Td pl="xs">
              <Text span inherit>
                {value}
                {isLoading && i + 1 === facts.length && value !== '' && <LoadingCursor />}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function Gallery({ urls }: { urls: Array<string> }) {
  const nPerRow = 3;
  const galleryGap = 16;
  const galleryImageWidth = 178;
  return (
    <Stack p="md" gap="xs">
      <Title order={5}>Gallery</Title>
      <Group gap={galleryGap} maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
        {urls.map((image, i) => (
          <Image key={i} radius="md" src={image} maw={galleryImageWidth} />
        ))}
      </Group>
    </Stack>
  );
}

function Caret({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 8;
  const pad = 'calc(var(--mantine-spacing-md) / 4)';
  const border = `1px solid ${color}`;
  return (
    <Box
      pos="absolute"
      w={size}
      h={size}
      top={position.startsWith('t') ? pad : undefined}
      left={position.endsWith('l') ? pad : undefined}
      right={position.endsWith('r') ? pad : undefined}
      bottom={position.startsWith('b') ? pad : undefined}
      style={{
        borderTop: position.startsWith('t') ? border : undefined,
        borderLeft: position.endsWith('l') ? border : undefined,
        borderRight: position.endsWith('r') ? border : undefined,
        borderBottom: position.startsWith('b') ? border : undefined,
      }}
    />
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
          value: currentValues
            .filter(v => v !== '')
            .join(', ')
            .replace(/\.$/, ''),
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
      value: currentValues
        .filter(v => v !== '')
        .join(', ')
        .replace(/\.$/, ''),
    });
  }

  return result;
}
