import { Box, Group, Pill } from '@mantine/core';
import { UpdateSettings } from '../../../lib/state.ts';
import { Spacecraft } from '../../../lib/types.ts';
import styles from '../RelatedBodies.module.css';
import { Thumbnail } from '../Thumbnail.tsx';

type Props = {
  spacecraft: Spacecraft;
  updateSettings: UpdateSettings;
};
export function SpacecraftPill({ spacecraft, updateSettings }: Props) {
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
          <Thumbnail thumbnail={spacecraft.thumbnail} size={thumbnailSize} radius="xs" lazy />
        </Box>
        {spacecraft.name}
      </Group>
    </Pill>
  );
}
