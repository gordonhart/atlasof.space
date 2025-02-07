import { useViewportSize } from '@mantine/hooks';

export function useDisplaySize() {
  const size = useViewportSize();
  const width = Math.max(size.width, window.innerWidth); // useViewportSize can return 0 briefly, apply max to deflicker
  const sm = isSm(width);
  return { sm, xs: isXs(width) };
}

export function isXs(width: number) {
  return width < 640;
}
export function isSm(width: number) {
  return width < 1080;
}
