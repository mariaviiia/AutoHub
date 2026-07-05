'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const { favorites, removeFavorite, isFavorite } = useFavoriteStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleRemoveFavorite = (vehicleId: number) => {
    removeFavorite(vehicleId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/search" className="text-gray-400 hover:text-white flex items-center mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la búsqueda
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mis Favoritos</h1>
              <p className="text-gray-400">
                {favorites.length} {favorites.length === 1 ? 'vehículo' : 'vehículos'} guardados
              </p>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No tienes vehículos favoritos
              </h2>
              <p className="text-gray-400 mb-6">
                Comienza a guardar vehículos que te interesen
              </p>
              <Link href="/search">
                <Button className="bg-[var(--color-gold)] text-black hover:bg-yellow-600">
                  Buscar Vehículos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden">
                <div className="relative">
                  <Link href={`/vehicles/${favorite.vehicle_id}`}>
                    <img
                      src={favorite.vehicle?.images[0]?.url || '/placeholder-car.jpg'}
                      alt={`${favorite.vehicle?.make} ${favorite.vehicle?.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.vehicle_id)}
                    className="absolute top-2 right-2 bg-black/70 p-2 rounded-full hover:bg-black/90"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-[var(--color-gold)] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    ${favorite.vehicle?.price?.toLocaleString()}
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link href={`/vehicles/${favorite.vehicle_id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-white hover:text-[var(--color-gold)]">
                      {favorite.vehicle?.year} {favorite.vehicle?.make} {favorite.vehicle?.model}
                    </h3>
                  </Link>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <span>{favorite.vehicle?.mileage_km?.toLocaleString()} km</span>
                    <span className="mx-2">•</span>
                    <span>{favorite.vehicle?.transmission}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <span>{favorite.vehicle?.fuel_type}</span>
                    <span className="mx-2">•</span>
                    <span>{favorite.vehicle?.color}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 border-t border-gray-700 pt-3">
                    <span className="text-xs">
                      Guardado el {new Date(favorite.created_at).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
