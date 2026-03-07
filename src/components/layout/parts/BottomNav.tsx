import React from 'react'
import Link from 'next/link'
import { Home, Settings, Database, Layers } from 'lucide-react'

export const BottomNav: React.FC = () => {
 const navItems = [
 { label: 'Home', href: '/', icon: Home },
 { label: 'Admin', href: '/admin', icon: Database },
 { label: 'Library', href: '/library', icon: Layers },
 { label: 'Settings', href: '/settings', icon: Settings },
 ]

 return (
 <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-area-inset-bottom">
 <div className="max-w-md mx-auto mb-4 p-1.5 flex items-center justify-around bg-snappy-fg/90 backdrop-blur-2xl rounded-2xl border border-snappy-fg/10 shadow-2xl">
 {navItems.map((item) => (
 <Link
 key={item.label}
 href={item.href}
 className="flex flex-col items-center gap-1.5 flex-1 py-1.5 text-background/40 hover:text-secondary transition-all active:scale-90"
 >
 <item.icon className="h-4 w-4"/>
 <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
 </Link>
 ))}
 </div>
 </nav>
 )
}
