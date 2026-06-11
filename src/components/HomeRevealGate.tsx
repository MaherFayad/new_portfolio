"use client";

import { createContext, useContext, ReactNode } from "react";

const HomeRevealGateContext = createContext<boolean>(true);

interface HomeRevealGateProviderProps {
  value: boolean;
  children: ReactNode;
}

export function HomeRevealGateProvider({ value, children }: HomeRevealGateProviderProps) {
  return (
    <HomeRevealGateContext.Provider value={value}>
      {children}
    </HomeRevealGateContext.Provider>
  );
}

export function useHomeRevealGate() {
  return useContext(HomeRevealGateContext);
}
