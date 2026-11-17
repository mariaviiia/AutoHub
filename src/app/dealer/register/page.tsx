'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Mail, Lock, Building, Phone, MapPin, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';

export default function DealerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    licenseNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const result = await register(
      formData.email,
      formData.password,
      formData.businessName,
      formData.phone,
      'dealer'
    );

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Error al registrar concesionario');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Car className="h-12 w-12 text-[var(--color-gold)]" />
            <span className="text-3xl font-bold text-white">Sr Paisa</span>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Registro de Concesionario</h1>
              <p className="text-gray-400">
                Únete a Sr Paisa y comienza a vender tus vehículos
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center text-red-200">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Negocio
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      name="businessName"
                      placeholder="Auto Premium S.A."
                      value={formData.businessName}
                      onChange={handleChange}
                      className="pl-10 bg-black border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de Licencia
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      name="licenseNumber"
                      placeholder="AUT-001234"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="pl-10 bg-black border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="contacto@autopremium.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-black border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="+52 555 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 bg-black border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    name="address"
                    placeholder="Av. Reforma 123, Col. Centro"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 bg-black border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ciudad
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    name="city"
                    placeholder="Ciudad de México"
                    value={formData.city}
                    onChange={handleChange}
                    className="pl-10 bg-black border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-black border-gray-700 text-white"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 bg-black border-gray-700 text-white"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2 rounded" required />
                <label className="text-sm text-gray-400">
                  Acepto los{' '}
                  <Link href="/terms" className="text-[var(--color-gold)] hover:underline">
                    términos y condiciones
                  </Link>{' '}
                  para concesionarios y la{' '}
                  <Link href="/privacy" className="text-[var(--color-gold)] hover:underline">
                    política de privacidad
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--color-gold)] text-black hover:bg-yellow-600"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrar Concesionario'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-white mb-2">Beneficios de registrarte:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Publica vehículos ilimitados</li>
                <li>• Acceso a dashboard de gestión</li>
                <li>• Recibe leads de compradores interesados</li>
                <li>• Reportes de desempeño y analíticas</li>
                <li>• Soporte dedicado</li>
              </ul>
            </div>

            <p className="mt-8 text-center text-sm text-gray-400">
              ¿Eres comprador?{' '}
              <Link href="/register" className="text-[var(--color-gold)] hover:underline font-medium">
                Regístrate como comprador
              </Link>
            </p>

            <p className="mt-4 text-center text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-[var(--color-gold)] hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
