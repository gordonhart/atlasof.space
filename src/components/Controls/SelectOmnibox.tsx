import { useMemo, useState } from 'react';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { ActionIcon, Box, Group, Kbd, Text, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Thumbnail } from '../FactSheet/Thumbnail.tsx';
import styles from './SelectOmnibox.module.css';
import { AppStateControlProps, iconSize } from './constants.ts';
import { CelestialBody } from '../../lib/types.ts';
import { celestialBodyTypeDescription } from '../../lib/utils.ts';
import { useModifierKey } from '../../hooks/useModifierKey.ts';
import { ORBITAL_REGIMES } from '../../lib/regimes.ts';

export function SelectOmnibox({ state, updateState }: AppStateControlProps) {
  const [query, setQuery] = useState('');
  const modifierKey = useModifierKey();

  function handleSelect(body: CelestialBody) {
    updateState(prev => ({ ...prev, center: body.name, visibleTypes: new Set([...prev.visibleTypes, body.type]) }));
  }

  const bodyItems = useMemo(
    () =>
      state.bodies
        .filter(body => query.length === 0 || matchesQuery(body, query))
        .map((body, i) => (
          <Spotlight.Action
            key={`${body.name}-${i}`}
            label={body.name}
            className={styles.Action}
            leftSection={
              // TODO: lazy load thumbnails for visible objects only
              <Box miw={24}>
                <Thumbnail body={body} size={24} />
              </Box>
            }
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

  const regimeItems = useMemo(
    () =>
      Object.values(ORBITAL_REGIMES)
        .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
        .map(({ name }, i) => (
          <Spotlight.Action
            key={`${name}-${i}`}
            label={name}
            className={styles.Action}
            rightSection={
              <Text c="dimmed" size="xs">
                Orbital Regime
              </Text>
            }
            onClick={() =>
              updateState(prev => ({ ...prev, center: name, visibleRegimes: new Set([...prev.visibleRegimes, name]) }))
            }
          />
        )),
    [query]
  );

  return (
    <>
      <Tooltip position="top" label="Search">
        <ActionIcon onClick={spotlight.open}>
          <IconSearch size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Spotlight.Root
        radius="md"
        query={query}
        onQueryChange={setQuery}
        onSpotlightClose={() => setQuery('')}
        overlayProps={{ blur: 4, backgroundOpacity: 0 }}
        transitionProps={{ transition: 'fade' }}
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
            {bodyItems.length + regimeItems.length < 1 && <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
            {bodyItems.length > 0 && (
              <Spotlight.ActionsGroup label="Celestial Bodies">
                <Box pb="xs" />
                {bodyItems}
              </Spotlight.ActionsGroup>
            )}
            {regimeItems.length > 0 && (
              <Spotlight.ActionsGroup label="Orbital Regimes">
                <Box pb="xs" />
                {regimeItems}
              </Spotlight.ActionsGroup>
            )}
          </Spotlight.ActionsList>
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
