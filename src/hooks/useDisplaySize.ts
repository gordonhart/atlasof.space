export function useDisplaySize() {
  return {
    sm: window.innerWidth < 1080,
    xs: window.innerWidth < 640,
  };
}
