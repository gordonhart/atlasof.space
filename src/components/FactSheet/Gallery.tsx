import { Carousel } from '@mantine/carousel';
import { Group, Image, Stack, Title } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import styles from './Gallery.module.css';

type Props = {
  urls: Array<string>;
};
export function Gallery({ urls }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const nPerRow = 3;
  const galleryGap = 16;
  const galleryImageWidth = 178;
  const images = urls.map((image, i) => (
    <Image key={i} radius="md" src={image} w={galleryImageWidth} h={galleryImageWidth} />
  ));
  return (
    <Stack p="md" gap="xs">
      <Title order={5}>Gallery</Title>
      {isXsDisplay ? (
        <Carousel
          classNames={styles}
          slidesToScroll={1}
          slideSize={galleryImageWidth}
          plugins={[autoplay.current]}
          align="start"
          slideGap="md"
          dragFree
          loop
        >
          {images.map((image, i) => (
            <Carousel.Slide key={i}>{image}</Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <Group gap={galleryGap} maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
          {images}
        </Group>
      )}
    </Stack>
  );
}
