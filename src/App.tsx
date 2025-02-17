import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SolarSystem } from './components/SolarSystem';
import { ROUTE_TEMPLATES } from './lib/routes.ts';
import { theme } from './theme.tsx';

const queryClient = new QueryClient();

export function App() {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {ROUTE_TEMPLATES.map(route => (
              <Route key={route} path={route} element={<SolarSystem />} />
            ))}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
