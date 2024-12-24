import { AppState } from '../../lib/state.ts';
import { buttonGap, iconSize } from './constants.ts';
import { Group, Text, Tooltip } from '@mantine/core';
import { IconArrowRightBar, IconZodiacAries } from '@tabler/icons-react';

type Props = Pick<AppState, 'vernalEquinox'>;
export function DirectionIndicator({ vernalEquinox }: Props) {
  const angle = Number(Math.atan2(vernalEquinox[1], vernalEquinox[0]).toFixed(3));
  const pad = 4;
  const width = iconSize + pad * 2;
  return (
    <Tooltip
      label={
        <Group gap={4}>
          <Text inherit>Vernal Equinox</Text>
          <IconZodiacAries size={iconSize} />
        </Group>
      }
      position="left"
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
}