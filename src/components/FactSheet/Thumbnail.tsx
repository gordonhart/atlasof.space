import { Image } from '@mantine/core';
import { useState } from 'react';
import { asCdnUrl } from '../../lib/images.ts';

type Props = {
  thumbnail?: string;
  search?: string; // used to search if thumbnail is absent
  size: number;
};
export function Thumbnail({ thumbnail, search = '', size }: Props) {
  const [isValid, setIsValid] = useState(false);
  const url = thumbnail != null ? asCdnUrl(thumbnail) : `/api/thumbnail?${new URLSearchParams({ search })}`;
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
