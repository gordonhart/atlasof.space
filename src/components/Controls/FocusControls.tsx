import { Box, Button, Group, Menu, Stack, Text, Transition } from '@mantine/core';
import { IconCircle, IconCircleDot, IconCircleFilled } from '@tabler/icons-react';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { FactCard } from './FactCard.tsx';
import { iconSize, AppStateControlProps } from './constants.ts';
import { AppState } from '../../lib/state.ts';
import { memo, useMemo } from 'react';

type Props = Pick<AppStateControlProps, 'updateState'> & Pick<AppState, 'hover' | 'center' | 'bodies'>;
export const FocusControls = memo(function FocusControlsComponent({ hover, center, bodies, updateState }: Props) {
  const bodiesString = JSON.stringify(bodies);
  const celestialBodyNames = useMemo(() => bodies.map(({ name }) => name), [bodiesString]);
  const celestialBodyByName = useMemo(() => Object.fromEntries(bodies.map(body => [body.name, body])), [bodiesString]);
  const focusBody = hover != null ? celestialBodyByName[hover] : undefined;

  return (
    <Stack gap="xs" align="flex-start">
      <Menu position="top-start" offset={0} width={200}>
        <Menu.Target>
          <Button leftSection={<IconCircleDot size={iconSize} />} size="xs" variant="subtle" color="gray">
            {center}
          </Button>
        </Menu.Target>
        <Menu.Dropdown mah={window.innerHeight - 150} style={{ overflow: 'auto' }}>
          {celestialBodyNames.map(name => (
            <Menu.Item key={name} onClick={() => updateState({ center: name })}>
              <Group gap="xs" justify="space-between" wrap="nowrap">
                <Group gap="xs" align="center" wrap="nowrap">
                  {center === name ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                  {celestialBodyByName[name].shortName ?? name}
                </Group>
                <Text size="xs" c="dimmed">
                  {celestialBodyTypeName(celestialBodyByName[name].type)}
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
});
