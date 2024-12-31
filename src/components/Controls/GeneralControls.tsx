import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import {
  IconCircle,
  IconCircleDot,
  IconCircleFilled,
  IconEyeCog,
  IconHelp,
  IconRestore,
  IconTagMinus,
  IconTagPlus,
} from '@tabler/icons-react';
import { CelestialBody, CelestialBodyType, CelestialBodyTypes } from '../../lib/types.ts';
import { celestialBodyTypeName } from '../../lib/utils.ts';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import { memo, useEffect } from 'react';
import { AddSmallBodyMenu } from './AddSmallBodyMenu.tsx';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { HelpModal } from './HelpModal.tsx';

type Props = AppStateControlProps & {
  addBody: (body: CelestialBody) => void;
  removeBody: (name: string) => void;
  reset: () => void;
};
export const GeneralControls = memo(function GeneralControlsComponent({
  state,
  updateState,
  addBody,
  removeBody,
  reset,
}: Props) {
  const [hasSeenHelpModal, setHasSeenHelpModal] = useLocalStorage({
    key: 'has-seen-help-modal',
    getInitialValueInEffect: false,
  });
  const [helpOpen, helpControls] = useDisclosure(false);

  function openHelp() {
    updateState({ play: false });
    helpControls.open();
    setHasSeenHelpModal('true');
  }

  function closeHelp() {
    updateState({ play: true });
    helpControls.close();
  }

  useEffect(() => {
    console.log(hasSeenHelpModal);
    if (hasSeenHelpModal !== 'true') openHelp();
  }, [hasSeenHelpModal]);

  function toggleVisibleType(type: CelestialBodyType) {
    const newVisibleTypes = state.visibleTypes.has(type)
      ? new Set([...state.visibleTypes].filter(t => t !== type))
      : new Set([...state.visibleTypes, type]);
    updateState({ visibleTypes: newVisibleTypes });
  }

  return (
    <Group gap={buttonGap}>
      {/* TODO: these two controls should be merged, ideally */}
      <SelectOmnibox state={state} updateState={updateState} />
      <AddSmallBodyMenu state={state} addBody={addBody} removeBody={removeBody} />

      <Tooltip position="top" label={`${state.drawOrbit ? 'Hide' : 'Show'} Orbits`}>
        <ActionIcon onClick={() => updateState({ drawOrbit: !state.drawOrbit })}>
          {state.drawOrbit ? <IconCircleDot size={iconSize} /> : <IconCircle size={iconSize} />}
        </ActionIcon>
      </Tooltip>

      <Menu position="top" offset={0} closeOnItemClick={false}>
        <Menu.Target>
          <Tooltip position="top" label="Toggle Visibility">
            <ActionIcon>
              <IconEyeCog size={iconSize} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          {CelestialBodyTypes.map(type => (
            <Menu.Item key={type} onClick={() => toggleVisibleType(type)}>
              <Group gap="xs" align="center">
                {state.visibleTypes.has(type) ? <IconCircleFilled size={14} /> : <IconCircle size={14} />}
                {celestialBodyTypeName(type)}
              </Group>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Tooltip position="top" label={`${state.drawLabel ? 'Hide' : 'Show'} Labels`}>
        <ActionIcon onClick={() => updateState({ drawLabel: !state.drawLabel })}>
          {state.drawLabel ? <IconTagMinus size={iconSize} /> : <IconTagPlus size={iconSize} />}
        </ActionIcon>
      </Tooltip>

      {/* TODO: implement for 3D
      <Tooltip position="left" label={`${state.drawTail ? 'Hide' : 'Show'} Tails`}>
        <ActionIcon onClick={() => updateState({ drawTail: !state.drawTail })}>
          <IconMeteorFilled size={iconSize} />
        </ActionIcon>
      </Tooltip>
      */}

      <Tooltip position="top" label="Reset">
        <ActionIcon onClick={reset}>
          <IconRestore size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <Tooltip position="top" label="Help">
        <ActionIcon onClick={openHelp}>
          <IconHelp size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <HelpModal isOpen={helpOpen} onClose={closeHelp} />
    </Group>
  );
});
