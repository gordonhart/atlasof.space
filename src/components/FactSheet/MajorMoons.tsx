import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { useMemo } from 'react';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Thumbnail } from './Thumbnail.tsx';
import { AppState } from '../../lib/state.ts';
import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { LoadingCursor } from './LoadingCursor.tsx';
import { celestialBodyTypeName } from '../../lib/utils.ts';

const MAJOR_SATELLITE_TYPES = new Set([CelestialBodyType.PLANET, CelestialBodyType.MOON]);

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
};
export function MajorMoons({ body, bodies, updateState }: Props) {
  const bodiesByName = useMemo(() => Object.fromEntries(bodies.map(b => [b.name, b])), [JSON.stringify(bodies)]);
  const moons = useMemo(
    () =>
      bodies.filter(
        ({ type, influencedBy }) =>
          influencedBy[influencedBy.length - 1]?.includes(body.name) && MAJOR_SATELLITE_TYPES.has(type)
      ),
    [JSON.stringify(body), bodiesByName]
  );

  if (moons.length < 1) {
    return <></>;
  }

  return (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Major Satellites</Title>
      {moons.map((moon, i) => (
        <MoonCard key={i} body={moon} updateState={updateState} />
      ))}
    </Stack>
  );
}

function MoonCard({ body, updateState }: Pick<Props, 'body' | 'updateState'>) {
  const { data: summary, isLoading } = useSummaryStream(getSearch(body));
  return (
    <Paper withBorder p="xs" style={{ cursor: 'pointer' }} onClick={() => updateState({ center: body.name })}>
      <Group gap="xs" justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4}>
          <Title order={6}>{body.name}</Title>
          <Text inherit c="dimmed">
            {summary}
            {isLoading && <LoadingCursor />}
          </Text>
        </Stack>
        <Thumbnail body={body} size={100} />
      </Group>
    </Paper>
  );
}

function getSearch(body: CelestialBody) {
  switch (body.type) {
    case CelestialBodyType.MOON:
      return `${body.elements.wrt}'s moon ${body.name}`;
    default:
      return `the ${celestialBodyTypeName(body.type).toLowerCase()} ${body.name}`;
  }
}
