import React, { useState } from "react";
import { ProductReview } from "./components/ProductReview";
import { PulgashopHeader } from "./components/PulgashopHeader";
import { Toaster } from "./components/ui/sonner";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Star, Heart, Share2, Eye } from "lucide-react";
import { toast } from "sonner@2.0.3";

// Definir tipos para las reseñas
interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  helpfulCount: number;
  notHelpfulCount: number;
}

// Mock data inicial para demostración
const initialReviews: Review[] = [
  {
    id: "1",
    author: "María González",
    rating: 5,
    comment:
      "Excelente chaqueta, la calidad es muy buena y el color rojo es hermoso. Perfecta para el invierno, muy abrigada y el diseño es moderno. La talla es correcta y llegó muy rápido. Definitivamente la recomiendo.",
    date: new Date("2024-01-15"),
    helpfulCount: 12,
    notHelpfulCount: 1,
  },
  {
    id: "2",
    author: "Carlos López",
    rating: 4,
    comment:
      "Muy buen producto en general. La chaqueta es de buena calidad aunque esperaba que fuera un poco más gruesa para el frío extremo. El diseño está muy bien y la talla es perfecta.",
    date: new Date("2024-01-10"),
    helpfulCount: 8,
    notHelpfulCount: 0,
  },
  {
    id: "3",
    author: "Ana Rodríguez",
    rating: 3,
    comment:
      "Producto decente por el precio. La chaqueta cumple con lo básico, aunque los acabados podrían mejorar. El color es bonito y la talla corresponde a lo esperado.",
    date: new Date("2024-01-05"),
    helpfulCount: 5,
    notHelpfulCount: 3,
  },
];

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  // Calcular promedio dinámicamente basado en las reseñas actuales
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    setCartCount((prevCount) => prevCount + 1);
    toast.success("¡Producto añadido al carrito!", {
      description:
        "Chaqueta de Invierno Premium agregada exitosamente",
      duration: 3000,
    });
  };

  const handleToggleLike = () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
      if (newIsLiked) {
        toast.success("¡Producto añadido a favoritos!", {
          description:
            "Puedes ver tus productos favoritos en tu lista de deseos",
          duration: 3000,
        });
      } else {
        toast.info("Producto removido de favoritos", {
          description:
            "El producto ya no está en tu lista de deseos",
          duration: 2000,
        });
      }
      return newIsLiked;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PulgashopHeader
        cartCount={cartCount}
        wishlistCount={isLiked ? 1 : 0}
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-600">
          <span>Estado de Publicaciones</span>
          <span className="mx-2">›</span>
          <span className="text-[#22c55e]">
            Camisa VENDIDA POR Tienda Ropa Bonita
          </span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Product Overview Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-[#dcfce7] rounded-lg p-8 flex items-center justify-center relative">
                {/* Like Button */}
                <button
                  onClick={handleToggleLike}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                    isLiked
                      ? "bg-[#22c55e] text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-200 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                </button>
                <img
                  src="https://images.unsplash.com/photo-1635062562403-117becb17d3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBqYWNrZXQlMjB3aW50ZXIlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTcxNjg1MjJ8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Chaqueta Roja de Invierno"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Action Icons */}
              <div className="flex gap-3 justify-end">
                <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl font-medium text-gray-900">
                  Chaqueta de Invierno Premium
                </h1>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4"
                        fill={
                          star <= Math.round(averageRating)
                            ? "#22c55e"
                            : "none"
                        }
                        stroke={
                          star <= Math.round(averageRating)
                            ? "#22c55e"
                            : "#E5E5E5"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
                  </span>
                  <span className="text-sm text-[#22c55e] font-medium">
                    En Stock
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl text-[#ef4444] font-medium">
                    $260
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    $360
                  </span>
                </div>

                {/* Description */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Esta chaqueta, confeccionada con materiales
                    de alta calidad, combina un diseño moderno
                    con la máxima funcionalidad. Su tejido
                    ligero y resistente la hace ideal para
                    cualquier clima, proporcionando comodidad y
                    protección sin sacrificar el estilo. Con
                    detalles pensados para el día a día, como
                    múltiples bolsillos y un ajuste cómodo, esta
                    prenda es perfecta para complementar
                    cualquier atuendo, ya sea casual o formal.
                    Es una pieza versátil y duradera que se
                    convertirá en un básico imprescindible en tu
                    armario.
                  </p>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-3 text-base font-medium"
                >
                  Añadir al carrito
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section - Full Width */}
          <ProductReview
            productName="Chaqueta de Invierno Premium"
            existingReviews={reviews}
            onReviewsUpdate={setReviews}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#22c55e] text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Exclusivo */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Exclusivo</h3>
              <div className="space-y-3">
                <h4 className="font-medium">Suscribirse</h4>
                <p className="text-sm opacity-90">
                  Obtén 10% de descuento en tu primer pedido
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Ingresa tu email"
                    className="flex-1 px-3 py-2 bg-transparent border border-white/30 rounded-l text-sm placeholder-white/70 focus:outline-none focus:border-white/60"
                  />
                  <button className="px-3 py-2 border border-white/30 rounded-r border-l-0 hover:bg-white/10">
                    <span className="text-sm">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Soporte */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Soporte</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>
                  Calle Principal 123, Ciudad,
                  <br />
                  CP 12345, España.
                </p>
                <p>soporte@pulgashop.com</p>
                <p>+34-900-123-456</p>
              </div>
            </div>

            {/* Cuenta */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Cuenta</h3>
              <div className="space-y-2 text-sm opacity-90">
                <a href="#" className="block hover:opacity-100">
                  Mi Cuenta
                </a>
                <a href="#" className="block hover:opacity-100">
                  Iniciar Sesión / Registro
                </a>
                <a href="#" className="block hover:opacity-100">
                  Carrito
                </a>
                <a href="#" className="block hover:opacity-100">
                  Lista de Deseos
                </a>
                <a href="#" className="block hover:opacity-100">
                  Tienda
                </a>
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">
                Enlaces Rápidos
              </h3>
              <div className="space-y-2 text-sm opacity-90">
                <a href="#" className="block hover:opacity-100">
                  Política de Privacidad
                </a>
                <a href="#" className="block hover:opacity-100">
                  Términos de Uso
                </a>
                <a href="#" className="block hover:opacity-100">
                  Preguntas Frecuentes
                </a>
                <a href="#" className="block hover:opacity-100">
                  Contacto
                </a>
              </div>
            </div>

            {/* Descargar App */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">
                Descargar App
              </h3>
              <div className="space-y-3">
                <p className="text-xs opacity-75">
                  Ahorra €3 solo para nuevos usuarios de la app
                </p>
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-white/10 rounded flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="w-24 h-8 bg-black/20 rounded flex items-center justify-center text-xs">
                      Google Play
                    </div>
                    <div className="w-24 h-8 bg-black/20 rounded flex items-center justify-center text-xs">
                      App Store
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}