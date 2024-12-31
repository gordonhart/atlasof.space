import { useMemo, useState } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { ActionIcon, Box, Group, Kbd, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Thumbnail } from '../FactSheet/Thumbnail.tsx';
import styles from './SelectControls.module.css';
import { AppStateControlProps, iconSize } from './constants.ts';
import { CelestialBody } from '../../lib/types.ts';
import { celestialBodyTypeDescription, pluralize } from '../../lib/utils.ts';
import { useModifierKey } from '../../hooks/useModifierKey.ts';

const N_LIMIT = 7;

export function SelectOmnibox({ state, updateState }: AppStateControlProps) {
  const [query, setQuery] = useState('');
  const modifierKey = useModifierKey();

  function handleSelect(body: CelestialBody) {
    updateState(prev => ({ ...prev, center: body.name, visibleTypes: new Set([...prev.visibleTypes, body.type]) }));
  }

  const items = useMemo(
    () =>
      state.bodies
        .filter(body => query.length === 0 || matchesQuery(body, query))
        .map((body, i) => (
          <Spotlight.Action
            key={`${body.name}-${i}`}
            label={body.name}
            className={styles.Action}
            leftSection={<Thumbnail body={body} size={24} />}
            rightSection={
              <Text c="dimmed" size="xs">
                {celestialBodyTypeDescription(body)}
              </Text>
            }
            onClick={() => handleSelect(body)}
          />
        )),
    [query, JSON.stringify(state.bodies)]
  );

  return (
    <>
      <ActionIcon onClick={spotlight.open}>
        <IconSearch size={iconSize} />
      </ActionIcon>

      <Spotlight.Root
        radius="md"
        query={query}
        onQueryChange={setQuery}
        overlayProps={{ opacity: 0 }}
        onSpotlightClose={() => setQuery('')}
        transitionProps={{ transition: 'fade', duration: 200 }}
        scrollable
      >
        <Box
          bg="black"
          style={{
            overflow: 'auto',
            border: '1px solid var(--mantine-color-gray-8)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <Spotlight.Search
            placeholder="Enter name..."
            leftSection={<IconSearch stroke={1.5} />}
            rightSection={
              modifierKey != null ? (
                <Group gap={2} w={80} wrap="nowrap" style={{ flexShrink: 0 }}>
                  <Kbd>{modifierKey}</Kbd>+<Kbd>k</Kbd>
                </Group>
              ) : undefined
            }
          />
          <Spotlight.ActionsList style={{ overflow: 'auto' }}>
            {items.length > 0 ? items : <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
          </Spotlight.ActionsList>
          {items.length > N_LIMIT && (
            <Spotlight.Footer>
              <Group justify="center">
                <Text c="dimmed" fs="italic" size="xs">
                  and {pluralize(items.length - N_LIMIT, 'other')}
                </Text>
              </Group>
            </Spotlight.Footer>
          )}
        </Box>
      </Spotlight.Root>
    </>
  );
}

function matchesQuery(body: CelestialBody, query: string) {
  return `${body.shortName} ${body.name} ${celestialBodyTypeDescription(body)}`
    .toLowerCase()
    .includes(query.toLowerCase());
}
