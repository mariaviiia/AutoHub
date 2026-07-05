'use client';

import Link from 'next/link';
import { Search, Heart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import Image from 'next/image';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favorites } = useFavoriteStore();

  return (
    <header className="border-b bg-[#00000054] absolute top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              width={50}
              height={50}
              alt="Picture of the author"
            />
          </Link>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="flex items-center space-x-1 text-gray-50 hover:text-blue-600 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </Link>
            <Link
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
            </Link>
            {isAuthenticated && user?.role === 'dealer' && (
              <Link
                href="/dealer/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/account">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </>
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
