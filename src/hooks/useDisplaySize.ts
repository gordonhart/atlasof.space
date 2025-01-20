export function useDisplaySize() {
  return {
    s: window.innerWidth < 1080,
    xs: window.innerWidth < 640,
  };
}
