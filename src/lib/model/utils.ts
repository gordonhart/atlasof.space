import { CanvasTexture } from 'three';
import { Point2 } from '../types.ts';

export function isOffScreen([xPx, yPx]: Point2, [containerXpx, containerYpx]: Point2, marginPx = 0) {
  return xPx < -marginPx || xPx > containerXpx + marginPx || yPx < -marginPx || yPx > containerYpx + marginPx;
}

export function getCircleTexture(color: string, size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  return new CanvasTexture(canvas);
}
