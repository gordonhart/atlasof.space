import { CelestialBody, OrbitalRegime } from '../../lib/types.ts';
import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { Box, Text } from '@mantine/core';
import { LoadingCursor } from './LoadingCursor.tsx';

type Props = {
  obj: CelestialBody | OrbitalRegime;
};
export function FactSheetSummary({ obj }: Props) {
  const { data: summary, isLoading } = useSummaryStream(obj);
  return (
    <Box pt="md" px="md" mih={77 /* measured height of 3 lines + top padding */} style={{ flexShrink: 0 }}>
      <Text size="sm">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Box>
  );
}
