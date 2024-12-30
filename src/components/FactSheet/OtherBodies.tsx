import { CelestialBody } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { Group, Pill, Stack, Text, Title } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import styles from './RelatedBodies.module.css';
import { useMemo } from 'react';

const N_RELATED = 6;

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
};
export function OtherBodies({ body, bodies, updateState }: Props) {
  const otherBodies: Array<CelestialBody> = useMemo(() => {
    const bodiesOfType = bodies.filter(({ type }) => type === body.type);
    const bodyIndex = bodiesOfType.findIndex(({ name }) => name === body.name);
    bodiesOfType.splice(bodyIndex, 1);
    const nAbove = bodiesOfType.length - bodyIndex;
    const startIndex = Math.max(0, bodyIndex - Math.max(N_RELATED / 2, N_RELATED - nAbove));
    return bodiesOfType.slice(startIndex, startIndex + N_RELATED);
  }, [JSON.stringify(body), JSON.stringify(bodies)]);

  return otherBodies.length > 0 ? (
    <Stack gap="xs" p="md">
      <Title order={5}>Other {celestialBodyTypeName(body.type)}s</Title>
      <Group gap={8}>
        {otherBodies.map((relatedBody, i) => (
          <Pill
            key={i}
            className={styles.LinkPill}
            style={{ cursor: 'pointer' }}
            onClick={() => updateState({ center: relatedBody.name })}
          >
            <Group gap={2} align="center" wrap="nowrap">
              <Text inherit>{relatedBody.shortName ?? relatedBody.name}</Text>
              <IconArrowUpRight size={14} />
            </Group>
          </Pill>
        ))}
      </Group>
    </Stack>
  ) : (
    <></>
  );
}
