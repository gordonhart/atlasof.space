import { useRef, useEffect } from 'react';
import { Group } from '@mantine/core';

type Point = {
  x: number;
  y: number;
}

type Body = {
  curr: Point;
  prev: Point;
  radius: BigInt; // m
  mass: BigInt; // kg
}

const SOL: Body = {
  curr: { x: 0, y: 0 },
  prev: { x: 0, y: 0 },
  radius: BigInt("695700000"), // 6.957e8 m
  mass: BigInt("1988500000000000000000000000000"), // 1.9885e30 kg
};
const MERCURY: Body = {
  curr: { x: 0, y: 0 },
  prev: { x: 0, y: 0 },
  radius: BigInt("2439700"), // 2439.7 km
  mass: BigInt("330110000000000000000000"), // 3.3011e23 kg
}

function step(body: Body, reference: Body): Body {
  return body;
}

export function SolarSystem() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current != null ) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }, [canvasRef.current])

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <canvas ref={canvasRef} />
    </Group>
  );
}