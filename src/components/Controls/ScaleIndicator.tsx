import { Box, Paper, Stack, Text } from '@mantine/core';
import { memo } from 'react';
import { LABEL_FONT_FAMILY } from '../../lib/canvas.ts';
import { AU } from '../../lib/data/bodies.ts';
import { useAppState } from '../../lib/state.ts';

export const ScaleIndicator = memo(function ScaleIndicatorComponent() {
  const metersPerPx = useAppState(state => state.model.metersPerPx);
  let scaleWidthM, scaleDisplay, scaleUnits;
  if (metersPerPx > 0.005 * AU) {
    scaleDisplay = getScaleMeters(metersPerPx / AU) * 50;
    scaleWidthM = scaleDisplay * AU;
    scaleUnits = 'AU';
  } else {
    scaleWidthM = getScaleMeters(metersPerPx) * 50;
    scaleDisplay = scaleWidthM / 1e3;
    scaleUnits = 'km';
  }
  return (
    <Paper p={4} bg="transparent" radius="md" style={{ backdropFilter: 'blur(4px)' }}>
      <Stack gap={4} align="flex-end">
        <Box w={scaleWidthM / metersPerPx} h={1} style={{ backgroundColor: 'var(--mantine-color-gray-light-color)' }} />
        <Text size="xs" c="dimmed" ff={LABEL_FONT_FAMILY}>
          {scaleDisplay.toLocaleString()} {scaleUnits}
        </Text>
      </Stack>
    </Paper>
  );
});

function getScaleMeters(meters: number) {
  const magnitude = Math.floor(Math.log10(meters)); // Base power of 10
  const base = Math.pow(10, magnitude); // Closest lower power of 10
  // Determine if it's closer to 2x, 4x, or 10x base
  const multiple = meters <= base * 2 ? 2 : meters <= base * 4 ? 4 : 10;
  return base * multiple;
}
