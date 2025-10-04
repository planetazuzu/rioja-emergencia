
import React, { createContext, useContext, useState } from "react";

type LandingPointLocationContextType = {
  lat: string | null;
  lng: string | null;
  setLatLng: (lat: number, lng: number) => void;
};

const LandingPointLocationContext = createContext<LandingPointLocationContextType | undefined>(undefined);

export const useLandingPointLocation = () => {
  const ctx = useContext(LandingPointLocationContext);
  if (!ctx) throw new Error("useLandingPointLocation must be used within LandingPointLocationProvider");
  return ctx;
};

export const LandingPointLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lat, setLat] = useState<string | null>(null);
  const [lng, setLng] = useState<string | null>(null);

  const setLatLng = (newLat: number, newLng: number) => {
    setLat(newLat.toString());
    setLng(newLng.toString());
  };

  return (
    <LandingPointLocationContext.Provider value={{ lat, lng, setLatLng }}>
      {children}
    </LandingPointLocationContext.Provider>
  );
};
