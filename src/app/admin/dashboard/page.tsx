'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Car, Users, MessageSquare, TrendingUp, 
  CheckCircle, XCircle, Clock, Eye, 
  ArrowLeft, BarChart3, Package, DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  pendingVehicles: number;
  totalUsers: number;
  totalDealers: number;
  totalLeads: number;
  newLeads: number;
}

interface PendingVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  created_at: string;
  dealer?: {
    id: number;
    name: string;
  };
  owner_contact?: {
    owner_name: string;
    owner_phone: string;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    pendingVehicles: 0,
    totalUsers: 0,
    totalDealers: 0,
    totalLeads: 0,
    newLeads: 0,
  });
  const [pendingVehicles, setPendingVehicles] = useState<PendingVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const [vehiclesCount, activeCount, pendingCount, usersCount, dealersCount, leadsCount, newLeadsCount] = await Promise.all([
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('dealers').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ]);

      setStats({
        totalVehicles: vehiclesCount.count || 0,
        activeVehicles: activeCount.count || 0,
        pendingVehicles: pendingCount.count || 0,
        totalUsers: usersCount.count || 0,
        totalDealers: dealersCount.count || 0,
        totalLeads: leadsCount.count || 0,
        newLeads: newLeadsCount.count || 0,
      });

      // Fetch pending vehicles
      const { data: pendingData } = await supabase
        .from('vehicles')
        .select(`
          *,
          dealer:dealers(id, name),
          vehicle_owner_contacts(owner_name, owner_phone)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      setPendingVehicles(pendingData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveVehicle = async (vehicleId: number) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: 'active', published_at: new Date().toISOString() })
        .eq('id', vehicleId);

      if (error) throw error;

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving vehicle:', error);
      alert('Error al aprobar el vehículo');
    }
  };

  const rejectVehicle = async (vehicleId: number) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: 'rejected' })
        .eq('id', vehicleId);

      if (error) throw error;

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
      alert('Error al rechazar el vehículo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)] mx-auto mb-4"></div>
          <p className="text-white">Cargando dashboard...</p>
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
            <Link href="/" className="flex items-center text-white hover:text-gray-300">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al inicio
            </Link>
            <h1 className="text-2xl font-bold text-white">Dashboard Administrativo</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Vehículos</p>
                  <p className="text-3xl font-bold text-white">{stats.totalVehicles}</p>
                  <p className="text-green-400 text-xs mt-1">
                    {stats.activeVehicles} activos
                  </p>
                </div>
                <Car className="h-8 w-8 text-[var(--color-gold)]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuarios</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {stats.totalDealers} concesionarios
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Leads</p>
                  <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
                  <p className="text-yellow-400 text-xs mt-1">
                    {stats.newLeads} nuevos
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pendientes</p>
                  <p className="text-3xl font-bold text-white">{stats.pendingVehicles}</p>
                  <p className="text-orange-400 text-xs mt-1">
                    Por aprobar
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/vehicles">
            <Card className="bg-gray-900 border-gray-800 hover:border-[var(--color-gold)] transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Package className="h-8 w-8 text-[var(--color-gold)]" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Gestionar Vehículos</h3>
                    <p className="text-gray-400 text-sm">Ver y editar todos los vehículos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="bg-gray-900 border-gray-800 hover:border-[var(--color-gold)] transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Gestionar Usuarios</h3>
                    <p className="text-gray-400 text-sm">Administrar usuarios y roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="bg-gray-900 border-gray-800 hover:border-[var(--color-gold)] transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-8 w-8 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Analíticas</h3>
                    <p className="text-gray-400 text-sm">Ver reportes y métricas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Pending Approvals */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-400" />
            Vehículos Pendientes de Aprobación
          </h2>

          {pendingVehicles.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No hay vehículos pendientes de aprobación</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-[var(--color-gold)] text-2xl font-bold mb-2">
                          ${vehicle.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-2">
                          {vehicle.dealer && (
                            <span>Concesionario: {vehicle.dealer.name}</span>
                          )}
                          {vehicle.owner_contact && (
                            <span>Dueño: {vehicle.owner_contact.owner_name}</span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Registrado: {new Date(vehicle.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => approveVehicle(vehicle.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => rejectVehicle(vehicle.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
