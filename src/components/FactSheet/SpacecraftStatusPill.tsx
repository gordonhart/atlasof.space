import { Group, Pill, Tooltip } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import { Spacecraft, SpacecraftStatus } from '../../lib/spacecraft.ts';
import styles from './SpacecraftStatusPill.module.css';

type Props = {
  status: Spacecraft['status'];
};
export function SpacecraftStatusPill({ status: { status, details } }: Props) {
  const color =
    status === SpacecraftStatus.OPERATIONAL
      ? 'var(--mantine-color-green-7)'
      : status === SpacecraftStatus.CRASHED
        ? 'var(--mantine-color-red-7)'
        : status === SpacecraftStatus.RETURNED
          ? 'var(--mantine-color-cyan-7)'
          : 'var(--mantine-color-gray-7)';
  const PillComponent = (
    <Pill>
      <Group gap={8} wrap="nowrap">
        <IconCircleFilled
          className={status === SpacecraftStatus.OPERATIONAL ? styles.StatusIcon : undefined}
          size={6}
          color={color}
        />
        {status}
      </Group>
    </Pill>
  );
  return details != null ? <Tooltip label={details}>{PillComponent}</Tooltip> : PillComponent;
}
