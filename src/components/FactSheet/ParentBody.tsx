import { Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useFactSheetPadding } from '../../hooks/useFactSheetPadding.ts';
import { Settings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { CelestialBodyCard } from './CelestialBodyCard.tsx';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: (update: Partial<Settings>) => void;
};
export function ParentBody({ body, bodies, updateSettings }: Props) {
  const padding = useFactSheetPadding();
  const parentBody = useMemo(
    () => bodies.find(({ type, id }) => type !== CelestialBodyType.STAR && id === body.elements.wrt),
    [JSON.stringify(body), JSON.stringify(bodies)]
  );
  return parentBody != null ? (
    <Stack gap="xs" {...padding}>
      <Title order={5}>Parent {celestialBodyTypeName(parentBody.type)}</Title>
      <CelestialBodyCard
        body={parentBody}
        onClick={() => updateSettings({ center: parentBody.id, hover: null })}
        onHover={hovered => updateSettings({ hover: hovered ? parentBody.id : null })}
      />
    </Stack>
  ) : (
    <></>
  );
}
