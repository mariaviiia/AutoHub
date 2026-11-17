'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Heart, MapPin, Loader, LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/types';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { fetchVehicles } from '@/lib/vehicles';

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const vehicles = await fetchVehicles({ status: 'active' });
      setVehicles(vehicles);
      setFilteredVehicles(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (vehicle: Vehicle) => {
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite(vehicle);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter logic would go here
    const filtered = vehicles.filter(
      (v: Vehicle) =>
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  return (
    <div className="h-full bg-black">
      {/* Search Header */}
      <div className="sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar por marca, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
            <Button type="submit">Buscar</Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Marca</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Todas</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Ford">Ford</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Año Mínimo</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Cualquiera</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Precio Máximo</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Cualquiera</option>
                    <option value="10000">$10,000</option>
                    <option value="20000">$20,000</option>
                    <option value="30000">$30,000</option>
                    <option value="40000">$40,000</option>
                    <option value="50000">$50,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kilometraje Máximo</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Cualquiera</option>
                    <option value="20000">20,000 km</option>
                    <option value="40000">40,000 km</option>
                    <option value="60000">60,000 km</option>
                    <option value="80000">80,000 km</option>
                    <option value="100000">100,000 km</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container h-full mx-auto px-4 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Resultados de Búsqueda</h1>
          <p className="text-gray-600">{filteredVehicles.length} vehículos encontrados</p>
        </div>
        {loading ? (
          <div className="text-center py-[5rem]">
            <div className="inline-block w-[50px] h-[50px] border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[var(--color-gold)] text-lg mt-4">Cargando vehículos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link href={`/vehicles/${vehicle.id}`}>
                    <img
                      src={vehicle.images[0]?.url || '/placeholder-car.jpg'}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  {/* <button
                  onClick={() => handleFavoriteToggle(vehicle)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button> */}
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${vehicle.price.toLocaleString()}
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link href={`/vehicles/${vehicle.id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                  </Link>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <span>{vehicle.mileage_km.toLocaleString()} km</span>
                    <span className="mx-2">•</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <span>{vehicle.fuel_type}</span>
                    <span className="mx-2">•</span>
                    <span>{vehicle.color}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 border-t pt-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{vehicle.dealer?.city}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredVehicles.length === 0 && (
          <div className="text-center py-[5rem]">
            <p className="text-gray-600 text-lg">No se encontraron vehículos con los filtros seleccionados.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilteredVehicles(vehicles);
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
