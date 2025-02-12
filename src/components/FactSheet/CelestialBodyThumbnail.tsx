import { MantineRadius } from '@mantine/core';
import { CelestialBody } from '../../lib/types.ts';
import { Thumbnail } from './Thumbnail.tsx';

type Props = {
  body: CelestialBody;
  size: number;
  radius?: MantineRadius;
  lazy?: boolean;
};
export function CelestialBodyThumbnail({ body, size, radius, lazy }: Props) {
  const { name, type } = body;
  const search = `${name} ${type}`;
  return (
    <Thumbnail
      thumbnail={body.assets?.thumbnail}
      alt={body.name}
      search={search}
      size={size}
      radius={radius}
      lazy={lazy}
    />
  );
}
