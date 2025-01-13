import { Button, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { memo } from 'react';
import { dateToEpoch, dateToHumanReadable } from '../../lib/epoch.ts';
import { Epoch } from '../../lib/types.ts';

type Props = {
  date: Date;
  setEpoch: (epoch: Epoch) => void;
};
export const EpochPopover = memo(function EpochPopoverComponent({ date, setEpoch }: Props) {
  return (
    <Popover position="bottom">
      <Popover.Target>
        <Button size="compact-xs" fw="normal" color="gray" variant="subtle">
          {dateToHumanReadable(date)}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <DatePicker
          size="xs"
          yearLabelFormat="YYYY"
          yearsListFormat="YYYY"
          monthsListFormat="MM (MMM)"
          monthLabelFormat="YYYY-MM"
          value={date}
          defaultDate={date}
          onChange={value => {
            if (value != null) setEpoch(dateToEpoch('TODO', value));
          }}
          getDayProps={() => ({
            weekend: false,
          })}
        />
      </Popover.Dropdown>
    </Popover>
  );
});
