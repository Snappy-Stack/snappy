'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
}

export const RatingStars: React.FC<RatingStarsProps> = ({ value, onChange, readonly = false }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const handleMouseEnter = (index: number) => {
    if (!readonly) setHoverValue(index)
  }

  const handleMouseLeave = () => {
    if (!readonly) setHoverValue(null)
  }

  const handleClick = (index: number) => {
    if (!readonly && onChange) onChange(index)
  }

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((index) => {
        const isActive = (hoverValue !== null ? hoverValue : value) >= index
        return (
          <button
            key={index}
            type="button"
            className={cn(
              'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95',
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            disabled={readonly}
            aria-label={`Rate ${index} out of 5 stars`}
          >
            <Star
              className={cn(
                'w-8 h-8 md:w-10 md:h-10 transition-colors duration-200',
                isActive
                  ? 'fill-primary text-primary'
                  : 'fill-transparent text-snappy-border hover:text-snappy-fg/30',
              )}
              strokeWidth={isActive ? 1.5 : 1}
            />
          </button>
        )
      })}
    </div>
  )
}
