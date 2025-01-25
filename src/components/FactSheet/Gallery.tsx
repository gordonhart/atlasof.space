import { Carousel } from '@mantine/carousel';
import { Group, Image, Stack, Title } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { asCdnUrl } from '../../lib/images.ts';
import { GalleryAsset } from '../../lib/types.ts';
import styles from './Gallery.module.css';

const VIDEO_EXTENSIONS = ['mp4'];

type Props = {
  assets: Array<GalleryAsset>;
};
export function Gallery({ assets }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const nPerRow = 3;
  const galleryGap = 16;
  const galleryImageWidth = 178;
  const assetComponents = assets.map((asset, i) =>
    VIDEO_EXTENSIONS.some(ext => asset.filename.endsWith(ext)) ? (
      <Stack key={i} align="center" style={{ overflow: 'hidden' }}>
        <video
          src={asCdnUrl(asset.filename)}
          width={galleryImageWidth}
          height={galleryImageWidth}
          controls={false}
          autoPlay
          loop
        />
      </Stack>
    ) : (
      <Image key={i} radius="md" src={asCdnUrl(asset.filename)} w={galleryImageWidth} h={galleryImageWidth} />
    )
  );
  return (
    <Stack p="md" pt="xl" gap="xs">
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
          {assetComponents.map((component, i) => (
            <Carousel.Slide key={i}>{component}</Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <Group gap={galleryGap} maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
          {assetComponents}
        </Group>
      )}
    </Stack>
  );
}
