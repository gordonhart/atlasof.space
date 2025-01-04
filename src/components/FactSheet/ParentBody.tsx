import { Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { Settings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { BodyCard } from './BodyCard.tsx';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: (update: Partial<Settings>) => void;
};
export function ParentBody({ body, bodies, updateSettings }: Props) {
  const parentBody = useMemo(
    () => bodies.find(({ type, name }) => type !== CelestialBodyType.STAR && name === body.elements.wrt),
    [JSON.stringify(body), JSON.stringify(bodies)]
  );
  return parentBody != null ? (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Parent {celestialBodyTypeName(parentBody.type)}</Title>
      <BodyCard
        body={parentBody}
        onClick={() => updateSettings({ center: parentBody.name, hover: null })}
        onHover={hovered => updateSettings({ hover: hovered ? parentBody.name : null })}
      />
    </Stack>
  ) : (
    <></>
  );
}
