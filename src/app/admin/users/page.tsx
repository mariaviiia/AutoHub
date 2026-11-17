'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Filter, Eye, Edit, Trash2, 
  ArrowLeft, Shield, User, Building, MoreVertical,
  CheckCircle, XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'dealer' | 'admin';
  created_at: string;
}

interface Dealer {
  id: number;
  name: string;
  license_number: string;
  email?: string;
  city: string;
  status: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profiles' | 'dealers'>('profiles');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchProfiles(), fetchDealers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchDealers = async () => {
    try {
      const { data: dealersData, error: dealersError } = await supabase
        .from('dealers')
        .select('*')
        .order('created_at', { ascending: false });

      if (dealersError) throw dealersError;

      setDealers(dealersData || []);
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      fetchProfiles();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };

  const updateDealerStatus = async (dealerId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('dealers')
        .update({ status: newStatus })
        .eq('id', dealerId);

      if (error) throw error;

      fetchDealers();
    } catch (error) {
      console.error('Error updating dealer status:', error);
      alert('Error al actualizar el estado del concesionario');
    }
  };

  const deleteProfile = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      fetchProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const deleteDealer = async (dealerId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este concesionario?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dealers')
        .delete()
        .eq('id', dealerId);

      if (error) throw error;

      fetchDealers();
    } catch (error) {
      console.error('Error deleting dealer:', error);
      alert('Error al eliminar el concesionario');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'dealer': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'dealer': return 'Concesionario';
      case 'buyer': return 'Comprador';
      default: return role;
    }
  };

  const getDealerStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDealerStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || profile.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredDealers = dealers.filter(dealer =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.license_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)] mx-auto mb-4"></div>
          <p className="text-white">Cargando usuarios...</p>
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
            <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'profiles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profiles')}
            className={activeTab === 'profiles' ? 'bg-[var(--color-gold)] text-black' : 'border-gray-700 text-white'}
          >
            <User className="h-4 w-4 mr-2" />
            Perfiles ({profiles.length})
          </Button>
          <Button
            variant={activeTab === 'dealers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dealers')}
            className={activeTab === 'dealers' ? 'bg-[var(--color-gold)] text-black' : 'border-gray-700 text-white'}
          >
            <Building className="h-4 w-4 mr-2" />
            Concesionarios ({dealers.length})
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              {activeTab === 'profiles' && (
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
                >
                  <option value="all">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="dealer">Concesionarios</option>
                  <option value="buyer">Compradores</option>
                </select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profiles Table */}
        {activeTab === 'profiles' && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No hay perfiles para mostrar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Usuario</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Rol</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Teléfono</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Fecha</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((profile) => (
                        <tr key={profile.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{profile.name}</p>
                              <p className="text-gray-500 text-sm">{profile.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                              {getRoleLabel(profile.role)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {profile.phone || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {new Date(profile.created_at).toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={profile.role}
                                onChange={(e) => updateUserRole(profile.id, e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white px-2 py-1 rounded text-sm"
                              >
                                <option value="buyer">Comprador</option>
                                <option value="dealer">Concesionario</option>
                                <option value="admin">Administrador</option>
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-900/20"
                                onClick={() => deleteProfile(profile.id)}
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
        )}

        {/* Dealers Table */}
        {activeTab === 'dealers' && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              {filteredDealers.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No hay concesionarios para mostrar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Concesionario</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Licencia</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Ciudad</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Estado</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Fecha</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDealers.map((dealer) => (
                        <tr key={dealer.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{dealer.name}</p>
                              {dealer.email && (
                                <p className="text-gray-500 text-sm">{dealer.email}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {dealer.license_number}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {dealer.city}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDealerStatusColor(dealer.status)}`}>
                              {getDealerStatusLabel(dealer.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {new Date(dealer.created_at).toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {dealer.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-400 hover:bg-green-900/20"
                                    onClick={() => updateDealerStatus(dealer.id, 'active')}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:bg-red-900/20"
                                    onClick={() => updateDealerStatus(dealer.id, 'suspended')}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-900/20"
                                onClick={() => deleteDealer(dealer.id)}
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
        )}
      </div>
    </div>
  );
}
