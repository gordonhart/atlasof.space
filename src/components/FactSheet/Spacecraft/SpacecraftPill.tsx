import { Box, Group, Pill } from '@mantine/core';
import { useAppState } from '../../../lib/state.ts';
import { Spacecraft } from '../../../lib/types.ts';
import styles from '../RelatedBodies.module.css';
import { Thumbnail } from '../Thumbnail.tsx';

type Props = {
  spacecraft: Spacecraft;
};
export function SpacecraftPill({ spacecraft }: Props) {
  const updateSettings = useAppState(state => state.updateSettings);
  const thumbnailSize = 14;
  return (
    <Pill
      className={styles.LinkPill}
      style={{ cursor: 'pointer' }}
      onClick={() => updateSettings({ center: spacecraft.id, hover: null })}
      onMouseEnter={() => updateSettings({ hover: spacecraft.id })}
      onMouseLeave={() => updateSettings({ hover: null })}
    >
      <Group gap={8} align="center" wrap="nowrap">
        <Box w={thumbnailSize}>
          <Thumbnail thumbnail={spacecraft.thumbnail} alt={spacecraft.name} size={thumbnailSize} radius="xs" />
        </Box>
        {spacecraft.name}
      </Group>
    </Pill>
  );
}
