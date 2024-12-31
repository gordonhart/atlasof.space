import { Group, Image, Stack, Title } from '@mantine/core';

type Props = {
  urls: Array<string>;
};
export function Gallery({ urls }: Props) {
  const nPerRow = 3;
  const galleryGap = 16;
  const galleryImageWidth = 178;
  return (
    <Stack p="md" gap="xs">
      <Title order={5}>Gallery</Title>
      <Group gap={galleryGap} maw={galleryImageWidth * nPerRow + galleryGap * (nPerRow - 1)}>
        {urls.map((image, i) => (
          <Image key={i} radius="md" src={image} w={galleryImageWidth} h={galleryImageWidth} />
        ))}
      </Group>
    </Stack>
  );
}
