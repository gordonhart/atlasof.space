import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconCircle, IconCircleDot, IconRestore, IconTagMinus, IconTagPlus } from '@tabler/icons-react';
import { AppStateControlProps, buttonGap, iconSize } from './constants.ts';
import { memo } from 'react';
import { SelectOmnibox } from './SelectOmnibox.tsx';
import { HelpModalButton } from './HelpModalButton.tsx';
import { VisibilityControls } from './VisibilityControls.tsx';

type Props = AppStateControlProps & {
  reset: () => void;
};
export const GeneralControls = memo(function GeneralControlsComponent({ state, updateState, reset }: Props) {
  return (
    <Group gap={buttonGap}>
      <SelectOmnibox state={state} updateState={updateState} />

      <Tooltip position="top" label={`${state.drawOrbit ? 'Hide' : 'Show'} Orbits`}>
        <ActionIcon onClick={() => updateState({ drawOrbit: !state.drawOrbit })}>
          {state.drawOrbit ? <IconCircleDot size={iconSize} /> : <IconCircle size={iconSize} />}
        </ActionIcon>
      </Tooltip>

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

      <VisibilityControls state={state} updateState={updateState} />

      <Tooltip position="top" label="Reset">
        <ActionIcon onClick={reset}>
          <IconRestore size={iconSize} />
        </ActionIcon>
      </Tooltip>

      <HelpModalButton state={state} updateState={updateState} />
    </Group>
  );
});
