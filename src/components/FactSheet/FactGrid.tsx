import { Table, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { LoadingCursor } from './LoadingCursor.tsx';

type Props = {
  facts: Array<{ label: string; value: ReactNode }>;
  isLoading?: boolean;
  keysWidth?: number;
};
export function FactGrid({ facts, isLoading = false, keysWidth = 190 }: Props) {
  return (
    <Table fz="xs" horizontalSpacing={0} verticalSpacing={2} withRowBorders={false}>
      <Table.Tbody>
        {facts.map(({ label, value }, i) => (
          <Table.Tr key={i} style={{ verticalAlign: 'top' }}>
            <Table.Td style={{ width: keysWidth }}>
              <Text inherit c="dimmed">
                {label}
              </Text>
            </Table.Td>
            <Table.Td pl="xs">
              <Text span inherit>
                {value}
                {isLoading && i + 1 === facts.length && value !== '' && <LoadingCursor />}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
