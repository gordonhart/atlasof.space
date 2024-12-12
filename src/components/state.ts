import {Point} from "./constants.ts";
import {createContext, useContext} from "react";

export type AppStateT = {
  zoom: number;
  center: Point;
  play: boolean;
}

export const initialState: AppStateT = {
  zoom: 1,
  center: { x: 0, y: 0 },
  play: true,
}

export const AppState = createContext<{
  appState: AppStateT;
  setAppState: (state: AppStateT | ((s: AppStateT) => AppStateT)) => void;
}>({
  appState: initialState,
  setAppState: () => {},
});

export function useAppState() {
  return useContext(AppState);
}
