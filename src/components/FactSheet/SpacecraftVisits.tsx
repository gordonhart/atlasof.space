import { Box, Stack, Title } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, Spacecraft } from '../../lib/types.ts';
import { DEFAULT_SPACECRAFT_COLOR } from '../../lib/utils.ts';
import { SpacecraftCard } from './Spacecraft/SpacecraftCard.tsx';
import { Timeline } from './Timeline.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body?: CelestialBody;
  updateSettings: UpdateSettings;
  title?: string;
};
export function SpacecraftVisits({ spacecraft, body, updateSettings, title = 'Spacecraft Visits' }: Props) {
  const padding = useFactSheetPadding();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const TimelineItems = spacecraft.map<[Date, ReactNode]>((s, i) => [
    (body != null ? s.visited.find(({ id }) => id === body.id)?.start : null) ?? s.start,
    <Box key={`${s.name}-${i}`} onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(undefined)}>
      <SpacecraftCard spacecraft={s} body={body} onClick={() => updateSettings({ center: s.id, hover: null })} />
    </Box>,
  ]);

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
