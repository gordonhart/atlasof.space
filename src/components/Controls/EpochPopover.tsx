import { Button, Popover } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { memo, useRef } from 'react';
import { LABEL_FONT_FAMILY } from '../../lib/canvas.ts';
import { dateToEpoch, dateToISO, dateToJulianDay } from '../../lib/epoch.ts';
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
          {dateToISO(date)}
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
            if (value != null) setEpoch(dateToEpoch(dateToJulianDay(value), value));
          }}
          weekendDays={[]}
        />
      </Popover.Dropdown>
    </Popover>
  );
});
