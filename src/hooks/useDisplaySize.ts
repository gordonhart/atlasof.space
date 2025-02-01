export function useDisplaySize() {
  return { sm: isSm(), xs: isXs() };
}

export function isXs() {
  return window.innerWidth < 640;
}
export function isSm() {
  return window.innerWidth < 1080;
}
