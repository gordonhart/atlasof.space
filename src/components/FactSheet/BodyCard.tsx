import { Box, Paper, Text, Title } from '@mantine/core';
import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { CelestialBody } from '../../lib/types.ts';
import { LoadingCursor } from './LoadingCursor.tsx';
import { Thumbnail } from './Thumbnail.tsx';
import styles from './BodyCard.module.css';

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
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={onHover != null ? () => onHover(true) : undefined}
      onMouseLeave={onHover != null ? () => onHover(false) : undefined}
    >
      <Box ml="xs" style={{ float: 'right' }}>
        <Thumbnail body={body} size={100} />
      </Box>
      <Title order={6}>{body.name}</Title>
      <Text mt={4} inherit c="dimmed" fz="xs">
        {summary}
        {isLoading && <LoadingCursor />}
      </Text>
    </Paper>
  );
}
