import { ActionIcon, Box, Button, Divider, Group, Kbd, List, Modal, Stack, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconArrowsMove,
  IconCircleDot,
  IconClick,
  IconHandClick,
  IconHandMove,
  IconHandTwoFingers,
  IconHelp,
  IconRotate3d,
  IconSearch,
  IconX,
  IconZoomScan,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice.ts';
import { useModifierKey } from '../../hooks/useModifierKey.ts';

const iconProps = { size: 20, color: 'var(--mantine-color-dimmed)' };

const MOUSE_BULLETS = [
  {
    IconComponent: IconZoomScan,
    segments: [{ content: 'Scroll', highlight: true }, { content: ' to zoom' }],
  },
  {
    IconComponent: IconRotate3d,
    segments: [{ content: 'Click + drag', highlight: true }, { content: ' to rotate' }],
  },
  {
    IconComponent: IconArrowsMove,
    segments: [{ content: 'Right-click + drag', highlight: true }, { content: ' to pan' }],
  },
  {
    IconComponent: IconClick,
    segments: [{ content: 'Click', highlight: true }, { content: ' on an object to learn more' }],
  },
];
const TOUCH_BULLETS = [
  {
    IconComponent: IconZoomScan,
    segments: [{ content: 'Pinch', highlight: true }, { content: ' to zoom' }],
  },
  {
    IconComponent: IconHandMove,
    segments: [{ content: 'Drag', highlight: true }, { content: ' to rotate' }],
  },
  {
    IconComponent: IconHandTwoFingers,
    segments: [{ content: 'Drag with two fingers', highlight: true }, { content: ' to pan' }],
  },
  {
    IconComponent: IconHandClick,
    segments: [{ content: 'Tap', highlight: true }, { content: ' on an object to learn more' }],
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export function HelpModal({ isOpen, onClose }: Props) {
  const isTouchDevice = useIsTouchDevice();
  const modifierKey = useModifierKey();

  return (
    <Modal
      size="md"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      centered
      overlayProps={{
        backgroundOpacity: 0,
        style: { backdropFilter: 'blur(4px)' },
      }}
      transitionProps={{ transition: 'fade' }}
    >
      <Stack
        gap={0}
        fz="sm"
        bg="black"
        style={{
          border: '1px solid var(--mantine-color-gray-8)',
          borderRadius: 'var(--mantine-radius-md)',
        }}
      >
        <Group p="md" justify="space-between" align="center" gap="xs">
          <Group gap="xs">
            <IconCircleDot {...iconProps} />
            <Title order={5}>The Atlas of Space</Title>
          </Group>
          <ActionIcon onClick={onClose}>
            <IconX {...iconProps} />
          </ActionIcon>
        </Group>
        <Divider />
        <Stack p="md" gap="md">
          <HighlightedText
            segments={[
              { content: 'The Atlas of Space is an ' },
              { content: 'interactive visualization', highlight: true },
              { content: ' of the planets, moons, asteroids, and other objects in the Solar System.' },
            ]}
          />
          {/* TODO: change wording if user is on mobile */}
          <List fz="sm" spacing="xs" withPadding center>
            {(isTouchDevice ? TOUCH_BULLETS : MOUSE_BULLETS).map(({ IconComponent, segments }, i) => (
              <ControlBullet key={i} IconComponent={IconComponent} segments={segments} />
            ))}
          </List>
          <HighlightedText
            segments={[
              { content: 'Use ' },
              { content: 'Search ', highlight: true },
              { content: <IconSearch size={14} style={{ marginBottom: -2 }} />, highlight: true },
              // prettier-ignore
              ...(isTouchDevice
                ? []
                : [
                  { content: ' or ' },
                  { content: <Kbd>{modifierKey}</Kbd> },
                  { content: ' + ' },
                  { content: <Kbd>k</Kbd> },
                ]),
              { content: ' to jump to a specific planet.' },
            ]}
          />
          <HighlightedText
            segments={[
              { content: 'Use the controls at the bottom of the screen to change settings or click ' },
              { content: 'Help ', highlight: true },
              { content: <IconHelp size={14} style={{ marginBottom: -2 }} />, highlight: true },
              { content: ' to open this menu.' },
            ]}
          />
          <Button
            variant="light"
            color="blue"
            rightSection={<IconArrowRight size={iconProps.size} />}
            onClick={onClose}
            data-autofocus
          >
            Get Started
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

type HighlightedTextProps = { segments: Array<{ content: ReactNode; highlight?: boolean }> };
function HighlightedText({ segments }: HighlightedTextProps) {
  return (
    <Box>
      {segments.map(({ content, highlight = false }, i) => (
        <Text key={i} span inherit c={highlight ? undefined : 'dimmed'}>
          {content}
        </Text>
      ))}
    </Box>
  );
}

function ControlBullet({
  IconComponent,
  segments,
}: {
  IconComponent: ({ size }: { size: number; color: string }) => ReactNode;
} & HighlightedTextProps) {
  return (
    <List.Item icon={<IconComponent size={iconProps.size} color="var(--mantine-color-blue-light-color)" />}>
      <HighlightedText segments={segments} />
    </List.Item>
  );
}
