import { useSummaryStream } from '../../hooks/useSummaryStream.ts';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { LoadingCursor } from './LoadingCursor.tsx';
import { Thumbnail } from './Thumbnail.tsx';
import { CelestialBody } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import styles from './BodyCard.module.css';

type Props = {
  body: CelestialBody;
  updateState: (update: Partial<AppState>) => void;
};
export function BodyCard({ body, updateState }: Props) {
  const { data: summary, isLoading } = useSummaryStream(body);
  return (
    <Paper
      className={styles.Card}
      withBorder
      p="xs"
      style={{ cursor: 'pointer' }}
      onClick={() => updateState({ center: body.name })}
    >
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
