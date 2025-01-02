import { CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { AppState } from '../../lib/state.ts';
import { Stack, Title } from '@mantine/core';
import { BodyCard } from './BodyCard.tsx';
import { useMemo } from 'react';
import { celestialBodyTypeName } from '../../lib/utils.ts';

type Props = {
  body: CelestialBody;
  bodies: Array<CelestialBody>;
  updateState: (update: Partial<AppState>) => void;
};
export function ParentBody({ body, bodies, updateState }: Props) {
  const parentBody = useMemo(
    () => bodies.find(({ type, name }) => type !== CelestialBodyType.STAR && name === body.elements.wrt),
    [JSON.stringify(body), JSON.stringify(bodies)]
  );
  return parentBody != null ? (
    <Stack gap="xs" p="md" pt="xl">
      <Title order={5}>Parent {celestialBodyTypeName(parentBody.type)}</Title>
      <BodyCard
        body={parentBody}
        onClick={() => updateState({ center: parentBody.name, hover: null })}
        onHover={hovered => updateState({ hover: hovered ? parentBody.name : null })}
      />
    </Stack>
  ) : (
    <></>
  );
}
