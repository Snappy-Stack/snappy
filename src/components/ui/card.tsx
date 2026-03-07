import * as React from 'react'
import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cn } from '@/lib/utils'

export const Card = React.forwardRef<HTMLDivElement, HTMLArkProps<'div'>>(
 ({ className, ...props }, ref) => (
 <ark.div
 ref={ref}
 className={cn(
 'rounded-2xl border border-snappy-border bg-snappy-card text-snappy-card-fg shadow-lg shadow-black/5',
 className,
 )}
 {...props}
 />
 ),
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, HTMLArkProps<'div'>>(
 ({ className, ...props }, ref) => (
 <ark.div ref={ref} className={cn('flex flex-col space-y-2 p-6', className)} {...props} />
 ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, HTMLArkProps<'h3'>>(
 ({ className, ...props }, ref) => (
 <ark.h3
 ref={ref}
 className={cn('font-bold leading-none tracking-tight text-xl text-foreground', className)}
 {...props}
 />
 ),
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, HTMLArkProps<'p'>>(
 ({ className, ...props }, ref) => (
 <ark.p
 ref={ref}
 className={cn('text-sm font-medium text-snappy-fg/60', className)}
 {...props}
 />
 ),
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, HTMLArkProps<'div'>>(
 ({ className, ...props }, ref) => (
 <ark.div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
 ),
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, HTMLArkProps<'div'>>(
 ({ className, ...props }, ref) => (
 <ark.div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
 ),
)
CardFooter.displayName = 'CardFooter'
