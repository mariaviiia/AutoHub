'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, Menu, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import Image from 'next/image';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favorites } = useFavoriteStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b bg-[#00000054] top-0 z-50 w-full h-20">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between h-">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/firmaPaisa.svg"
              width={120}
              height={50}
              alt="Picture of the author"
            />
          </Link>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-50 hover:text-blue-600 transition-colors"
            >
              <span>Inicio</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center space-x-1 text-gray-50 hover:text-blue-600 transition-colors"
            >
              <span>Inventario</span>
            </Link>
            <Link
              href="/car/register"
              className="flex items-center space-x-1 text-gray-50 hover:text-blue-600 transition-colors"
            >
              <span>Vende tu Vehiculo</span>
            </Link>
            <Link
              href="/catalog"
              className="flex items-center space-x-1 text-gray-50 hover:text-blue-600 transition-colors"
            >
              <span>Accesorios</span>
            </Link>
            {/* <Link
              href="/favorites"
              className="flex items-center space-x-1 text-gray-50 hover:text-blue-600 transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>Favoritos</span>
              {favorites.length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {favorites.length}
                </span>
              )}
            </Link> */}
          </nav>
          {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="default"
                className="flex items-center space-x-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                  {(user?.role === 'dealer' || user?.role === 'admin' || user?.role === 'buyer') && (
                    <Link
                      href={user?.role === 'dealer' ? '/dealer/dashboard' : '/admin/dashboard'}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {user?.role === 'dealer' ? 'Dashboard' : 'Admin'}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          )}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        </div>
      </div>
    </header>
  );
}
