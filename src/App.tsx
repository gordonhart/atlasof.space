import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SolarSystem } from './components/SolarSystem';
import { theme } from './theme.tsx';

const queryClient = new QueryClient();

export function App() {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/:bodyId?" element={<SolarSystem />} />
            <Route path="/regime/:regimeId?" element={<SolarSystem />} />
            <Route path="/spacecraft/:spacecraftId?" element={<SolarSystem />} />
            <Route path="/organization/:organizationId?" element={<SolarSystem />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
