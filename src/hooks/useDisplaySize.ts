import { useViewportSize } from '@mantine/hooks';
import { useMemo } from 'react';

export function useDisplaySize() {
  const size = useViewportSize();
  const width = Math.max(size.width, window.innerWidth); // useViewportSize can return 0 briefly, apply max to deflicker
  return useMemo(() => ({ sm: isSm(width), xs: isXs(width) }), [width]);
}

export function isXs(width: number) {
  return width < 580;
}
export function isSm(width: number) {
  return width < 1080;
}
