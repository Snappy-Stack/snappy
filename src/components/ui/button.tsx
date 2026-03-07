import * as React from 'react'
import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cn } from '@/lib/utils'

export interface ButtonProps extends HTMLArkProps<'button'> {
 variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
 size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
 return (
 <ark.button
 ref={ref}
 className={cn(
 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200',
 {
 'bg-primary text-white shadow-md hover:bg-primary/90': variant === 'primary',
 'bg-secondary text-black shadow-sm hover:bg-secondary/90': variant === 'secondary',
 'border border-snappy-border bg-transparent hover:bg-snappy-border text-foreground':
 variant === 'outline',
 'hover:bg-snappy-border text-foreground': variant === 'ghost',
 'h-9 px-4 py-2': size === 'sm',
 'h-11 px-6 py-2': size === 'md',
 'h-12 px-8 py-2 text-base': size === 'lg',
 'h-10 w-10': size === 'icon',
 },
 className,
 )}
 {...props}
 />
 )
 },
)
Button.displayName = 'Button'
