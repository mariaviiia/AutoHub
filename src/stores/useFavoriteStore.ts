import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Favorite, Vehicle } from '@/types';

interface FavoriteState {
  favorites: Favorite[];
  isLoading: boolean;
  addFavorite: (vehicle: Vehicle) => void;
  removeFavorite: (vehicleId: number) => void;
  isFavorite: (vehicleId: number) => boolean;
  setFavorites: (favorites: Favorite[]) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      addFavorite: (vehicle) =>
        set((state) => {
          const existingIndex = state.favorites.findIndex(
            (f) => f.vehicle_id === vehicle.id
          );
          if (existingIndex >= 0) return state;
          
          const newFavorite: Favorite = {
            id: Date.now(),
            user_id: 0, // Will be set by API
            vehicle_id: vehicle.id,
            created_at: new Date(),
            vehicle,
          };
          
          return { favorites: [...state.favorites, newFavorite] };
        }),
      removeFavorite: (vehicleId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.vehicle_id !== vehicleId),
        })),
      isFavorite: (vehicleId) => {
        return get().favorites.some((f) => f.vehicle_id === vehicleId);
      },
      setFavorites: (favorites) => set({ favorites }),
    }),
    {
      name: 'favorite-storage',
    }
  )
);
