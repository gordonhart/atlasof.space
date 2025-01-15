import { Image } from '@mantine/core';
import { useState } from 'react';
import { asCdnUrl } from '../../lib/images.ts';
import { CelestialBody } from '../../lib/types.ts';

type Props = {
  body: CelestialBody;
  size: number;
};
export function Thumbnail({ body, size }: Props) {
  const { name, type } = body;
  const [isValid, setIsValid] = useState(false);
  const url =
    body.assets?.thumbnail != null
      ? asCdnUrl(body.assets.thumbnail)
      : `/api/thumbnail?${new URLSearchParams({ search: `${name} ${type}` })}`;
  const validStyle = isValid ? {} : { display: 'none' };
  return (
    <Image
      radius="md"
      src={url}
      maw={size}
      mah={size}
      style={validStyle}
      onLoad={() => setIsValid(true)}
      onError={() => setIsValid(false)}
    />
  );
}
