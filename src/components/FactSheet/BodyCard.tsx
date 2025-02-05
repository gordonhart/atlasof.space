import { Box, Paper, Text, Title } from '@mantine/core';
import { useSummaryStream } from '../../hooks/queries/useSummaryStream.ts';
import { CelestialBody } from '../../lib/types.ts';
import styles from './BodyCard.module.css';
import { CelestialBodyThumbnail } from './CelestialBodyThumbnail.tsx';
import { LoadingCursor } from './LoadingCursor.tsx';

type Props = {
  body: CelestialBody;
  onClick: () => void;
  onHover?: (hovered: boolean) => void;
};
export function BodyCard({ body, onClick, onHover }: Props) {
  const { data: summary, isLoading } = useSummaryStream(body);
  return (
    <Paper
      className={styles.Card}
      withBorder
      p="xs"
      onClick={onClick}
      onMouseEnter={onHover != null ? () => onHover(true) : undefined}
      onMouseLeave={onHover != null ? () => onHover(false) : undefined}
    >
      <Box ml="xs" style={{ float: 'right' }}>
        <CelestialBodyThumbnail body={body} size={100} />
      </Box>
      <Title order={6}>{body.name}</Title>
      <Text mt={4} inherit c="dimmed" fz="xs">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Paper>
  );
}
