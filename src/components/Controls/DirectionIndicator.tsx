import { AppState } from '../../lib/state.ts';
import { buttonGap } from './constants.ts';
import { Group, Text, Tooltip } from '@mantine/core';
import { IconZodiacAries } from '@tabler/icons-react';

type Props = Pick<AppState, 'vernalEquinox'>;
export function DirectionIndicator({ vernalEquinox }: Props) {
  const angle = Number(Math.atan2(vernalEquinox[1], vernalEquinox[0]).toFixed(3));
  return (
    <Tooltip
      label={
        <Group gap={4}>
          <Text inherit>Vernal Equinox</Text>
          <IconZodiacAries size={14} />
        </Group>
      }
      position="left"
    >
      <Group
        p={8}
        w={30}
        h={30}
        gap={buttonGap}
        justify="center"
        align="center"
        style={{
          borderRadius: 15,
          backdropFilter: 'blur(4px)',
          transform: `rotate(${angle}rad)`,
          transformOrigin: 'center',
        }}
      >
        <svg style={{ width: 14 }} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 284.14 240.7">
          <g style={{ fill: 'var(--mantine-color-gray-light-color)' }}>
            <polygon points="283.34 120.52 284.14 120.52 283.74 120.35 284.14 120.18 283.34 120.18 0 0 104.18 120.35 0 240.7 283.34 120.52" />
          </g>
        </svg>
      </Group>
    </Tooltip>
  );
}
