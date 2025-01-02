import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { Box, Paper, Text, Title } from '@mantine/core';
import { LoadingCursor } from './LoadingCursor.tsx';
import { Thumbnail } from './Thumbnail.tsx';
import { CelestialBody } from '../../lib/types.ts';
import styles from './BodyCard.module.css';

type Props = {
  body: CelestialBody;
  onClick: () => void;
};
export function BodyCard({ body, onClick }: Props) {
  const { data: summary, isLoading } = useSummaryStream(body);
  return (
    <Paper className={styles.Card} withBorder p="xs" style={{ cursor: 'pointer' }} onClick={onClick}>
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
