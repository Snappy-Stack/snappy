import React from 'react'
import { Credit } from './Credit'

export const MobileFooter: React.FC = () => {
  return (
    <footer className="w-full bg-background border-t border-snappy-border py-8 px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center space-y-1">
          <p className="text-[10px] text-snappy-fg/40 uppercase tracking-widest font-bold">
            Portfolio Hub
          </p>
        </div>
        <Credit />
        <p className="text-[10px] text-snappy-fg/30">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
