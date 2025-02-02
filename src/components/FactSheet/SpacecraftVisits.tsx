import { Stack, Title } from '@mantine/core';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, Spacecraft } from '../../lib/types.ts';
import { SpacecraftCard } from './Spacecraft/SpacecraftCard.tsx';

type Props = {
  spacecraft: Array<Spacecraft>;
  body?: CelestialBody;
  updateSettings: UpdateSettings;
  title?: string;
};
export function SpacecraftVisits({ spacecraft, body, updateSettings, title = 'Spacecraft Visits' }: Props) {
  const padding = useFactSheetPadding();
  return spacecraft.length > 0 ? (
    <Stack gap="xs" {...padding}>
      <Title order={5}>{title}</Title>
      {spacecraft.map((s, i) => (
        <SpacecraftCard
          key={`${s.name}-${i}`}
          spacecraft={s}
          body={body}
          onClick={() => updateSettings({ center: s.id, hover: null })}
        />
      ))}
    </Stack>
  ) : (
    <></>
  );
}
