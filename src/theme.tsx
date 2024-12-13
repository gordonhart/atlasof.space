import { ActionIcon, Button, createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'orange',
  components: {
    Button: Button.extend({ defaultProps: { style: { backdropFilter: 'blur(4px)' } } }),
    ActionIcon: ActionIcon.extend({ defaultProps: { style: { backdropFilter: 'blur(4px)' } } }),
  },
});
