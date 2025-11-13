import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from './ui/utils';

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({
  rating = 0,
  onRatingChange,
  disabled = false,
  showLabel = true,
  size = 'md'
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starValue: number) => {
    if (disabled) return;
    setSelectedRating(starValue);
    onRatingChange?.(starValue);
  };

  const handleStarHover = (starValue: number) => {
    if (disabled) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverRating(0);
  };

  const getStarColor = (starIndex: number) => {
    const currentRating = hoverRating || selectedRating;
    if (starIndex <= currentRating) {
      return disabled ? '#D1D5DB' : '#22c55e';
    }
    return '#E5E5E5';
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoverRating || selectedRating;
    return starIndex <= currentRating ? getStarColor(starIndex) : 'none';
  };

  return (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <label className="text-sm text-foreground">
          Tu puntuación:
        </label>
      )}
      <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            className={cn(
              "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
            )}
            aria-label={`Calificar con ${starValue} estrella${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(sizeClasses[size], "transition-colors duration-200")}
              fill={getStarFill(starValue)}
              stroke={getStarColor(starValue)}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {selectedRating > 0 && (
        <p className="text-xs text-muted-foreground">
          Has calificado con {selectedRating} estrella{selectedRating > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}