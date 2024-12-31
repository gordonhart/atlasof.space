import { Box } from '@mantine/core';
import styles from './LoadingCursor.module.css';

export function LoadingCursor() {
  return (
    <Box
      component="span"
      display="inline-block"
      className={styles.LoadingCursor}
      w="0.6em"
      h="1.2em"
      color="var(--mantine-color-gray-light-color)"
      bg="var(--mantine-color-gray-light-color)"
    >
      _
    </Box>
  );
}
