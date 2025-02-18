import { useEffect } from 'react';
import { FocusItem, FocusItemType } from '../../hooks/useFocusItem.ts';
import { CelestialBody, CelestialBodyId } from '../../lib/types.ts';
import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';
import { SpacecraftOrganizationFactSheet } from './Organization/SpacecraftOrganizationFactSheet.tsx';
import { SpacecraftFactSheet } from './Spacecraft/SpacecraftFactSheet.tsx';

type Props = {
  item: FocusItem;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: CelestialBodyId) => void;
  resize: () => void;
};
export function FactSheet({ item, addBody, removeBody, resize }: Props) {
  // ensure that main canvas is properly sized when this pane mounts and unmounts
  useEffect(() => {
    resize();
    return resize;
  });

  return item.type === FocusItemType.CELESTIAL_BODY ? (
    <CelestialBodyFactSheet body={item.item} />
  ) : item.type === FocusItemType.ORBITAL_REGIME ? (
    <OrbitalRegimeFactSheet regime={item.item} addBody={addBody} removeBody={removeBody} />
  ) : item.type === FocusItemType.SPACECRAFT ? (
    <SpacecraftFactSheet spacecraft={item.item} />
  ) : item.type === FocusItemType.ORGANIZATION ? (
    <SpacecraftOrganizationFactSheet organization={item.item} />
  ) : (
    <></>
  );
}
