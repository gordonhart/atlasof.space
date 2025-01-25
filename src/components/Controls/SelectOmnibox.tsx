import { ActionIcon, Box, Group, Kbd, Text, Tooltip } from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useModifierKey } from '../../hooks/useModifierKey.ts';
import { LABEL_FONT_FAMILY } from '../../lib/canvas.ts';
import { ORBITAL_REGIMES, orbitalRegimeDisplayName } from '../../lib/regimes.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody } from '../../lib/types.ts';
import { celestialBodyTypeDescription } from '../../lib/utils.ts';
import { CelestialBodyThumbnail } from '../FactSheet/CelestialBodyThumbnail.tsx';
import { iconSize } from './constants.ts';
import styles from './SelectOmnibox.module.css';

type Props = {
  settings: Settings;
  updateSettings: UpdateSettings;
};
export function SelectOmnibox({ settings, updateSettings }: Props) {
  const [query, setQuery] = useState('');
  const modifierKey = useModifierKey();

  const bodyItems = useMemo(
    () =>
      settings.bodies
        .filter(body => query.length === 0 || matchesQuery(body, query))
        .map((body, i) => (
          <Spotlight.Action
            key={`${body.name}-${i}`}
            label={body.name}
            className={styles.Action}
            ff={LABEL_FONT_FAMILY}
            leftSection={
              // TODO: lazy load thumbnails for visible objects only
              <Box miw={24}>
                <CelestialBodyThumbnail body={body} size={24} />
              </Box>
            }
            rightSection={
              <Text c="dimmed" size="xs" ff={LABEL_FONT_FAMILY}>
                {celestialBodyTypeDescription(body)}
              </Text>
            }
            onClick={() => updateSettings(prev => ({ ...prev, center: body.id }))}
          />
        )),
    [query, JSON.stringify(settings.bodies)]
  );

  const regimeItems = useMemo(
    () =>
      Object.values(ORBITAL_REGIMES)
        .filter(({ id }) => orbitalRegimeDisplayName(id).toLowerCase().includes(query.toLowerCase()))
        .map(({ id }, i) => (
          <Spotlight.Action
            key={`${id}-${i}`}
            label={orbitalRegimeDisplayName(id)}
            className={styles.Action}
            ff={LABEL_FONT_FAMILY}
            rightSection={
              <Text c="dimmed" size="xs" ff={LABEL_FONT_FAMILY}>
                Orbital Regime
              </Text>
            }
            onClick={() => updateSettings(prev => ({ ...prev, center: id }))}
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
            styles={{ input: { fontFamily: LABEL_FONT_FAMILY } }}
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
            {bodyItems.length + regimeItems.length < 1 && (
              <Spotlight.Empty ff={LABEL_FONT_FAMILY}>Nothing found...</Spotlight.Empty>
            )}
            {bodyItems.length > 0 && (
              <Spotlight.ActionsGroup ff={LABEL_FONT_FAMILY} label="Celestial Bodies">
                <Box pb="xs" />
                {bodyItems}
              </Spotlight.ActionsGroup>
            )}
            {regimeItems.length > 0 && (
              <Spotlight.ActionsGroup ff={LABEL_FONT_FAMILY} label="Orbital Regimes">
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
