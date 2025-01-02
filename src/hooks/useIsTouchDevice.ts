import { useOs } from '@mantine/hooks';

export function useIsTouchDevice() {
  const os = useOs();
  return os === 'ios' || os === 'android';
}
