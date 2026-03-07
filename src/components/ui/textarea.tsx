import * as React from 'react'
import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cn } from '@/lib/utils'

export interface TextareaProps extends HTMLArkProps<'textarea'> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <ark.textarea
        className={cn(
          'flex min-h-[6.25rem] w-full rounded-xl border border-snappy-border bg-snappy-card px-4 py-3 text-sm text-foreground placeholder:text-snappy-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:border-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
