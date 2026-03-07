'use client'

import React, { useEffect, useState } from 'react'

export const DebugLabel: React.FC<{ device: string; type: string; ua: string }> = ({
 device,
 type,
 ua,
}) => {
 const [isVisible, setIsVisible] = useState(false)

 useEffect(() => {
 setIsVisible(true)
 }, [])

 if (!isVisible || process.env.NODE_ENV !== 'development') return null

 return (
 <div className="fixed bottom-4 left-4 z-[9999] opacity-40 hover:opacity-100 transition-opacity max-w-[200px]">
 <div className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-tighter rounded border border-white/20 whitespace-normal break-all shadow-2xl">
 <div className="flex justify-between items-start mb-1 border-b border-white/10 pb-1">
 <span>
 SHELL: {device} | {type}
 </span>
 </div>
 <div className="opacity-50 mb-2 font-mono">UA: {ua}</div>
 <button
 onClick={() => {
 document.cookie =
 'snappy-device-override=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
 window.location.reload()
 }}
 className="w-full py-1 bg-background hover:bg-primary text-white rounded-[2px] transition-colors pointer-events-auto cursor-pointer font-bold"
 >
 RESET OVERRIDE ⚡
 </button>
 </div>
 </div>
 )
}
