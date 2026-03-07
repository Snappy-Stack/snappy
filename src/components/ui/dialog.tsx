import * as React from 'react'
import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { cn } from '@/lib/utils'

export const Dialog = ArkDialog.Root
export const DialogTrigger = ArkDialog.Trigger
export const DialogCloseTrigger = ArkDialog.CloseTrigger

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof ArkDialog.Content>,
  React.ComponentPropsWithoutRef<typeof ArkDialog.Content>
>(({ className, children, ...props }, ref) => (
  <ArkDialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <ArkDialog.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200" />
    <ArkDialog.Content
      ref={ref}
      className={cn(
        'z-50 w-full rounded-3xl border border-snappy-border bg-snappy-card p-6 shadow-2xl data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=closed]:scale-95 transition-all duration-300 ease-out',
        className,
      )}
      {...props}
    >
      {children}
    </ArkDialog.Content>
  </ArkDialog.Positioner>
))
DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left mb-5', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-8', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof ArkDialog.Title>,
  React.ComponentPropsWithoutRef<typeof ArkDialog.Title>
>(({ className, ...props }, ref) => (
  <ArkDialog.Title
    ref={ref}
    className={cn('text-xl font-bold leading-none tracking-tight text-foreground', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof ArkDialog.Description>,
  React.ComponentPropsWithoutRef<typeof ArkDialog.Description>
>(({ className, ...props }, ref) => (
  <ArkDialog.Description
    ref={ref}
    className={cn('text-sm font-medium text-snappy-fg/60', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'
