import { Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { Settings } from '../../lib/state.ts';
import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { celestialBodySlug, celestialBodyTypeName } from '../../lib/utils.ts';
import { BodyCard } from './BodyCard.tsx';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateSettings: (update: Partial<Settings>) => void;
};
export function ParentBody({ body, bodies, updateSettings }: Props) {
  const parentBody = useMemo(
    () =>
      bodies.find(parent => parent.type !== CelestialBodyType.STAR && celestialBodySlug(parent) === body.elements.wrt),
    [JSON.stringify(body), JSON.stringify(bodies)]
  );
  return parentBody != null ? (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Parent {celestialBodyTypeName(parentBody.type)}</Title>
      <BodyCard
        body={parentBody}
        onClick={() => updateSettings({ center: celestialBodySlug(parentBody), hover: null })}
        onHover={hovered => updateSettings({ hover: hovered ? celestialBodySlug(parentBody) : null })}
      />
    </Stack>
  ) : (
    <></>
  );
}
