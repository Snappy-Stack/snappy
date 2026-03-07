'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  FileText,
  Globe,
  Lock,
  Clock,
  X,
  ExternalLink,
  Star,
  Link,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ContentType = 'projects' | 'articles' | 'reviews'
type Filter = 'all' | 'published' | 'draft'

interface ContentBrowserProps {
  type: ContentType
  items: any[]
  isDeleting: string | null
  onAdd: () => void
  onEdit: (item: any) => void
  onDelete: (id: string | number) => void
  onClose: () => void
}

export const ContentBrowser: React.FC<ContentBrowserProps> = ({
  type,
  items,
  isDeleting,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const isProject = type === 'projects'
  const isArticle = type === 'articles'
  const isReview = type === 'reviews'

  const Icon = isProject ? Briefcase : isArticle ? FileText : Star
  const label = isProject ? 'Project' : isArticle ? 'Article' : 'Review'
  const labelPlural = isProject ? 'Projects' : isArticle ? 'Articles' : 'Reviews'

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.title?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
        item.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        item.clientName?.toLowerCase().includes(query.toLowerCase()) ||
        item.projectName?.toLowerCase().includes(query.toLowerCase()) ||
        item.comment?.toLowerCase().includes(query.toLowerCase())

      const status = item.status || (item._status === 'published' ? 'published' : 'draft')
      const matchesFilter =
        filter === 'all' ||
        (filter === 'published' && status === 'published') ||
        (filter === 'draft' && status !== 'published')

      return matchesQuery && matchesFilter
    })
  }, [items, query, filter])

  const publishedCount = items.filter(
    (i) => i.status === 'published' || i._status === 'published',
  ).length
  const draftCount = items.length - publishedCount

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Top bar */}
      <div className="px-8 pt-8 pb-5 flex-shrink-0 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">{labelPlural}</h2>
              <p className="text-xs text-snappy-fg/50 font-medium">
                {items.length} total · {publishedCount} live · {draftCount} drafts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onAdd} className="h-9 px-4 rounded-xl text-xs font-bold gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              {isReview ? 'New Slot' : `New ${label}`}
            </Button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-snappy-border flex items-center justify-center text-snappy-fg/50 hover:text-snappy-fg hover:bg-snappy-card transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-snappy-fg/40" />
            <input
              type="text"
              placeholder={`Search ${labelPlural.toLowerCase()}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-snappy-border text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-snappy-fg/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-snappy-fg/40 hover:text-snappy-fg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-snappy-card border border-snappy-border">
            {(['all', 'published', 'draft'] as Filter[]).map((f) => {
              let displayLabel: string = f
              if (isReview) {
                if (f === 'published') displayLabel = 'Approved'
                if (f === 'draft') displayLabel = 'Not Approved'
              }
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                    filter === f
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-snappy-fg/50 hover:text-snappy-fg',
                  )}
                >
                  {displayLabel}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-2 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-snappy-card border border-snappy-border flex items-center justify-center">
              <Icon className="w-8 h-8 text-snappy-fg/20" />
            </div>
            <div>
              <p className="text-sm font-semibold text-snappy-fg/60">
                {query ? `No results for "${query}"` : `No ${labelPlural.toLowerCase()} yet`}
              </p>
              <p className="text-xs text-snappy-fg/30 mt-1">
                {query ? 'Try a different search term' : `Click "New ${label}" to get started`}
              </p>
            </div>
          </div>
        ) : (
          filtered.map((item) => {
            const status = item.status || (item._status === 'published' ? 'published' : 'draft')
            const isPublished = status === 'published'
            const isDeletingItem =
              isDeleting === `${isProject ? 'project' : isArticle ? 'post' : 'review'}-${item.id}`

            return (
              <div
                key={item.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-snappy-border bg-background hover:bg-snappy-card hover:border-primary/20 transition-all duration-200"
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                    isPublished ? 'bg-success/10' : 'bg-warning/10',
                  )}
                >
                  {isPublished ? (
                    <Globe className="w-4 h-4 text-success" />
                  ) : (
                    <Clock className="w-4 h-4 text-warning" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold truncate">
                      {isReview
                        ? `${item.clientName} for ${item.projectName}`
                        : item.title || 'Untitled'}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide flex-shrink-0',
                        isPublished ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                      )}
                    >
                      {isReview
                        ? isPublished
                          ? 'Approved'
                          : 'Not Approved'
                        : isPublished
                          ? 'Live'
                          : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-snappy-fg/40 truncate">
                    {isReview
                      ? item.comment || 'No feedback submitted yet'
                      : item.tagline || item.excerpt || item.description || 'No description'}
                  </p>
                  {isReview && item.pin && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-snappy-fg/30">
                        PIN:
                      </span>
                      <code className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                        {item.pin}
                      </code>
                    </div>
                  )}
                </div>

                {/* Star rating for reviews */}
                {isReview && item.rating && (
                  <div className="flex items-center gap-1 mr-4">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                )}

                {/* Actions — shown on hover */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                  {isReview && (
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/rate/${item.slug}`
                        navigator.clipboard.writeText(url)
                        toast.success('Rating link copied!')
                      }}
                      className="w-8 h-8 rounded-lg bg-snappy-card border border-snappy-border flex items-center justify-center text-snappy-fg/50 hover:text-primary hover:border-primary/30 transition-all"
                      title="Copy Rating Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item)}
                    className="w-8 h-8 rounded-lg bg-snappy-card border border-snappy-border flex items-center justify-center text-snappy-fg/50 hover:text-primary hover:border-primary/30 transition-all"
                    title={`Edit ${label}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    disabled={isDeletingItem}
                    className="w-8 h-8 rounded-lg bg-snappy-card border border-snappy-border flex items-center justify-center text-snappy-fg/50 hover:text-destructive hover:border-destructive/30 transition-all disabled:opacity-30"
                    title={`Delete ${label}`}
                  >
                    {isDeletingItem ? (
                      <div className="w-3.5 h-3.5 border-2 border-destructive/40 border-t-destructive rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
