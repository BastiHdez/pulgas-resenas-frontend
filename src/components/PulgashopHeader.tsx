import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, User, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

type NavLink = { label: string; href?: string; to?: string; onClick?: () => void };

interface PulgashopHeaderProps {
  brandName?: string;
  cartCount?: number;
  wishlistCount?: number;
  links?: NavLink[];
  showDevBanner?: boolean;            // banner “en desarrollo”
  initialLanguage?: string;           // 'Español', 'English', etc.
  onLanguageChange?: (lang: string) => void;
  onSearch?: (q: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export function PulgashopHeader({
  brandName = 'PULGASHOP',
  cartCount = 0,
  wishlistCount = 0,
  links = [
    { label: 'Inicio', href: '#' },
    { label: 'Contacto', href: '#' },
    { label: 'Acerca de', href: '#' },
    { label: 'Registrarse', href: '#' },
  ],
  showDevBanner = true,
  initialLanguage = 'Español',
  onLanguageChange,
  onSearch,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  className
}: PulgashopHeaderProps) {
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState(initialLanguage);
  const [langOpen, setLangOpen] = useState(false);

  const submitSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  const changeLang = (newLang: string) => {
    setLang(newLang);
    setLangOpen(false);
    onLanguageChange?.(newLang);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Dev banner (AVISO en desarrollo) */}
      {showDevBanner && (
        <div className="bg-[#dcfce7] text-[#166534] border-b border-[#bbf7d0]">
          <div className="container mx-auto px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>
                <strong>Aviso:</strong> esta página está en <b>desarrollo</b>. Los datos y funciones son de prueba.
              </span>
            </div>
            <span className="hidden sm:block">v0.1.0-dev</span>
          </div>
        </div>
      )}

      {/* Top promo + idioma */}
      <div className="relative bg-[#22c55e] text-white text-center py-2 text-xs sm:text-sm">
        Oferta de Verano en Toda la Ropa y Envío Express Gratis - <span className="font-medium">¡50% OFF! Comprar Ahora</span>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Cambiar idioma"
              className="text-white text-xs sm:text-sm flex items-center gap-1"
            >
              {lang} <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-gray-700 rounded-md shadow z-10 overflow-hidden">
                {['Español', 'English', 'Português'].map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLang(l)}
                    className={cn(
                      'w-full text-left px-3 py-2 hover:bg-gray-100',
                      l === lang && 'bg-gray-50 font-medium'
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Logo */}
            <div className="text-[#22c55e] text-xl sm:text-2xl font-bold select-none">
              {brandName}
            </div>

            {/* Navigation (desktop) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-gray-600 hover:text-[#22c55e] transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <form onSubmit={submitSearch} className="relative">
                <input
                  aria-label="Buscar productos"
                  type="text"
                  placeholder="Buscar un producto"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-100"
                >
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                aria-label="Wishlist"
                onClick={onWishlistClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Heart className="w-5 h-5 text-gray-600" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#22c55e] text-white text-[10px] leading-none min-w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </Badge>
                )}
              </button>

              <button
                aria-label="Carrito"
                onClick={onCartClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#22c55e] text-white text-[10px] leading-none min-w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </button>

              <button
                aria-label="Perfil"
                onClick={onProfileClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation (mobile simple) */}
          <nav className="mt-3 md:hidden flex items-center gap-4 overflow-x-auto no-scrollbar">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className="text-gray-600 hover:text-[#22c55e] transition-colors text-sm whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
