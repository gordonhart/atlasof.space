import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconCircle, IconCircleDot, IconRestore, IconTagMinus, IconTagPlus } from '@tabler/icons-react';
import { CelestialBody } from '../../lib/types.ts';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import { memo } from 'react';
import { AddSmallBodyMenu } from './AddSmallBodyMenu.tsx';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { HelpModalButton } from './HelpModalButton.tsx';
import { VisibilityControls } from './VisibilityControls.tsx';

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

      <VisibilityControls state={state} updateState={updateState} />

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

      <HelpModalButton state={state} updateState={updateState} />
    </Group>
  );
});
