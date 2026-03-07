import React from 'react'

export const Credit: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-[10px] text-snappy-fg/30 tracking-tight ${className}`}>
      Build using{' '}
      <a
        href="https://wicky.id/snappy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-snappy-fg font-medium hover:text-primary transition-colors"
      >
        snappy stack
      </a>{' '}
      by{' '}
      <a
        href="https://wicky.id"
        target="_blank"
        rel="noopener noreferrer"
        className="text-snappy-fg font-bold hover:text-secondary transition-colors"
      >
        wicky.id
      </a>
    </div>
  )
}
