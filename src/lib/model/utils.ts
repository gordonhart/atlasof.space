import { CanvasTexture, OrthographicCamera, Vector3 } from 'three';
import { Point2 } from '../types.ts';

export function isOffScreen([xPx, yPx]: Point2, [containerXpx, containerYpx]: Point2, marginPx = 0) {
  return xPx < -marginPx || xPx > containerXpx + marginPx || yPx < -marginPx || yPx > containerYpx + marginPx;
}

// TODO: is this math correct? seems 180º offset from the location of Earth at the equinox in March
export function vernalEquinox(camera: OrthographicCamera): Vector3 {
  // the Vernal Equinox is the direction of +X; find by applying matrix transformations from camera
  const localX = new Vector3(1, 0, 0); // TODO: no new allocation
  return localX.applyMatrix4(camera.matrixWorld).sub(camera.position).normalize();
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
