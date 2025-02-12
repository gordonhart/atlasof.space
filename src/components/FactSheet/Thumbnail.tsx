import { Box, Image, MantineRadius } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { asCdnUrl } from '../../lib/images.ts';

type Props = {
  thumbnail?: string;
  alt?: string;
  search?: string; // used to search if thumbnail is absent
  size: number;
  radius?: MantineRadius;
  lazy?: boolean;
};
export function Thumbnail({ thumbnail, alt, search = '', size, radius = 'md', lazy = false }: Props) {
  const { ref, inViewport } = useInViewport();
  const [isValid, setIsValid] = useState(false);
  const url = thumbnail != null ? asCdnUrl(thumbnail) : `/api/thumbnail?${new URLSearchParams({ search })}`;
  const validStyle = isValid ? {} : { display: 'none' };

  // lazy-load but track when it has loaded to keep the component rendered after it has been shown once
  const hasRendered = useRef(!lazy);
  useEffect(() => {
    hasRendered.current = hasRendered.current || inViewport;
  }, [inViewport]);

  const ImageComponent = (
    <Image
      key={url}
      radius={radius}
      src={url}
      alt={alt}
      maw={size}
      mah={size}
      style={validStyle}
      onLoad={() => setIsValid(true)}
      onError={() => setIsValid(false)}
    />
  );
  return lazy ? <Box ref={ref}>{(inViewport || hasRendered.current) && ImageComponent}</Box> : ImageComponent;
}
