'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Phone, Mail, Calendar, MapPin, Fuel, Gauge, Settings, Shield, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/types';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { fetchVehicleById } from '@/lib/vehicles';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  const { id } = use(params);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setLoading(true);
        const vehicleData = await fetchVehicleById(id);
        setVehicle(vehicleData);
      } catch (error) {
        console.error('Error loading vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!vehicle) return;
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite(vehicle);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-[var(--color-gold)] animate-spin mx-auto mb-4" />
          <p className="text-white">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Vehículo no encontrado</p>
          <Link href="/search" className="text-[var(--color-gold)] hover:underline mt-4 inline-block">
            Volver a la búsqueda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-black border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/search" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la búsqueda
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <img
                    src={vehicle.images[selectedImage]?.url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleFavoriteToggle}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isFavorite(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h1>
                    <p className="text-gray-600">{vehicle.condition === 'used' ? 'Usado' : 'Certificado'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      ${vehicle.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">+ impuestos</p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Gauge className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Kilometraje</p>
                    <p className="font-semibold">{vehicle.mileage_km.toLocaleString()} km</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Fuel className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Combustible</p>
                    <p className="font-semibold">{vehicle.fuel_type}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Settings className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Transmisión</p>
                    <p className="font-semibold">{vehicle.transmission}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold">{vehicle.color}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Detalles Adicionales</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">VIN:</span>
                      <span className="ml-2 font-medium">{vehicle.vin}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Año:</span>
                      <span className="ml-2 font-medium">{vehicle.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Condición:</span>
                      <span className="ml-2 font-medium">
                        {vehicle.condition === 'used' ? 'Usado' : 'Certificado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Publicado:</span>
                      <span className="ml-2 font-medium">
                        {new Date(vehicle.published_at).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Solicitar Información</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded-md"
                        placeholder="Tu teléfono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-md"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mensaje</label>
                    <textarea
                      className="w-full p-2 border rounded-md h-32"
                      placeholder="Estoy interesado en este vehículo..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Solicitud
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dealer Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Concesionario</h3>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">{vehicle.dealer?.name}</h4>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{vehicle.dealer?.address}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{vehicle.dealer?.city}, {vehicle.dealer?.country}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Test Drive */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Agendar Prueba de Manejo</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha</label>
                    <input type="date" className="w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora</label>
                    <input type="time" className="w-full p-2 border rounded-md" />
                  </div>
                  <Button type="submit" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Financing Calculator */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Calculadora de Financiación</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monto del Préstamo</label>
                    <p className="text-2xl font-bold text-blue-600">
                      ${vehicle.price?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Plazo (meses)</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="12">12 meses</option>
                      <option value="24">24 meses</option>
                      <option value="36">36 meses</option>
                      <option value="48">48 meses</option>
                      <option value="60">60 meses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Enganche</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      placeholder="5000"
                      defaultValue="5000"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pago Mensual Estimado</p>
                    <p className="text-2xl font-bold text-blue-600">$450</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    Solicitar Financiación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
