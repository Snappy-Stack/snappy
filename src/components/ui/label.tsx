import * as React from 'react'
import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cn } from '@/lib/utils'

export interface LabelProps extends HTMLArkProps<'label'> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
 ({ className, ...props }, ref) => {
 return (
 <ark.label
 ref={ref}
 className={cn(
 'text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground',
 className,
 )}
 {...props}
 />
 )
 },
)
Label.displayName = 'Label'
