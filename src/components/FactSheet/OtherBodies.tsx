import { Box, Group, Pill, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { CelestialBody } from '../../lib/types.ts';
import { Settings } from '../../lib/state.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import styles from './RelatedBodies.module.css';
import { Thumbnail } from './Thumbnail.tsx';

const N_RELATED = 6;

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: (update: Partial<Settings>) => void;
};
export function OtherBodies({ body, bodies, updateSettings }: Props) {
  const otherBodies: Array<CelestialBody> = useMemo(() => {
    const bodiesOfType = bodies.filter(({ type }) => type === body.type);
    const bodyIndex = bodiesOfType.findIndex(({ name }) => name === body.name);
    bodiesOfType.splice(bodyIndex, 1);
    const nAbove = bodiesOfType.length - bodyIndex;
    const startIndex = Math.max(0, bodyIndex - Math.max(N_RELATED / 2, N_RELATED - nAbove));
    return bodiesOfType.slice(startIndex, startIndex + N_RELATED);
  }, [JSON.stringify(body), JSON.stringify(bodies)]);

  const thumbnailSize = 14;
  return otherBodies.length > 0 ? (
    <Stack gap="xs" p="md">
      <Title order={5}>Other {celestialBodyTypeName(body.type, true)}</Title>
      <Group gap={8}>
        {otherBodies.map((relatedBody, i) => (
          <Pill
            key={`${relatedBody.name}-${i}`}
            className={styles.LinkPill}
            style={{ cursor: 'pointer' }}
            onClick={() => updateSettings({ center: relatedBody.name, hover: null })}
            onMouseEnter={() => updateSettings({ hover: relatedBody.name })}
            onMouseLeave={() => updateSettings({ hover: null })}
          >
            <Group gap={8} align="center" wrap="nowrap">
              <Box w={thumbnailSize}>
                <Thumbnail body={relatedBody} size={thumbnailSize} />
              </Box>
              {relatedBody.shortName ?? relatedBody.name}
            </Group>
          </Pill>
        ))}
      </Group>
    </Stack>
  ) : (
    <></>
  );
}
