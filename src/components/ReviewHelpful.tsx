import React, { useState } from 'react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface ReviewHelpfulProps {
  initialHelpfulCount?: number;
  initialNotHelpfulCount?: number;
  onVote?: (isHelpful: boolean) => void;
  disabled?: boolean;
  userVote?: 'helpful' | 'not-helpful' | null;
}

export function ReviewHelpful({
  initialHelpfulCount = 23,
  initialNotHelpfulCount = 2,
  onVote,
  disabled = false,
  userVote = null
}: ReviewHelpfulProps) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [notHelpfulCount, setNotHelpfulCount] = useState(initialNotHelpfulCount);
  const [currentVote, setCurrentVote] = useState<'helpful' | 'not-helpful' | null>(userVote);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleVote = (isHelpful: boolean) => {
    if (disabled) return;

    const voteType = isHelpful ? 'helpful' : 'not-helpful';
    
    // If user clicks the same vote again, remove it
    if (currentVote === voteType) {
      setCurrentVote(null);
      if (isHelpful) {
        setHelpfulCount(prev => Math.max(0, prev - 1));
      } else {
        setNotHelpfulCount(prev => Math.max(0, prev - 1));
      }
    } else {
      // Remove previous vote if exists
      if (currentVote === 'helpful') {
        setHelpfulCount(prev => Math.max(0, prev - 1));
      } else if (currentVote === 'not-helpful') {
        setNotHelpfulCount(prev => Math.max(0, prev - 1));
      }
      
      // Add new vote
      setCurrentVote(voteType);
      if (isHelpful) {
        setHelpfulCount(prev => prev + 1);
      } else {
        setNotHelpfulCount(prev => prev + 1);
      }
    }

    onVote?.(isHelpful);
    
    // Show confirmation message
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-foreground">
          ¿Te resultó útil esta reseña?
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote(true)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-1.5 transition-all duration-200",
              currentVote === 'helpful' && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
              "hover:scale-105 active:scale-95"
            )}
          >
            <span className="text-base">👍</span>
            <span>Sí ({helpfulCount})</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote(false)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-1.5 transition-all duration-200",
              currentVote === 'not-helpful' && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
              "hover:scale-105 active:scale-95"
            )}
          >
            <span className="text-base">👎</span>
            <span>No ({notHelpfulCount})</span>
          </Button>
        </div>
      </div>
      
      {showConfirmation && (
        <div className={cn(
          "text-xs text-green-600 animate-in fade-in duration-200",
          "bg-green-50 border border-green-200 rounded-md px-3 py-2"
        )}>
          Gracias por tu feedback
        </div>
      )}
    </div>
  );
}