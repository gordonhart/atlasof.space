import { Box, Text } from '@mantine/core';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { CelestialBody, OrbitalRegime, Spacecraft } from '../../lib/types.ts';
import { LoadingCursor } from './LoadingCursor.tsx';

type Props = {
  obj: CelestialBody | OrbitalRegime | Spacecraft;
};
export function FactSheetSummary({ obj }: Props) {
  const padding = useFactSheetPadding();
  const { data: summary, isLoading } = useSummaryStream(obj);
  return (
    <Box px={padding.px} py={padding.px} mih={77 /* measured height of 3 lines + top padding */}>
      <Text size="sm">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Box>
  );
}
