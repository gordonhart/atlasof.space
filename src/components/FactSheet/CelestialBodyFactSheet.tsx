import { Box, Group, Stack, Title } from '@mantine/core';
import { memo, ReactNode } from 'react';
import { useFactsStream } from '../../hooks/queries/useFactsStream.ts';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { FocusItemType } from '../../hooks/useFocusItem.ts';
import { g } from '../../lib/data/bodies.ts';
import { ORBITAL_REGIMES } from '../../lib/data/regimes.ts';
import { SPACECRAFT_BY_BODY_ID } from '../../lib/data/spacecraft/spacecraft.ts';
import { orbitalPeriod, surfaceGravity } from '../../lib/physics.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeDescription, humanDistanceUnits, humanTimeUnits, pluralize } from '../../lib/utils.ts';
import { CelestialBodyThumbnail } from './CelestialBodyThumbnail.tsx';
import { FactGrid } from './FactGrid.tsx';
import { FactSheetSummary } from './FactSheetSummary.tsx';
import { FactSheetTitle } from './FactSheetTitle.tsx';
import { Gallery } from './Gallery.tsx';
import { HillSpherePill } from './HillSpherePill.tsx';
import { LoadingCursor } from './LoadingCursor.tsx';
import { MajorSatellites } from './MajorSatellites.tsx';
import { OrbitalRegimePill } from './OrbitalRegimePill.tsx';
import { OtherBodies } from './OtherBodies.tsx';
import { OtherRegimes } from './OtherRegimes.tsx';
import { ParentBody } from './ParentBody.tsx';
import { SpacecraftVisits } from './SpacecraftVisits.tsx';
import { WikiLinkPill } from './WikiLinkPill.tsx';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  settings: Settings;
  updateSettings: UpdateSettings;
};
export const CelestialBodyFactSheet = memo(function CelestialBodyFactSheetComponent({
  body,
  bodies,
  settings,
  updateSettings,
}: Props) {
  const { id, name, type, mass, radius, elements, orbitalRegime, assets, facts, style } = body;
  const { wrt, semiMajorAxis, eccentricity, inclination, longitudeAscending, argumentOfPeriapsis, rotation } = elements;
  const { data: extraFacts, isLoading } = useFactsStream(body);
  const padding = useFactSheetPadding();
  const { xs: isXsDisplay } = useDisplaySize();

  const parent = bodies.find(({ id }) => id === wrt);
  const period = orbitalPeriod(semiMajorAxis, parent?.mass ?? 1);
  const [periodTime, periodUnits] = humanTimeUnits(period);
  const [axisValue, axisUnits] = humanDistanceUnits(semiMajorAxis);
  const [rotationTime, rotationUnits] = humanTimeUnits(Math.abs(rotation?.siderealPeriod ?? 0));
  const orbitalRegimePill =
    orbitalRegime != null ? (
      <OrbitalRegimePill regime={ORBITAL_REGIMES[orbitalRegime]} updateSettings={updateSettings} />
    ) : undefined;
  const wikiPill = assets?.wiki != null ? <WikiLinkPill url={assets.wiki} /> : undefined;
  const gravity = (surfaceGravity(mass, radius) / g).toLocaleString();
  const hillSpherePill =
    parent != null ? (
      <HillSpherePill body={body} parent={parent} settings={settings} updateSettings={updateSettings} />
    ) : null;

  const bullets: Array<{ label: string; value: ReactNode }> = [
    ...(orbitalRegimePill != null ? [{ label: 'orbital regime', value: orbitalRegimePill }] : []),
    ...(wikiPill != null ? [{ label: 'learn more', value: wikiPill }] : []),
    { label: 'mass', value: `${mass.toExponential(4)} kg` },
    { label: 'radius', value: `${(radius / 1e3).toLocaleString()} km` },
    ...(hillSpherePill != null ? [{ label: 'hill radius', value: hillSpherePill }] : []),
    // prettier-ignore
    ...(type !== CelestialBodyType.STAR ? [
      { label: 'semi-major axis', value: `${axisValue.toLocaleString()} ${axisUnits}` },
      { label: 'eccentricity', value: eccentricity.toLocaleString() },
      { label: 'inclination', value: `${inclination.toLocaleString()}º` },
      { label: 'longitude of the ascending node', value: `${longitudeAscending.toLocaleString()}º` },
      { label: 'argument of periapsis', value: `${argumentOfPeriapsis.toLocaleString()}º` },
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
    ...(Number(gravity) > 0 ? [{ label: 'surface gravity', value: `${gravity} g` }] : []),
    ...(facts ?? []),
    // TODO: add simulation-dependent bullets: velocity, distance from Sun, distance from Earth
  ];
  const factBullets = factsAsBullets(extraFacts);
  const galleryAssets = assets?.gallery ?? [];
  const spacecraftVisited = SPACECRAFT_BY_BODY_ID[id] ?? [];

  return (
    <Stack fz="xs" gap={0} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={name}
        subTitle={celestialBodyTypeDescription(body)}
        color={style.fgColor}
        onClose={() => updateSettings({ center: null })}
        onHover={hovered => updateSettings({ hover: hovered ? id : null })}
      />

      {isXsDisplay ? (
        <Group gap={0} justify="space-between" align="flex-start" wrap="nowrap" w="100%">
          <FactSheetSummary item={body} type={FocusItemType.CELESTIAL_BODY} />
          <Box pt={padding.px} pr={padding.px} style={{ flexShrink: 0 }}>
            <CelestialBodyThumbnail key={name} body={body} size={160} />
          </Box>
        </Group>
      ) : (
        <FactSheetSummary item={body} type={FocusItemType.CELESTIAL_BODY} />
      )}

      <Stack gap={2} flex={1}>
        <Group pt={padding.pt} px={padding.px} gap="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Stack gap="xs">
            <Title order={5}>Key Facts</Title>
            <FactGrid facts={bullets} />
          </Stack>
          {!isXsDisplay && (
            <Box style={{ flexShrink: 1 }}>
              <CelestialBodyThumbnail key={name} body={body} size={220} />
            </Box>
          )}
        </Group>

        <Box px={padding.px}>
          {isLoading && factBullets.length === 0 ? (
            <LoadingCursor />
          ) : (
            <FactGrid facts={factBullets} isLoading={isLoading} />
          )}
        </Box>
      </Stack>

      <Box pt="md" style={{ justifySelf: 'flex-end' }}>
        {galleryAssets.length > 0 && <Gallery assets={galleryAssets} />}
        <MajorSatellites body={body} bodies={bodies} updateSettings={updateSettings} />
        <ParentBody body={body} bodies={bodies} updateSettings={updateSettings} />
        <SpacecraftVisits spacecraft={spacecraftVisited} body={body} bodies={bodies} updateSettings={updateSettings} />
        <OtherBodies body={body} bodies={bodies} updateSettings={updateSettings} />
        {type === CelestialBodyType.STAR && <OtherRegimes updateSettings={updateSettings} title="Orbital Regimes" />}
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
