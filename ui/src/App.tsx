import { MantineProvider, Box } from '@mantine/core';
import { SolarSystem } from './components/SolarSystem';
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /** Put your mantine theme override here */
});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <SolarSystem />
    </MantineProvider>
  )
}
