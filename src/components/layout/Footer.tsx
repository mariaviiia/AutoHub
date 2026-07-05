import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">AutoMarket</span>
            </div>
            <p className="text-sm">
              Tu marketplace de confianza para comprar y vender vehículos usados.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="hover:text-blue-500 transition-colors">
                  Buscar Vehículos
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* For Dealers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Para Concesionarios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dealer/register" className="hover:text-blue-500 transition-colors">
                  Registrarse como Concesionario
                </Link>
              </li>
              <li>
                <Link href="/dealer/dashboard" className="hover:text-blue-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-500 transition-colors">
                  Planes y Precios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@automarket.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Ciudad de México, MX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AutoMarket. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
