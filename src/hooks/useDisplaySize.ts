import { useViewportSize } from '@mantine/hooks';

export function useDisplaySize() {
  const { width } = useViewportSize();
  return { sm: isSm(width), xs: isXs(width) };
}

export function isXs(width: number) {
  return width < 640;
}
export function isSm(width: number) {
  return width < 1080;
}
