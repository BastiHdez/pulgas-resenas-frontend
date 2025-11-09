import React from 'react';
import { Search, Heart, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PulgashopHeaderProps {
  cartCount?: number;
  wishlistCount?: number;
}

export function PulgashopHeader({ cartCount = 0, wishlistCount = 0 }: PulgashopHeaderProps) {
  return (
    <div>
      {/* Top Banner */}
      <div className="bg-[#22c55e] text-white text-center py-2 text-sm">
        Oferta de Verano en Toda la Ropa y Envío Express Gratis - ¡50% OFF! <span className="font-medium">Comprar Ahora</span>
        <div className="absolute right-4 top-2">
          <button className="text-white text-sm flex items-center gap-1">
            Español <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="text-[#22c55e] text-2xl font-bold">
              PULGASHOP
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-[#22c55e] transition-colors">Inicio</a>
              <a href="#" className="text-gray-600 hover:text-[#22c55e] transition-colors">Contacto</a>
              <a href="#" className="text-gray-600 hover:text-[#22c55e] transition-colors">Acerca de</a>
              <a href="#" className="text-gray-600 hover:text-[#22c55e] transition-colors">Registrarse</a>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar un producto"
                  className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:bg-white transition-all"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Heart className="w-5 h-5 text-gray-600" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#22c55e] text-white text-xs min-w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </Badge>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#22c55e] text-white text-xs min-w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}