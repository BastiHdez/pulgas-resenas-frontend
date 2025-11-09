import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { cn } from './ui/utils';

interface ReviewFormProps {
  onSubmit?: (review: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ReviewForm({
  onSubmit,
  disabled = false,
  isLoading = false
}: ReviewFormProps) {
  const [reviewText, setReviewText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const maxLength = 500;
  const remainingChars = maxLength - reviewText.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setHasError(true);
      return;
    }
    
    if (reviewText.length > maxLength) {
      setHasError(true);
      return;
    }

    setHasError(false);
    onSubmit?.(reviewText.trim());
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setReviewText(newText);
    
    // Clear error if user starts typing
    if (hasError && newText.trim()) {
      setHasError(false);
    }
  };

  const getCharCountColor = () => {
    if (remainingChars < 0) return 'text-destructive';
    if (remainingChars < 50) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="review-textarea" className="text-sm">
          Escribe tu reseña
        </Label>
        <div className="relative">
          <Textarea
            id="review-textarea"
            placeholder="Comparte tu experiencia con este producto..."
            value={reviewText}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled || isLoading}
            className={cn(
              "min-h-[120px] resize-none pr-16 transition-colors",
              isFocused && "ring-2 ring-ring ring-offset-2",
              hasError && "border-destructive ring-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            maxLength={maxLength + 50} // Allow some overflow for better UX
          />
          <div className={cn(
            "absolute bottom-3 right-3 text-xs transition-colors",
            getCharCountColor()
          )}>
            {remainingChars}
          </div>
        </div>
        {hasError && (
          <p className="text-xs text-destructive">
            {!reviewText.trim() 
              ? "Por favor, escribe una reseña antes de publicar."
              : "La reseña es demasiado larga. Máximo 500 caracteres."
            }
          </p>
        )}
      </div>
      
      <div className="flex justify-start">
        <Button
          type="submit"
          disabled={disabled || isLoading || !reviewText.trim() || reviewText.length > maxLength}
          className="w-full sm:w-auto min-w-[160px] bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Publicando...
          </>
        ) : (
          'Publicar reseña'
        )}
        </Button>
      </div>
    </form>
  );
}