import { Carousel } from '@mantine/carousel';
import { Group, Image, Stack, Title } from '@mantine/core';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';

type Props = {
  urls: Array<string>;
};
export function Gallery({ urls }: Props) {
  const { xs: isXsDisplay } = useDisplaySize();
  const nPerRow = 3;
  const galleryGap = 16;
  const galleryImageWidth = 178;
  const images = urls.map((image, i) => (
    <Image key={i} radius="md" src={image} w={galleryImageWidth} h={galleryImageWidth} />
  ));
  return (
    <Stack p="md" pr={0} gap="xs">
      <Title order={5}>Gallery</Title>
      {isXsDisplay ? (
        <Carousel slideSize={galleryImageWidth} align="start" slideGap="md" withControls={false} dragFree loop>
          {images.map((image, i) => (
            <Carousel.Slide key={i} pr={i === images.length - 1 ? 'md' : undefined}>
              {image}
            </Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <Group gap={galleryGap} pr="md" maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
          {images}
        </Group>
      )}
    </Stack>
  );
}
