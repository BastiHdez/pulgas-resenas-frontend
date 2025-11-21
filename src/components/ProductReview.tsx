import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { StarRating } from './StarRating';
import { ReviewForm } from './ReviewForm';
import { ReviewHelpful } from './ReviewHelpful';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { ratingsService } from '../db/services/ratingsService';

// Identidad de prueba leída desde la URL (?uid=...&name=...)
const TEST_IDENTITY = (() => {
  const qs = new URLSearchParams(window.location.search);
  const uid = Number(qs.get('uid') ?? '10');
  const name = qs.get('name') ?? `User ${uid}`;
  return {
    idComprador: uid,
    nombreComprador: name,
  };
})();

// Tipo local para tu UI
interface Review {
  id: string;
  authorId: number;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  helpfulCount: number;
  notHelpfulCount: number;
}

interface ProductReviewProps {
  productId?: number;        // NECESARIO para la API
  productName?: string;
  currentUserId?: number;    // idComprador (opcional, ahora es fallback)
  currentSellerId?: number;  // idVendedor (del producto)
  currentBuyerName?: string; // nombre comprador (fallback)

  className?: string;
  onReviewsUpdate?: (reviews: Review[]) => void;
}

export function ProductReview({
  productId = 1,
  productName = 'Producto',
  currentUserId,           // ahora SIN default, usamos fallback interno
  currentSellerId = 45,
  currentBuyerName,
  className = '',
  onReviewsUpdate,
}: ProductReviewProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Control de edición
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingInitialText, setEditingInitialText] = useState<string>('');

  // Promedio
  const [avg, setAvg] = useState<{ average: number; count: number }>({
    average: 0,
    count: 0,
  });

  // ---------------------------
  // Identidad efectiva
  // ---------------------------
  // Prioridad: URL -> props -> valor fijo de respaldo
  const effectiveUserId =
    TEST_IDENTITY.idComprador ?? currentUserId ?? 10;

  const effectiveBuyerName =
    TEST_IDENTITY.nombreComprador ??
    currentBuyerName ??
    'UserTest';

  // ---------------------------
  // Carga de datos
  // ---------------------------
  async function loadAll() {
    try {
      // promedio
      const a = await ratingsService.getAverage(productId);
      setAvg({ average: a.average, count: a.count });

      // comentarios (paginación simple: 10 primeros)
      const l = await ratingsService.listComments(productId, 10, 0);
      const mapped: Review[] = (l.items || []).map((it) => ({
        id: it.idResena,
        authorId: it.idComprador,
        author: it.nombreComprador,
        rating: it.puntuacion,
        comment: it.comentario ?? '',
        date: new Date(it.fecha),
        helpfulCount: it.votos?.up ?? 0,
        notHelpfulCount: it.votos?.down ?? 0,
      }));
      setReviews(mapped);
      onReviewsUpdate?.(mapped);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'No se pudo cargar reseñas.');
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // ---------------------------
  // Handlers
  // ---------------------------

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  // Iniciar edición
  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditingInitialText(review.comment || '');
    setRating(review.rating);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditingInitialText('');
    setRating(0);
  };

  // Crear / editar reseña (upsert)
  const handleReviewSubmit = async (reviewText: string) => {
    if (rating === 0) {
      toast.error(
        'Por favor, califica el producto antes de publicar (las estrellas son obligatorias).'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingsService.rateProduct(productId, {
        idComprador: effectiveUserId,
        idVendedor: currentSellerId,
        nombreComprador: effectiveBuyerName,
        puntuacion: rating,
        comentario: reviewText?.trim() ? reviewText.trim() : undefined, // OPCIONAL
      });

      await loadAll();

      const isEdit = Boolean(editingReviewId);

      // Reset UI
      setRating(0);
      setEditingReviewId(null);
      setEditingInitialText('');

      toast.success(isEdit ? '¡Reseña actualizada!' : '¡Reseña registrada!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al publicar la reseña.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Votar útil / no útil
  const handleVote = async (reviewId: string, isHelpful: boolean) => {
    try {
      await ratingsService.voteReview(reviewId, {
        idUsuario: effectiveUserId,
        voto: isHelpful ? 'up' : 'down',
      });
      await loadAll();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Error al votar.');
    }
  };

  // Borrar reseña (solo autor)
  const handleDeleteReview = async (review: Review) => {
    const confirmDelete = window.confirm(
      '¿Seguro que quieres borrar tu reseña? Esta acción no se puede deshacer.'
    );
    if (!confirmDelete) return;

    try {
      await ratingsService.deleteReview(review.id, {
        idComprador: effectiveUserId,
      });

      // si estabas editando esta misma reseña, resetea el formulario
      if (editingReviewId === review.id) {
        handleCancelEdit();
      }

      await loadAll();
      toast.success('Reseña eliminada.');
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message || 'No se pudo eliminar la reseña.'
      );
    }
  };

  // ---------------------------
  // Helpers visuales
  // ---------------------------

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-sm"
            style={{ color: star <= rating ? '#22c55e' : '#E5E5E5' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const roundedAvg =
    Math.round((avg.average + Number.EPSILON) * 10) / 10;

  // ---------------------------
  // Render
  // ---------------------------

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header producto + promedio */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-medium">{productName}</h2>
        <div className="flex items-center gap-2">
          <StarRating
            rating={avg.average}
            disabled
            showLabel={false}
            size="sm"
          />
          <span className="text-sm text-muted-foreground">
            {roundedAvg} ({avg.count})
          </span>
        </div>
      </div>

      {/* Escribir reseña */}
      <Card>
        <CardHeader>
          <CardTitle>Evalúa este producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <StarRating
                rating={rating}
                onRatingChange={handleRatingChange}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Comentario <strong>opcional</strong>. Las estrellas son
                obligatorias.
              </p>
            </div>
            <div className="lg:col-span-2">
              <Separator className="mb-6" />
              <ReviewForm
                onSubmit={handleReviewSubmit}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                initialText={editingInitialText}
                mode={editingReviewId ? 'edit' : 'create'}
                onCancelEdit={
                  editingReviewId ? handleCancelEdit : undefined
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reseñas existentes */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reseñas ({reviews.length})</CardTitle>
              <Badge variant="secondary">
                {reviews.length} reseña
                {reviews.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={review.id}>
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-[#22c55e] text-white">
                          {review.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {review.author}
                            </span>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="pl-13">
                      <p className="text-sm text-foreground leading-relaxed break-words">
                        {review.comment || (
                          <span className="text-muted-foreground italic">
                            sin comentario
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Review Actions */}
                    <div className="pl-13">
                      <ReviewHelpful
                        initialHelpfulCount={review.helpfulCount}
                        initialNotHelpfulCount={review.notHelpfulCount}
                        onVote={(isHelpful) =>
                          handleVote(review.id, isHelpful)
                        }
                      />

                      {Number(review.authorId) === Number(effectiveUserId) && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <button
                            type="button"
                            className="underline"
                            onClick={() => handleStartEdit(review)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="underline text-red-500"
                            onClick={() => handleDeleteReview(review)}
                          >
                            Borrar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {index < reviews.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
