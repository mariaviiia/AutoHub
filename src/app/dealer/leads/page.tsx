'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, Phone, Mail, Calendar, Clock, ArrowLeft, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  vehicle_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  created_at: string;
  vehicle?: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

export default function DealerLeadsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'dealer') {
      router.push('/login');
      return;
    }
    fetchLeads();
  }, [isAuthenticated, user, router]);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          vehicle:vehicles(id, make, model, year, price)
        `)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      setLeads(leadsData || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      // Update local state
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus as any } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Error al actualizar el estado del lead');
    }
  };

  const filteredLeads = filterStatus === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <p className="text-white">Cargando leads...</p>
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
            <Link href="/dealer/dashboard" className="flex items-center text-white hover:text-gray-300">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Gestión de Leads</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Leads</p>
                  <p className="text-3xl font-bold text-white">{leads.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-[var(--color-gold)]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Nuevos</p>
                  <p className="text-3xl font-bold text-blue-400">{leads.filter(l => l.status === 'new').length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Contactados</p>
                  <p className="text-3xl font-bold text-yellow-400">{leads.filter(l => l.status === 'contacted').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Cerrados</p>
                  <p className="text-3xl font-bold text-green-400">{leads.filter(l => l.status === 'closed').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white px-4 py-2 rounded-md"
          >
            <option value="all">Todos los estados</option>
            <option value="new">Nuevos</option>
            <option value="contacted">Contactados</option>
            <option value="qualified">Calificados</option>
            <option value="closed">Cerrados</option>
            <option value="lost">Perdidos</option>
          </select>
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No hay leads para mostrar</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Lead Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{lead.buyer_name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                              {getStatusLabel(lead.status)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${lead.buyer_email}`} className="hover:text-white">
                                {lead.buyer_email}
                              </a>
                            </div>
                            {lead.buyer_phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${lead.buyer_phone}`} className="hover:text-white">
                                  {lead.buyer_phone}
                                </a>
                              </div>
                            )}
                          </div>

                          {lead.message && (
                            <p className="text-gray-300 text-sm mb-3 bg-gray-800 p-3 rounded-md">
                              "{lead.message}"
                            </p>
                          )}

                          {lead.vehicle && (
                            <Link 
                              href={`/vehicles/${lead.vehicle.id}`}
                              className="inline-flex items-center text-[var(--color-gold)] hover:underline text-sm"
                            >
                              {lead.vehicle.year} {lead.vehicle.make} {lead.vehicle.model} - ${lead.vehicle.price.toLocaleString()}
                            </Link>
                          )}

                          <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(lead.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-md text-sm"
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="qualified">Calificado</option>
                        <option value="closed">Cerrado</option>
                        <option value="lost">Perdido</option>
                      </select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-white hover:bg-gray-800"
                        onClick={() => window.open(`mailto:${lead.buyer_email}`)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Enviar Email
                      </Button>
                      
                      {lead.buyer_phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-white hover:bg-gray-800"
                          onClick={() => window.open(`tel:${lead.buyer_phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Llamar
                        </Button>
                      )}
                    </div>
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
