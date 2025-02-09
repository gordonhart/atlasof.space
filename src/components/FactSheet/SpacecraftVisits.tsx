import { Box, Stack, Title } from '@mantine/core';
import { ReactNode, useMemo, useState } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { DEFAULT_SPACECRAFT_COLOR } from '../../lib/data/bodies.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, OrbitalRegime, PlanetarySystem, Spacecraft } from '../../lib/types.ts';
import { SpacecraftCard } from './Spacecraft/SpacecraftCard.tsx';
import { Timeline } from './Timeline.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body?: CelestialBody;
  regime?: OrbitalRegime;
  system?: PlanetarySystem;
  updateSettings: UpdateSettings;
  title?: string;
};
export function SpacecraftVisits({
  spacecraft,
  body,
  regime,
  system,
  updateSettings,
  title = 'Spacecraft Visits',
}: Props) {
  const padding = useFactSheetPadding();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const TimelineItems = useMemo(
    () =>
      spacecraft.map<[Date, ReactNode]>((s, i) => [
        (body != null ? s.visited.find(({ id }) => id === body.id)?.start : null) ?? s.start,
        <Box
          key={`${s.name}-${i}`}
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(undefined)}
        >
          <SpacecraftCard
            spacecraft={s}
            body={body}
            regime={regime}
            onClick={() => updateSettings({ center: s.id, hover: null })}
          />
        </Box>,
      ]),
    [JSON.stringify(spacecraft), JSON.stringify(body), JSON.stringify(regime)]
  );

  return spacecraft.length > 0 ? (
    <Stack gap="xs" {...padding}>
      <Title order={5}>{title}</Title>
      <Timeline
        datedItems={TimelineItems}
        activeIndex={activeIndex}
        accentColor={body?.style?.fgColor ?? DEFAULT_SPACECRAFT_COLOR}
      />
    </Stack>
  ) : (
    <></>
  );
}
