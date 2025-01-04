import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SolarSystem } from './components/SolarSystem';
import { theme } from './theme.tsx';

const queryClient = new QueryClient();

export function App() {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SolarSystem />
      </QueryClientProvider>
    </MantineProvider>
  );
}
