import { ActionIcon, Button, createTheme, Modal, Paper, Popover, Tooltip } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  headings: { fontFamily: 'Electrolize, sans-serif' },
  components: {
    Button: Button.extend({ defaultProps: { style: { backdropFilter: 'blur(4px)' } } }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
        color: 'gray',
        style: { backdropFilter: 'blur(4px)' },
      },
    }),
    Tooltip: Tooltip.extend({ defaultProps: { fz: 'xs', px: 6, py: 2, openDelay: 400 } }),
    Popover: Popover.extend({ defaultProps: { transitionProps: { transition: 'fade', duration: 200 } } }),
    Paper: Paper.extend({ defaultProps: { bg: 'transparent', style: { backdropFilter: 'blur(4px)' } } }),
    Modal: Modal.extend({
      defaultProps: {
        overlayProps: { blur: 4, backgroundOpacity: 0 },
        transitionProps: { transition: 'fade' },
      },
    }),
  },
});
