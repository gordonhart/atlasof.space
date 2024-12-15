import { ActionIcon, Button, createTheme, Paper, Tooltip } from '@mantine/core';

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
    Paper: Paper.extend({ defaultProps: { bg: 'transparent', style: { backdropFilter: 'blur(4px)' } } }),
  },
});
