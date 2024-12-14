import { ActionIcon, Button, createTheme, Tooltip } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'orange',
  components: {
    Button: Button.extend({ defaultProps: { style: { backdropFilter: 'blur(4px)' } } }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
        color: 'gray',
        style: { backdropFilter: 'blur(4px)' },
      },
    }),
    Tooltip: Tooltip.extend({ defaultProps: { hoverOpenDelay: 400 } }),
  },
});
