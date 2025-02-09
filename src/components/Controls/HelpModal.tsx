import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Divider,
  Group,
  Kbd,
  List,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowRight,
  IconArrowsMove,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandOpenSource,
  IconCircleDot,
  IconClick,
  IconHandClick,
  IconHandMove,
  IconHandTwoFingers,
  IconInfoHexagon,
  IconRotate3d,
  IconSearch,
  IconX,
  IconZoomScan,
} from '@tabler/icons-react';
import { ReactNode, useMemo } from 'react';
import { useDisplaySize } from '../../hooks/useDisplaySize.ts';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice.ts';
import { useModifierKey } from '../../hooks/useModifierKey.ts';
import { SPACECRAFT } from '../../lib/data/spacecraft.ts';
import { Settings } from '../../lib/state.ts';
import { CelestialBody, isCelestialBody, Spacecraft } from '../../lib/types.ts';
import { BodyCard } from '../FactSheet/BodyCard.tsx';
import { SpacecraftCard } from '../FactSheet/Spacecraft/SpacecraftCard.tsx';
import { iconSize } from './constants.ts';

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
  settings: Settings;
  updateSettings: (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
};
export function HelpModal({ isOpen, onClose, settings, updateSettings }: Props) {
  const isTouchDevice = useIsTouchDevice();
  const { sm: isSmallDisplay } = useDisplaySize();
  const modifierKey = useModifierKey();
  const sampleItems = useMemo(
    () => [...settings.bodies, ...SPACECRAFT].sort(() => Math.random() - 0.5).slice(0, 3),
    []
  );

  function onCardClick({ id }: CelestialBody | Spacecraft) {
    updateSettings({ center: id });
    onClose();
  }

  const sampleItemCards = sampleItems.map(item =>
    isCelestialBody(item) ? (
      <BodyCard key={item.id} body={item} onClick={() => onCardClick(item)} />
    ) : (
      <SpacecraftCard key={item.id} spacecraft={item} onClick={() => onCardClick(item)} compact />
    )
  );

  return (
    <Modal
      size="xl"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      styles={{
        body: {
          padding: 0,
        },
        content: {
          border: '1px solid var(--mantine-color-gray-8)',
          borderRadius: 'var(--mantine-radius-md)',
          overflow: 'auto',
          backgroundColor: 'black',
        },
      }}
    >
      <Stack gap={0} fz="sm" bg="black">
        <Stack gap={0} pos="sticky" top={0} bg="black" style={{ zIndex: 10 /* above content */ }}>
          <Group p="md" justify="space-between" align="center" gap="xs">
            <Group gap="xs">
              <IconCircleDot {...iconProps} />
              <Title order={5}>Atlas of Space</Title>
            </Group>
            <ActionIcon onClick={onClose}>
              <IconX {...iconProps} />
            </ActionIcon>
          </Group>
          <Divider />
        </Stack>
        <Stack p="md" gap="md">
          <HighlightedText
            segments={[
              { content: 'Welcome to the Atlas of Space — an ' },
              { content: 'interactive visualization', highlight: true },
              { content: ' to explore the planets, moons, asteroids, and other objects in the Solar System.' },
            ]}
          />
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
              { content: <IconInfoHexagon size={14} style={{ marginBottom: -2 }} />, highlight: true },
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
          {isSmallDisplay ? (
            <Stack gap="xs">{sampleItemCards}</Stack>
          ) : (
            <SimpleGrid cols={3}>{sampleItemCards}</SimpleGrid>
          )}
        </Stack>
        <Divider />
        <Group p="md" gap={4} justify="center">
          <Group gap={4} wrap="nowrap">
            <IconBrandOpenSource size={iconSize} color="var(--mantine-color-dimmed)" />
            <Text c="dimmed" fz="xs">
              2024-{new Date().getFullYear()}
            </Text>
          </Group>
          <Anchor href="https://github.com/gordonhart/atlasof.space">
            <Group gap={4} wrap="nowrap">
              <IconBrandGithub size={iconSize} color="var(--mantine-color-dimmed)" />
              <Text fz="xs" c="dimmed" fw="bold">
                @gordonhart/atlasof.space
              </Text>
              <IconArrowUpRight size={iconSize} color="var(--mantine-color-dimmed)" />
            </Group>
          </Anchor>
        </Group>
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
