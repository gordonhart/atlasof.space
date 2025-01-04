import { Box, Group, Stack, Title } from '@mantine/core';
import { memo, ReactNode } from 'react';
import { useFactsStream } from '../../hooks/useFactsStream.ts';
import { g } from '../../lib/bodies.ts';
import { GalleryImages } from '../../lib/images.ts';
import { orbitalPeriod, surfaceGravity } from '../../lib/physics.ts';
import { Settings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeDescription, humanDistanceUnits, humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { FactGrid } from './FactGrid.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { Gallery } from './Gallery.tsx';
import { LoadingCursor } from './LoadingCursor.tsx';
import { MajorMoons } from './MajorMoons.tsx';
import { OrbitalRegimePill } from './OrbitalRegimePill.tsx';
import { OtherBodies } from './OtherBodies.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';
import { ParentBody } from './ParentBody.tsx';
import { Thumbnail } from './Thumbnail.tsx';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: (update: Partial<Settings>) => void;
};
export const CelestialBodyFactSheet = memo(function CelestialBodyFactSheetComponent({
  body,
  bodies,
  updateSettings,
}: Props) {
  const { name, type, mass, radius, elements, rotation } = body;
  const { data: facts, isLoading } = useFactsStream(`${name}+${type}`);

  const parent = bodies.find(({ name }) => name === body.elements.wrt);
  const period = orbitalPeriod(elements.semiMajorAxis, parent?.mass ?? 1);
  const [periodTime, periodUnits] = humanTimeUnits(period);
  const [axisValue, axisUnits] = humanDistanceUnits(elements.semiMajorAxis);
  const [rotationTime, rotationUnits] = humanTimeUnits(Math.abs(rotation?.siderealPeriod ?? 0));
  const orbitalRegimePill =
    body.orbitalRegime != null ? (
      <OrbitalRegimePill regime={body.orbitalRegime} updateSettings={updateSettings} />
    ) : undefined;
  const bullets: Array<{ label: string; value: ReactNode }> = [
    ...(orbitalRegimePill != null ? [{ label: 'orbital regime', value: orbitalRegimePill }] : []),
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
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={body.name}
        subTitle={celestialBodyTypeDescription(body)}
        color={body.color}
        onClose={() => updateSettings({ center: null })}
        onHover={hovered => updateSettings({ hover: hovered ? name : null })}
      />

      <FactSheetSummary obj={body} />

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
        <MajorMoons body={body} bodies={bodies} updateSettings={updateSettings} />
        <ParentBody body={body} bodies={bodies} updateSettings={updateSettings} />
        <OtherBodies body={body} bodies={bodies} updateSettings={updateSettings} />
        {body.type === CelestialBodyType.STAR && (
          <OtherRegimes updateSettings={updateSettings} title="Orbital Regimes" />
        )}
      </Box>
    </Stack>
  );
});

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
