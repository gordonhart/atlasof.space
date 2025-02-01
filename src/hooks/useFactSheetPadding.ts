import { useDisplaySize } from './useDisplaySize.ts';

export function useFactSheetPadding() {
  const { xs } = useDisplaySize();
  return { px: xs ? 'xs' : 'md', py: 'md', pt: 'lg' };
}
