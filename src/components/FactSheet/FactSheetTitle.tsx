import { ActionIcon, Box, Group, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { HexColor } from '../../lib/types.ts';
import { iconSize } from '../Controls/constants.ts';

type Props = {
  title: string;
  subTitle: string;
  color: HexColor;
  onClose: () => void;
  onHover?: (hovered: boolean) => void;
};
export function FactSheetTitle({ title, subTitle, color, onClose, onHover }: Props) {
  const { sm: isSmallDisplay } = useDisplaySize();
  return (
    <Group
      pos="sticky"
      top={0}
      bg="black"
      px="md"
      py={isSmallDisplay ? 8 : 'md'}
      gap="xs"
      justify="space-between"
      wrap="nowrap"
      style={{ borderBottom: `1px solid ${color}`, zIndex: 10 /* above gallery images */ }}
      onMouseEnter={onHover != null ? () => onHover(true) : undefined}
      onMouseLeave={onHover != null ? () => onHover(false) : undefined}
    >
      <Caret position="tl" color={color} />
      <Caret position="br" color={color} />
      <Group gap={0} align="baseline">
        <Title order={2} pr="xs">
          {title}
        </Title>
        <Title order={6} c="dimmed">
          {subTitle}
        </Title>
      </Group>
      <ActionIcon onClick={onClose}>
        <IconX size={iconSize} />
      </ActionIcon>
    </Group>
  );
}

function Caret({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 8;
  const pad = 'calc(var(--mantine-spacing-md) / 4)';
  const border = `1px solid ${color}`;
  return (
    <Box
      pos="absolute"
      w={size}
      h={size}
      top={position.startsWith('t') ? pad : undefined}
      left={position.endsWith('l') ? pad : undefined}
      right={position.endsWith('r') ? pad : undefined}
      bottom={position.startsWith('b') ? pad : undefined}
      style={{
        borderTop: position.startsWith('t') ? border : undefined,
        borderLeft: position.endsWith('l') ? border : undefined,
        borderRight: position.endsWith('r') ? border : undefined,
        borderBottom: position.startsWith('b') ? border : undefined,
      }}
    />
  );
}
