import { Box, Stack, Title } from '@mantine/core';
import { ReactNode, useMemo, useState } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { DEFAULT_SPACECRAFT_COLOR } from '../../lib/data/bodies.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, OrbitalRegime, Spacecraft } from '../../lib/types.ts';
import { CompactSpacecraftCard } from './Organization/CompactSpacecraftCard.tsx';
import { SpacecraftCard } from './Spacecraft/SpacecraftCard.tsx';
import { Timeline } from './Timeline.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body?: CelestialBody;
  bodies: Array<CelestialBody>;
  regime?: OrbitalRegime;
  updateSettings: UpdateSettings;
  title?: string;
  compact?: boolean;
};
export function SpacecraftVisits({
  spacecraft,
  body,
  bodies,
  regime,
  updateSettings,
  title = 'Spacecraft Visits',
  compact = false,
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
          {compact ? (
            <CompactSpacecraftCard
              spacecraft={s}
              bodies={bodies}
              onClick={() => updateSettings({ center: s.id, hover: null })}
            />
          ) : (
            <SpacecraftCard
              spacecraft={s}
              body={body}
              regime={regime}
              onClick={() => updateSettings({ center: s.id, hover: null })}
            />
          )}
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
