import { Box, Button, Group, Menu, Stack, Text, Transition } from '@mantine/core';
import { IconCircle, IconCircleDot, IconCircleFilled } from '@tabler/icons-react';
import { CELESTIAL_BODY_CLASSES, CELESTIAL_BODY_NAMES, CELESTIAL_BODY_SHORT_NAMES } from '../../lib/bodies.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { CelestialBodyState } from '../../lib/types.ts';
import { FactCard } from './FactCard.tsx';
import { useMemo } from 'react';
import { iconSize, AppStateControlProps } from './constants.ts';
import { AppState } from '../../lib/state.ts';

type Props = Pick<AppStateControlProps, 'updateState'> &
  Pick<AppState, 'hover' | 'center'> & {
    systemState: Record<string, CelestialBodyState>;
  };
export function FocusControls({ hover, center, updateState, systemState }: Props) {
  const focusBody = useMemo(() => (hover != null ? systemState[hover] : null), [hover]);

  return (
    <Stack gap="xs" align="flex-start">
      <Menu position="top-start" offset={0} width={200}>
        <Menu.Target>
          <Button leftSection={<IconCircleDot size={iconSize} />} size="xs" variant="subtle" color="gray">
            {center}
          </Button>
        </Menu.Target>
        <Menu.Dropdown mah={window.innerHeight - 150} style={{ overflow: 'auto' }}>
          {CELESTIAL_BODY_NAMES.map((name, i) => (
            <Menu.Item key={name} onClick={() => updateState({ center: name })}>
              <Group gap="xs" justify="space-between" wrap="nowrap">
                <Group gap="xs" align="center" wrap="nowrap">
                  {center === name ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                  {CELESTIAL_BODY_SHORT_NAMES[i] ?? name}
                </Group>
                <Text size="xs" c="dimmed">
                  {celestialBodyTypeName(CELESTIAL_BODY_CLASSES[i])}
                </Text>
              </Group>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Transition mounted={focusBody != null} transition="slide-right" duration={200} timingFunction="ease">
        {styles => <Box style={styles}>{focusBody != null && <FactCard body={focusBody} />}</Box>}
      </Transition>
    </Stack>
  );
}
