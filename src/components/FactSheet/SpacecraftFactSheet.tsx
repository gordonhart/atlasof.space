import { Stack } from '@mantine/core';
import { Spacecraft } from '../../lib/spacecraft.ts';
import { UpdateSettings } from '../../lib/state.ts';
import { CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName, DEFAULT_SPACECRAFT_COLOR } from '../../lib/utils.ts';
import { FactSheetTitle } from './FactSheetTitle.tsx';

type Props = {
  spacecraft: Spacecraft;
  updateSettings: UpdateSettings;
};
export function SpacecraftFactSheet({ spacecraft, updateSettings }: Props) {
  return (
    <Stack fz="xs" gap={2} h="100%" style={{ overflow: 'auto' }} flex={1}>
      <FactSheetTitle
        title={spacecraft.name}
        subTitle={celestialBodyTypeName(CelestialBodyType.SPACECRAFT)}
        color={DEFAULT_SPACECRAFT_COLOR}
        onClose={() => updateSettings({ center: null })}
        onHover={hovered => updateSettings({ hover: hovered ? spacecraft.id : null })}
      />
      {JSON.stringify(spacecraft)}
    </Stack>
  );
}
