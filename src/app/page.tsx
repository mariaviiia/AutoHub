import Link from 'next/link';
import { Search, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types';

// Mock data for featured vehicles
const featuredVehicles: Vehicle[] = [
  {
    id: 1,
    dealer_id: 1,
    vin: '1HGCM82633A123456',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 25000,
    mileage_km: 45000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    color: 'Blanco',
    condition: 'used',
    status: 'active',
    published_at: new Date(),
    images: [
      {
        id: 1,
        vehicle_id: 1,
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 2,
    dealer_id: 2,
    vin: '2HGFG1B54KH123456',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 22000,
    mileage_km: 35000,
    fuel_type: 'Gasolina',
    transmission: 'Manual',
    color: 'Negro',
    condition: 'used',
    status: 'active',
    published_at: new Date(),
    images: [
      {
        id: 2,
        vehicle_id: 2,
        url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800',
        order: 0,
        is_primary: true,
      },
    ],
  },
  {
    id: 3,
    dealer_id: 1,
    vin: '3VWD17AJ4KM123456',
    make: 'Volkswagen',
    model: 'Jetta',
    year: 2019,
    price: 18000,
    mileage_km: 60000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    color: 'Gris',
    condition: 'used',
    status: 'active',
    published_at: new Date(),
    images: [
      {
        id: 3,
        vehicle_id: 3,
        url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
        order: 0,
        is_primary: true,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[url(/hero-bg.jpg)] bg-center bg-cover text-white pt-30 min-h-130">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mx-auto text-left gap-8">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white font-mono italic uppercase text-shadow-lg/30">
                Donde tu
              </h1>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 text-[var(--color-gold)] font-mono italic uppercase text-shadow-lg/30">
                Progreso
              </h1>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-mono italic uppercase text-shadow-lg/30">
                Toma el volante.
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-left">
              <Link href="/search">
                <Button size="lg" className="bg-gold text-black hover:bg-gold-dark p-6 font-bold font-mono">
                  <Search className="mr-2 h-4 w-4" />
                  Ver inventario
                </Button>
              </Link>
              <Link href="/dealer/register">
                <Button size="lg" variant="outline" className="text-white p-6 font-bold font-mono bg-black/15">
                  Vender mi vehículo
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-4xl md:text-4xl font-bold mb-8 text-white font-mono italic uppercase text-shadow-lg/30">
            ¿Por qué <span className="text-[var(--color-gold)]">Sr Paisa</span>?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vehículos Verificados</h3>
              <p className="text-gray-600">
                Todos los vehículos pasan por un proceso de verificación riguroso
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Concesionarios de Confianza</h3>
              <p className="text-gray-600">
                Trabajamos solo con concesionarios verificados y certificados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proceso Rápido</h3>
              <p className="text-gray-600">
                Encuentra, contacta y agenda tu prueba de manejo en minutos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Vehículos Destacados</h2>
            <Link href="/search">
              <Button variant="outline">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={vehicle.images[0]?.url || '/placeholder-car.jpg'}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${vehicle.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <span>{vehicle.mileage_km.toLocaleString()} km</span>
                    <span className="mx-2">•</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span>{vehicle.fuel_type}</span>
                    <span className="mx-2">•</span>
                    <span>{vehicle.color}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Eres concesionario?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a nuestra plataforma y llega a miles de compradores potenciales
          </p>
          <Link href="/dealer/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Regístrate ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
