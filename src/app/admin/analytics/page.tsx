'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, TrendingUp, Users, Car, MessageSquare, 
  DollarSign, ArrowLeft, Calendar, Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/lib/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

interface AnalyticsData {
  vehiclesByMonth: { month: string; count: number }[];
  leadsByMonth: { month: string; count: number }[];
  vehiclesByMake: { make: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  totalRevenue: number;
  avgVehiclePrice: number;
}

const COLORS = ['#FFD700', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    vehiclesByMonth: [],
    leadsByMonth: [],
    vehiclesByMake: [],
    leadsByStatus: [],
    totalRevenue: 0,
    avgVehiclePrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchAnalytics();
  }, [isAuthenticated, user, router, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      if (timeRange === '30d') startDate.setDate(now.getDate() - 30);
      else if (timeRange === '90d') startDate.setDate(now.getDate() - 90);
      else startDate.setFullYear(now.getFullYear() - 1);

      // Fetch vehicles by month
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('created_at, make, price')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      // Fetch leads by status
      const { data: leadsData } = await supabase
        .from('leads')
        .select('status, created_at')
        .gte('created_at', startDate.toISOString());

      // Process vehicles by month
      const vehiclesByMonthMap = new Map<string, number>();
      const vehiclesByMakeMap = new Map<string, number>();
      let totalRevenue = 0;
      let totalPriceSum = 0;

      vehiclesData?.forEach((v: any) => {
        const month = new Date(v.created_at).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
        vehiclesByMonthMap.set(month, (vehiclesByMonthMap.get(month) || 0) + 1);
        vehiclesByMakeMap.set(v.make, (vehiclesByMakeMap.get(v.make) || 0) + 1);
        totalRevenue += v.price || 0;
        totalPriceSum += v.price || 0;
      });

      const vehiclesByMonth = Array.from(vehiclesByMonthMap.entries()).map(([month, count]) => ({
        month,
        count,
      }));

      const vehiclesByMake = Array.from(vehiclesByMakeMap.entries())
        .map(([make, count]) => ({ make, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process leads by month
      const leadsByMonthMap = new Map<string, number>();
      leadsData?.forEach((l: any) => {
        const month = new Date(l.created_at).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
        leadsByMonthMap.set(month, (leadsByMonthMap.get(month) || 0) + 1);
      });

      const leadsByMonth = Array.from(leadsByMonthMap.entries()).map(([month, count]) => ({
        month,
        count,
      }));

      // Process leads by status
      const leadsByStatusMap = new Map<string, number>();
      leadsData?.forEach((l: any) => {
        leadsByStatusMap.set(l.status, (leadsByStatusMap.get(l.status) || 0) + 1);
      });

      const leadsByStatus = Array.from(leadsByStatusMap.entries()).map(([status, count]) => ({
        status,
        count,
      }));

      const avgVehiclePrice = vehiclesData?.length ? totalPriceSum / vehiclesData.length : 0;

      setAnalytics({
        vehiclesByMonth,
        leadsByMonth,
        vehiclesByMake,
        leadsByStatus,
        totalRevenue,
        avgVehiclePrice,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo';
      case 'contacted': return 'Contactado';
      case 'qualified': return 'Calificado';
      case 'closed': return 'Cerrado';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)] mx-auto mb-4"></div>
          <p className="text-white">Cargando analíticas...</p>
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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Analíticas</h1>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
              >
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Valor Total</p>
                  <p className="text-3xl font-bold text-[var(--color-gold)]">
                    ${analytics.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-[var(--color-gold)]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Precio Promedio</p>
                  <p className="text-3xl font-bold text-white">
                    ${Math.round(analytics.avgVehiclePrice).toLocaleString()}
                  </p>
                </div>
                <Car className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Vehículos</p>
                  <p className="text-3xl font-bold text-white">
                    {analytics.vehiclesByMonth.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Leads</p>
                  <p className="text-3xl font-bold text-white">
                    {analytics.leadsByMonth.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vehicles Over Time */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vehículos Registrados</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.vehiclesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#FFD700" name="Vehículos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leads Over Time */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Leads Generados</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.leadsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" name="Leads" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vehicles by Make */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vehículos por Marca</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.vehiclesByMake} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="make" type="category" stroke="#9CA3AF" width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="count" fill="#10B981" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leads by Status */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Leads por Estado</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.leadsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${getStatusLabel(entry.name || '')}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    name="status"
                  >
                    {analytics.leadsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => {
              const data = JSON.stringify(analytics, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
        </div>
      </div>
    </div>
  );
}
