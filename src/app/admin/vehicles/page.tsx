'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car, Search, Filter, Eye, Edit, Trash2,
  ArrowLeft, CheckCircle, XCircle, Clock,
  Package, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { fetchVehicles } from '@/lib/vehicles';
import { supabase } from '@/lib/supabase';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage_km: number;
  status: string;
  created_at: string;
  dealer?: {
    id: number;
    name: string;
  };
}

export default function AdminVehiclesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadVehicles();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    let filtered = vehicles;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filterStatus]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const vehicles = await fetchVehicles({
        includeImages: false,
        includeDealer: true,
        orderBy: 'created_at',
        ascending: false,
        transform: false,
      });
      setVehicles(vehicles);
      setFilteredVehicles(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVehicleStatus = async (vehicleId: number, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'active') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', vehicleId);

      if (error) throw error;

      // Refresh data
      loadVehicles();
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      alert('Error al actualizar el estado del vehículo');
    }
  };

  const deleteVehicle = async (vehicleId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      // Refresh data
      loadVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error al eliminar el vehículo');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      case 'sold': return 'Vendido';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)] mx-auto mb-4"></div>
          <p className="text-white">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center text-white hover:text-gray-300">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Gestión de Vehículos</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar por marca, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="pending">Pendientes</option>
                <option value="rejected">Rechazados</option>
                <option value="sold">Vendidos</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No hay vehículos para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Vehículo</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Precio</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Kilometraje</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Concesionario</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Estado</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Fecha</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-gray-500 text-sm">ID: {vehicle.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-[var(--color-gold)] font-semibold">
                            ${vehicle.price.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {vehicle.mileage_km.toLocaleString()} km
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {vehicle.dealer?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                            {getStatusLabel(vehicle.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(vehicle.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/vehicles/${vehicle.id}`}>
                              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {vehicle.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-400 hover:bg-green-900/20"
                                  onClick={() => updateVehicleStatus(vehicle.id, 'active')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-900/20"
                                  onClick={() => updateVehicleStatus(vehicle.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-900/20"
                              onClick={() => deleteVehicle(vehicle.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{vehicles.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">Activos</p>
              <p className="text-2xl font-bold text-green-400">{vehicles.filter(v => v.status === 'active').length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-400">{vehicles.filter(v => v.status === 'pending').length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">Vendidos</p>
              <p className="text-2xl font-bold text-blue-400">{vehicles.filter(v => v.status === 'sold').length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
