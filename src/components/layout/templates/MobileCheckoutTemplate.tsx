import React from 'react'
import { ShellProps } from './types'
import { MobileHeader } from '../parts/MobileHeader'
import { MobileFooter } from '../parts/MobileFooter'

/**
 * Specialized Mobile Checkout Template
 * Optimized for single-column transactional efficiency and thumb-reach interactivity.
 */
export const MobileCheckoutTemplate: React.FC<ShellProps> = ({ children }) => {
 return (
 <div className="min-h-screen flex flex-col">
 <MobileHeader />

 <main className="flex-grow p-5 pb-24">
 <div className="mb-8">
 <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase">
 Secure <span className="text-primary">Checkout</span>
 </h1>
 <div className="h-1 w-12 bg-primary mt-1 rounded-full"/>
 </div>

 <div className="space-y-10">
 <div className="p-6 rounded-[2rem] bg-background text-white shadow-2xl shadow-blue-500/10">
 <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
 Quick Summary
 </h2>
 <p className="text-lg font-black italic opacity-40">Ready to deploy.</p>
 </div>

 <div className="animate-in slide-in-from-bottom-6 duration-500">{children}</div>
 </div>
 </main>

 <div className="p-5">
 <MobileFooter />
 </div>
 </div>
 )
}
