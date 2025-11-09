import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { StarRating } from './StarRating';
import { ReviewForm } from './ReviewForm';
import { ReviewHelpful } from './ReviewHelpful';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  helpfulCount: number;
  notHelpfulCount: number;
}

interface ProductReviewProps {
  productName?: string;
  existingReviews?: Review[];
  className?: string;
  onReviewsUpdate?: (reviews: Review[]) => void;
}

export function ProductReview({
  productName = "Producto",
  existingReviews = [],
  className = "",
  onReviewsUpdate
}: ProductReviewProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>(existingReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with parent reviews when they change
  useEffect(() => {
    setReviews(existingReviews);
  }, [existingReviews]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewSubmit = async (reviewText: string) => {
    if (rating === 0) {
      toast.error("Por favor, califica el producto antes de publicar tu reseña");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newReview: Review = {
        id: Date.now().toString(),
        author: "Usuario",
        rating,
        comment: reviewText,
        date: new Date(),
        helpfulCount: 0,
        notHelpfulCount: 0
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      
      // Notify parent component about the update
      if (onReviewsUpdate) {
        onReviewsUpdate(updatedReviews);
      }
      
      setRating(0);
      
      toast.success("¡Reseña publicada exitosamente!");
    } catch (error) {
      toast.error("Error al publicar la reseña. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (reviewId: string, isHelpful: boolean) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            helpfulCount: isHelpful ? review.helpfulCount + 1 : review.helpfulCount,
            notHelpfulCount: !isHelpful ? review.notHelpfulCount + 1 : review.notHelpfulCount
          }
        : review
    );
    
    setReviews(updatedReviews);
    
    // Notify parent component about the update
    if (onReviewsUpdate) {
      onReviewsUpdate(updatedReviews);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Section Title */}
      <div className="space-y-2">
        <h2>Valoraciones y Reseñas</h2>
        <p className="text-muted-foreground">
          Comparte tu experiencia y lee lo que otros usuarios opinan sobre este producto
        </p>
      </div>

      {/* Write Review Section */}
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
            </div>
            <div className="lg:col-span-2">
              <Separator className="mb-6" />
              <ReviewForm
                onSubmit={handleReviewSubmit}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Reviews Section */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reseñas ({reviews.length})</CardTitle>
              <Badge variant="secondary">
                {reviews.length} reseña{reviews.length > 1 ? 's' : ''}
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
                            <span className="font-medium text-sm truncate">{review.author}</span>
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
                        {review.comment}
                      </p>
                    </div>
                    
                    {/* Review Actions */}
                    <div className="pl-13">
                      <ReviewHelpful
                        initialHelpfulCount={review.helpfulCount}
                        initialNotHelpfulCount={review.notHelpfulCount}
                        onVote={(isHelpful) => handleVote(review.id, isHelpful)}
                      />
                    </div>
                  </div>
                  
                  {index < reviews.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}