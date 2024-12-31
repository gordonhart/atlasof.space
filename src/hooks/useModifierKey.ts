import { useOs } from '@mantine/hooks';

export function useModifierKey() {
  const os = useOs();
  return os === 'macos' ? '⌘' : os === 'windows' || os === 'linux' ? '⌃' : undefined;
}
