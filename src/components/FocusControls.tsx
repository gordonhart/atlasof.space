import { ActionIcon, Box, Button, Group, Menu, Stack, Text, Tooltip, Transition } from '@mantine/core';
import { IconCircle, IconCircleDot, IconCircleFilled, IconEyeCog } from '@tabler/icons-react';
import { CELESTIAL_BODY_CLASSES, CELESTIAL_BODY_NAMES, findCelestialBody } from '../lib/constants.ts';
import { celestialBodyTypeName } from '../lib/utils.ts';
import { AppState } from '../lib/state.ts';
import { CelestialBodyState, CelestialBodyType } from '../lib/types.ts';
import { FactCard } from './FactCard.tsx';
import { useMemo } from 'react';

const iconSize = 14;
const menuDropdownProps = { mah: window.innerHeight - 150, style: { overflow: 'auto' } };

type Props = {
  state: AppState;
  updateState: (state: Partial<AppState>) => void;
  systemState: CelestialBodyState;
};
export function FocusControls({ state, updateState, systemState }: Props) {
  const focusBody = useMemo(
    () => (state.hover != null ? findCelestialBody(systemState, state.hover) : null),
    [state.hover]
  );

  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = state.visibleTypes.has(type)
      ? new Set([...state.visibleTypes].filter(t => t !== type))
      : new Set([...state.visibleTypes, type]);
    updateState({ visibleTypes: newVisibleTypes });
  }

  return (
    <Stack gap="xs">
      <Group gap={2}>
        <Menu position="top-start" offset={0} width={200}>
          <Menu.Target>
            <Button leftSection={<IconCircleDot size={iconSize} />} size="xs" variant="subtle" color="gray">
              {state.center}
            </Button>
          </Menu.Target>
          <Menu.Dropdown {...menuDropdownProps}>
            {CELESTIAL_BODY_NAMES.map((name, i) => (
              <Menu.Item key={name} onClick={() => updateState({ center: name })}>
                <Group gap="xs" justify="space-between">
                  <Group gap="xs" align="center">
                    {state.center === name ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                    {name}
                  </Group>
                  <Text size="xs" c="dimmed">
                    {celestialBodyTypeName(CELESTIAL_BODY_CLASSES[i])}
                  </Text>
                </Group>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <Menu position="top-start" offset={0} width={120} closeOnItemClick={false}>
          <Menu.Target>
            <Tooltip position="right" label="Toggle Visibility">
              <ActionIcon>
                <IconEyeCog size={iconSize} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown {...menuDropdownProps}>
            {(['sun', 'planet', 'moon', 'asteroid', 'trans-neptunian-object'] as Array<CelestialBodyType>).map(type => (
              <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
                <Group gap="xs" align="center">
                  {state.visibleTypes.has(type) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                  {celestialBodyTypeName(type)}
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
