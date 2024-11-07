import { create } from "zustand";

interface MapLocationState {
  lat: number | null;
  lon: number | null;
  level: number;
  setLocation: (lon: number, lat: number) => void;
  setZoom: (size: number) => void;
}

const useMapLocationStore = create<MapLocationState>((set) => ({
  lon: null,
  lat: null,
  level: 4,
  setLocation: (lon, lat) => set((state) => ({ ...state, lon, lat })),
  setZoom: (level) => set((state) => ({ ...state, level })),
}));

export default useMapLocationStore;

// longitude, latitude
