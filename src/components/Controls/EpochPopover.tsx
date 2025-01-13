import { Button, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { memo, useRef } from 'react';
import { dateToEpoch, dateToHumanReadable } from '../../lib/epoch.ts';
import { LABEL_FONT_FAMILY } from '../../lib/model/canvas.ts';
import { Epoch } from '../../lib/types.ts';

const JAN_1_1900 = new Date(1900, 0, 1);
const JAN_1_2200 = new Date(2200, 0, 1);

type Props = {
  date: Date;
  setEpoch: (epoch: Epoch) => void;
};
export const EpochPopover = memo(function EpochPopoverComponent({ date, setEpoch }: Props) {
  const hasInteracted = useRef(false);
  return (
    <Popover
      position="bottom"
      onExitTransitionEnd={() => {
        hasInteracted.current = false;
      }}
    >
      <Popover.Target>
        <Button ff={LABEL_FONT_FAMILY} size="compact-xs" color="gray" variant="subtle">
          {dateToHumanReadable(date)}
        </Button>
      </Popover.Target>
      <Popover.Dropdown mih={277} bg="black">
        <DatePicker
          ff={LABEL_FONT_FAMILY}
          size="xs"
          yearLabelFormat="YYYY"
          yearsListFormat="YYYY"
          monthsListFormat="MM (MMM)"
          monthLabelFormat="YYYY-MM"
          minDate={JAN_1_1900}
          maxDate={JAN_1_2200}
          date={hasInteracted.current ? undefined : date}
          value={date}
          defaultDate={date}
          onClick={() => {
            hasInteracted.current = true;
          }}
          onChange={value => {
            if (value != null) setEpoch(dateToEpoch('TODO', value));
          }}
          weekendDays={[]}
        />
      </Popover.Dropdown>
    </Popover>
  );
});
