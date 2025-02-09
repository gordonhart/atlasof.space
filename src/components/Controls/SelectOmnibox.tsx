import { ActionIcon, Box, Group, Kbd, Text, Tooltip } from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useModifierKey } from '../../hooks/useModifierKey.ts';
import { LABEL_FONT_FAMILY } from '../../lib/canvas.ts';
import { SPACECRAFT_ORGANIZATIONS } from '../../lib/data/organizations.ts';
import { ORBITAL_REGIMES, orbitalRegimeDisplayName } from '../../lib/data/regimes.ts';
import { SPACECRAFT } from '../../lib/data/spacecraft.ts';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody } from '../../lib/types.ts';
import { celestialBodyTypeDescription } from '../../lib/utils.ts';
import { CelestialBodyThumbnail } from '../FactSheet/CelestialBodyThumbnail.tsx';
import { Thumbnail } from '../FactSheet/Thumbnail.tsx';
import { iconSize } from './constants.ts';
import styles from './SelectOmnibox.module.css';

const THUMBNAIL_SIZE = 24;

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
              <Box miw={THUMBNAIL_SIZE}>
                <CelestialBodyThumbnail body={body} size={THUMBNAIL_SIZE} radius="sm" lazy />
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

  const spacecraftItems = useMemo(
    () =>
      SPACECRAFT.filter(({ name }) => query.length === 0 || name.toLowerCase().includes(query.toLowerCase())).map(
        (spacecraft, i) => (
          <Spotlight.Action
            key={`${spacecraft.name}-${i}`}
            label={spacecraft.name}
            className={styles.Action}
            ff={LABEL_FONT_FAMILY}
            leftSection={
              <Box miw={THUMBNAIL_SIZE}>
                <Thumbnail thumbnail={spacecraft.thumbnail} size={THUMBNAIL_SIZE} radius="sm" lazy />
              </Box>
            }
            rightSection={
              <Text c="dimmed" size="xs" ff={LABEL_FONT_FAMILY}>
                {spacecraft.organization} Spacecraft
              </Text>
            }
            onClick={() => updateSettings(prev => ({ ...prev, center: spacecraft.id }))}
          />
        )
      ),
    [query, JSON.stringify(settings.bodies)]
  );

  const organizationItems = useMemo(
    () =>
      Object.values(SPACECRAFT_ORGANIZATIONS)
        .filter(({ name, shortName }) => `${name} (${shortName})`.toLowerCase().includes(query.toLowerCase()))
        .map(({ id, shortName, thumbnail }, i) => (
          <Spotlight.Action
            key={`${id}-${i}`}
            label={shortName}
            className={styles.Action}
            ff={LABEL_FONT_FAMILY}
            leftSection={
              <Box miw={THUMBNAIL_SIZE}>
                <Thumbnail thumbnail={thumbnail} size={THUMBNAIL_SIZE} radius="sm" lazy />
              </Box>
            }
            rightSection={
              <Text c="dimmed" size="xs" ff={LABEL_FONT_FAMILY}>
                Organization
              </Text>
            }
            onClick={() => updateSettings(prev => ({ ...prev, center: id }))}
          />
        )),
    [query]
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
            overflowX: 'hidden',
            overflowY: 'auto',
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
            {bodyItems.length + spacecraftItems.length + organizationItems.length + regimeItems.length < 1 && (
              <Spotlight.Empty ff={LABEL_FONT_FAMILY}>Nothing found...</Spotlight.Empty>
            )}
            {bodyItems.length > 0 && (
              <Spotlight.ActionsGroup ff={LABEL_FONT_FAMILY} label="Celestial Bodies">
                <Box pb="xs" />
                {bodyItems}
              </Spotlight.ActionsGroup>
            )}
            {spacecraftItems.length > 0 && (
              <Spotlight.ActionsGroup ff={LABEL_FONT_FAMILY} label="Spacecraft">
                <Box pb="xs" />
                {spacecraftItems}
              </Spotlight.ActionsGroup>
            )}
            {organizationItems.length > 0 && (
              <Spotlight.ActionsGroup ff={LABEL_FONT_FAMILY} label="Space Exploration Organizations">
                <Box pb="xs" />
                {organizationItems}
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
