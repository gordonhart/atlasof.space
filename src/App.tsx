import {MantineProvider} from '@mantine/core';
import {SolarSystem} from './components/SolarSystem';
import {theme} from "./theme.tsx";
import {AppState, initialState} from "./components/state.ts";
import {useState} from "react";

export function App() {
  return (
    <MantineProvider theme={theme}>
      <SolarSystem />
    </MantineProvider>
  )
}
