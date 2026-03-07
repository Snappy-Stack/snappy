import React from 'react'
import { ShellProps } from './types'
import { DesktopHeader } from '../parts/DesktopHeader'
import { DesktopFooter } from '../parts/DesktopFooter'

/**
 * Flagship Checkout Template (Desktop)
 * Optimized for transactional focus while retaining brand identity via high-fidelity header/footer.
 */
export const CheckoutTemplate: React.FC<ShellProps> = ({ children }) => {
 return (
 <div className="min-h-screen flex flex-col">
 <DesktopHeader />

 <main className="flex-grow pt-24 pb-12">
 <div className="container mx-auto px-6 max-w-6xl">
 <div className="mb-8 border-b border-snappy-border pb-6">
 <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
 Secure <span className="text-primary">Checkout</span>
 </h1>
 <p className="text-xs font-bold text-foreground/60 mt-2 uppercase tracking-widest">
 Step 1 of 2: Details & Review
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
 <div className="lg:col-span-8">{children}</div>

 <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
 <div className="p-8 rounded-[2rem] bg-snappy-card border border-snappy-border shadow-xl shadow-zinc-200/50 dark:shadow-none">
 <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-snappy-border pb-4">
 Order Summary
 </h2>
 <div className="space-y-4">
 <p className="text-xs text-foreground/60 italic">
 No items in your checkout session yet.
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </main>

 <DesktopFooter />
 </div>
 )
}
