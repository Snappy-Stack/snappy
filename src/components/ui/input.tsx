import * as React from 'react'
import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cn } from '@/lib/utils'

export interface InputProps extends HTMLArkProps<'input'> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, type = 'text', ...props }, ref) => {
 return (
 <ark.input
 type={type}
 className={cn(
 'flex h-11 w-full rounded-xl border border-snappy-border bg-snappy-card px-4 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-snappy-fg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:border-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-50',
 className,
 )}
 ref={ref}
 {...props}
 />
 )
 },
)
Input.displayName = 'Input'
