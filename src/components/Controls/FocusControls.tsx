import { Box, Button, Group, Menu, Stack, Text, Transition } from '@mantine/core';
import { IconCircle, IconCircleDot, IconCircleFilled } from '@tabler/icons-react';
import { CELESTIAL_BODY_CLASSES, CELESTIAL_BODY_NAMES, CELESTIAL_BODY_SHORT_NAMES } from '../../lib/constants.ts';
import { celestialBodyTypeName, findCelestialBody } from '../../lib/utils.ts';
import { CelestialBodyState } from '../../lib/types.ts';
import { FactCard } from './FactCard.tsx';
import { useMemo } from 'react';
import { buttonGap, iconSize, AppStateControlProps } from './constants.ts';

type Props = AppStateControlProps & {
  systemState: CelestialBodyState;
};
export function FocusControls({ state, updateState, systemState }: Props) {
  const focusBody = useMemo(
    () => (state.hover != null ? findCelestialBody(systemState, state.hover) : null),
    [state.hover]
  );

  return (
    <Stack gap="xs">
      <Group gap={buttonGap}>
        <Menu position="top-start" offset={0} width={200}>
          <Menu.Target>
            <Button leftSection={<IconCircleDot size={iconSize} />} size="xs" variant="subtle" color="gray">
              {state.center}
            </Button>
          </Menu.Target>
          <Menu.Dropdown mah={window.innerHeight - 150} style={{ overflow: 'auto' }}>
            {CELESTIAL_BODY_NAMES.map((name, i) => (
              <Menu.Item key={name} onClick={() => updateState({ center: name })}>
                <Group gap="xs" justify="space-between" wrap="nowrap">
                  <Group gap="xs" align="center" wrap="nowrap">
                    {state.center === name ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
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
      </Group>

      <Transition mounted={focusBody != null} transition="fade" duration={400} timingFunction="ease">
        {styles => <Box style={styles}>{focusBody != null && <FactCard body={focusBody} />}</Box>}
      </Transition>
    </Stack>
  );
}
