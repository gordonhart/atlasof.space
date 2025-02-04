import { Box, Group, Pill, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { CelestialBodyThumbnail } from './CelestialBodyThumbnail.tsx';
import styles from './RelatedBodies.module.css';

const N_RELATED = 6;

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: UpdateSettings;
};
export function OtherBodies({ body, bodies, updateSettings }: Props) {
  const padding = useFactSheetPadding();
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
    <Stack gap="xs" {...padding}>
      <Title order={5}>Other {celestialBodyTypeName(body.type, true)}</Title>
      <Group gap={8}>
        {otherBodies.map((relatedBody, i) => (
          <Pill
            key={`${relatedBody.name}-${i}`}
            className={styles.LinkPill}
            style={{ cursor: 'pointer' }}
            onClick={() => updateSettings({ center: relatedBody.id, hover: null })}
            onMouseEnter={() => updateSettings({ hover: relatedBody.id })}
            onMouseLeave={() => updateSettings({ hover: null })}
          >
            <Group gap={8} align="center" wrap="nowrap">
              <Box w={thumbnailSize}>
                <CelestialBodyThumbnail body={relatedBody} size={thumbnailSize} lazy />
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
