import { Box, Text } from '@mantine/core';
import { useSummaryStream } from '../../hooks/queries/useSummaryStream.ts';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { TypedFocusItem } from '../../hooks/useFocusItem.ts';
import { LoadingCursor } from './LoadingCursor.tsx';

export function FactSheetSummary(props: TypedFocusItem) {
  const padding = useFactSheetPadding();
  const { data: summary, isLoading } = useSummaryStream(props);
  return (
    <Box
      px={padding.px}
      py={padding.px}
      mih={`calc(61px + var(--mantine-spacing-${padding.px}) * 2)`}
      // mih={/* measured height of 3 lines */ 61 + padding.px * 2}
    >
      <Text size="sm">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Box>
  );
}
