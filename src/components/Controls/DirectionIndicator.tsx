import { Group, Text, Tooltip } from '@mantine/core';
import { IconArrowRightBar, IconZodiacAries } from '@tabler/icons-react';
import { memo } from 'react';
import { useAppState } from '../../lib/state.ts';
import { buttonGap } from './constants.ts';

export const DirectionIndicator = memo(function DirectionIndicatorComponent() {
  const vernalEquinox = useAppState(state => state.model.vernalEquinox);
  const iconSize = 20;
  const angle = Number(Math.atan2(vernalEquinox[1], vernalEquinox[0]).toFixed(3));
  const pad = 6;
  const width = iconSize + pad * 2;
  return (
    <Tooltip
      offset={0}
      position="bottom-end"
      label={
        <Group gap={4}>
          <Text inherit>Vernal Equinox</Text>
          <IconZodiacAries size={iconSize} />
        </Group>
      }
    >
      <Group
        p={pad}
        w={width}
        h={width}
        gap={buttonGap}
        justify="center"
        align="center"
        style={{
          borderRadius: width / 2,
          backdropFilter: 'blur(4px)',
          transform: `rotate(${angle}rad)`,
          transformOrigin: 'center',
        }}
      >
        <IconArrowRightBar size={iconSize} />
      </Group>
    </Tooltip>
  );
});
