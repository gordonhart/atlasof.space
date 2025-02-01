import { MantineRadius } from '@mantine/core';
import { CelestialBody } from '../../lib/types.ts';
import { Thumbnail } from './Thumbnail.tsx';

type Props = {
  body: CelestialBody;
  size: number;
  radius?: MantineRadius;
};
export function CelestialBodyThumbnail({ body, size, radius }: Props) {
  const { name, type } = body;
  const search = `${name} ${type}`;
  return <Thumbnail thumbnail={body.assets?.thumbnail} search={search} size={size} radius={radius} />;
}
