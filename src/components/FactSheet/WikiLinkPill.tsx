import { Group, Pill, UnstyledButton } from '@mantine/core';
import { IconArrowUpRight, IconBrandWikipedia } from '@tabler/icons-react';
import styles from './RelatedBodies.module.css';

type Props = {
  url: string;
};
export function WikiLinkPill({ url }: Props) {
  return (
    <UnstyledButton component="a" href={url} target="_blank">
      <Pill className={styles.LinkPill}>
        <Group gap={4} wrap="nowrap">
          <IconBrandWikipedia size={14} />
          Wikipedia
          <IconArrowUpRight size={14} />
        </Group>
      </Pill>
    </UnstyledButton>
  );
}
