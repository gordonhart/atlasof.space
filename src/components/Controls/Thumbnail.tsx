import { Image } from '@mantine/core';
import { useState } from 'react';
import { CelestialBody } from '../../lib/types.ts';
import { Thumbnails } from '../../lib/images.ts';

type Props = {
  body: CelestialBody;
};
export function Thumbnail({ body }: Props) {
  const { name, type } = body;
  const [isValid, setIsValid] = useState(false);
  const thumbnailSize = 220;
  const url = Thumbnails[name] ?? `/api/thumbnail?${new URLSearchParams({ search: `${name} ${type}` })}`;
  const validStyle = isValid ? {} : { display: 'none' };
  return (
    <Image
      radius="md"
      src={url}
      maw={thumbnailSize}
      mah={thumbnailSize}
      style={validStyle}
      onLoad={() => setIsValid(true)}
      onError={() => setIsValid(false)}
    />
  );
}
