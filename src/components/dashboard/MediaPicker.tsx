'use client'

import React, { useEffect, useState } from 'react'
import {
  getMediaList,
  updateMediaMetadata,
  deleteMediaBulk,
  uploadMedia,
} from '@/app/actions/media'
import {
  Check,
  Loader2,
  Search,
  ImageIcon,
  Filter,
  SortAsc,
  Clock,
  Tag as TagIcon,
  Layout,
  Briefcase,
  FileText,
  ChevronRight,
  Save,
  Trash2,
  Sparkles,
  Upload,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn, getMediaUrl } from '@/lib/utils'
import { toast } from 'sonner'

interface MediaPickerProps {
  onSelect: (media: any) => void
  onClose: () => void
  initialCategory?: Category
}

type Category = 'all' | 'brand' | 'logo' | 'favicon' | 'project' | 'post' | 'article' | 'other'
type SortOrder = 'newest' | 'oldest' | 'az'

export const MediaPicker = ({ onSelect, onClose, initialCategory = 'all' }: MediaPickerProps) => {
  const [media, setMedia] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>(initialCategory)
  const [sortBy, setSortBy] = useState<SortOrder>('newest')
  const [isDragging, setIsDragging] = useState(false)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

  // Detail editing state
  const [editAlt, setEditAlt] = useState('')
  const [editCategory, setEditCategory] = useState<
    'brand' | 'logo' | 'favicon' | 'project' | 'post' | 'article' | 'other'
  >('other')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const fetchMedia = async () => {
    setIsLoading(true)
    const result = await getMediaList()
    if (result.success && result.docs) {
      setMedia(result.docs)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const selectedItem = media.find((m) => selectedIds.has(m.id)) || null
  const isMultiSelect = selectedIds.size > 1

  useEffect(() => {
    if (selectedItem && !isMultiSelect) {
      setEditAlt(selectedItem.alt || '')
      setEditCategory(selectedItem.category || 'other')
    }
  }, [selectedItem, isMultiSelect])

  const handleUpdateMetadata = async () => {
    if (selectedIds.size === 0) return
    setIsUpdating(true)
    try {
      const ids = Array.from(selectedIds)
      const results = await Promise.all(
        ids.map((id) =>
          updateMediaMetadata(id, {
            alt: isMultiSelect ? undefined : editAlt,
            category: editCategory as any,
          }),
        ),
      )

      if (results.every((r) => r.success)) {
        toast.success(isMultiSelect ? 'Bulk update successful' : 'Metadata updated')
        setMedia(
          media.map((m) =>
            selectedIds.has(m.id)
              ? { ...m, alt: isMultiSelect ? m.alt : editAlt, category: editCategory }
              : m,
          ),
        )
      }
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }

    setIsDeleting(true)
    try {
      const ids = Array.from(selectedIds)
      const result = await deleteMediaBulk(ids)
      if (result.success) {
        toast.success(isMultiSelect ? `${selectedIds.size} assets deleted` : 'Asset deleted')
        setMedia(media.filter((m) => !selectedIds.has(m.id)))
        setSelectedIds(new Set())
        setLastSelectedId(null)
        setConfirmDelete(false)
        onClose()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Deletion error')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredMedia = media
    .filter((m) => {
      const matchesSearch =
        m.alt?.toLowerCase().includes(search.toLowerCase()) ||
        m.filename?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || m.category === category
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'oldest')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === 'az') return (a.alt || '').localeCompare(b.alt || '')
      return 0
    })

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    const newSelected = new Set(selectedIds)

    if (e.shiftKey && lastSelectedId) {
      const lastIndex = filteredMedia.findIndex((m) => m.id === lastSelectedId)
      const currentIndex = filteredMedia.findIndex((m) => m.id === item.id)

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex)
        const end = Math.max(lastIndex, currentIndex)
        for (let i = start; i <= end; i++) {
          newSelected.add(filteredMedia[i].id)
        }
      }
    } else if (e.metaKey || e.ctrlKey) {
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id)
      } else {
        newSelected.add(item.id)
      }
    } else {
      newSelected.clear()
      newSelected.add(item.id)
    }

    setSelectedIds(newSelected)
    setLastSelectedId(item.id)
  }

  const categories: { label: string; value: Category; icon: any }[] = [
    { label: 'All Media', value: 'all', icon: Layout },
    { label: 'Identity', value: 'brand', icon: TagIcon },
    { label: 'Logos', value: 'logo', icon: ImageIcon },
    { label: 'Icons / Favicons', value: 'favicon', icon: Sparkles },
    { label: 'Projects', value: 'project', icon: Briefcase },
    { label: 'Articles', value: 'article', icon: FileText },
    { label: 'Old Posts', value: 'post', icon: Filter },
    { label: 'Other', value: 'other', icon: Filter },
  ]

  return (
    <div className="flex h-full overflow-hidden bg-background/95 backdrop-blur-2xl text-snappy-fg rounded-[2rem] border border-snappy-border shadow-2xl">
      {/* Sidebar - Folders */}
      <div className="w-64 border-r border-snappy-border/50 flex flex-col bg-snappy-card/5">
        <div className="p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 mb-6 flex items-center gap-2">
            <Layout className="w-4 h-4" /> Media Folders
          </h3>
          <nav className="space-y-1.5 mt-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 relative group overflow-hidden',
                  category === cat.value
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-inner'
                    : 'text-snappy-fg/60 hover:bg-snappy-card/40 hover:text-snappy-fg border border-transparent',
                )}
              >
                {/* Active Indicator Line */}
                {category === cat.value && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 rounded-r-md bg-primary" />
                )}

                <cat.icon
                  className={cn(
                    'w-4 h-4',
                    category === cat.value
                      ? 'text-primary'
                      : 'text-snappy-fg/40 group-hover:text-snappy-fg/80',
                  )}
                />
                <span className="flex-1 text-left">{cat.label}</span>

                {/* Visual Flair for active folder */}
                {category === cat.value && (
                  <Sparkles className="w-3 h-3 text-primary/50 animate-pulse" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Upload Zone in Sidebar */}
        <div className="p-6 mt-auto border-t border-snappy-border/30">
          <div className="p-4 rounded-2xl border border-dashed border-snappy-border bg-snappy-card/10 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] font-bold text-snappy-fg/60">Need to upload?</p>
            <p className="text-[9px] text-snappy-fg/40">
              Drag files to the grid or use the upload button below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-w-0 bg-background/50 relative"
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={async (e) => {
          e.preventDefault()
          setIsDragging(false)
          const files = e.dataTransfer.files
          if (!files?.length) return

          toast.loading(`Uploading ${files.length} file(s)...`, { id: 'upload' })

          try {
            const uploadPromises = Array.from(files).map(async (file) => {
              const formData = new FormData()
              formData.append('file', file)
              formData.append('alt', file.name)
              // Upload into the currently open folder/category
              formData.append('category', category)
              return uploadMedia(formData)
            })

            const results = await Promise.all(uploadPromises)
            const successes = results.filter((r) => r.success).length

            if (successes > 0) {
              toast.success(`Successfully uploaded ${successes} file(s)`, { id: 'upload' })
              fetchMedia() // Refresh the grid
            } else {
              toast.error('Failed to upload files', { id: 'upload' })
            }
          } catch (err) {
            toast.error('An error occurred during upload', { id: 'upload' })
          }
        }}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-dashed border-primary rounded-xl m-4">
            <div className="w-20 h-20 rounded-[2rem] bg-primary/20 flex items-center justify-center animate-bounce mb-4 shadow-xl">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-primary drop-shadow-md">Drop to Upload</h2>
            <p className="text-sm font-bold text-primary/70 mt-2">
              Assets will be saved to the{' '}
              <span className="uppercase text-primary">
                {categories.find((c) => c.value === category)?.label}
              </span>{' '}
              folder
            </p>
          </div>
        )}
        <div className="px-6 py-4 border-b border-snappy-border/50 flex flex-wrap items-center gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black tracking-tight capitalize text-transparent bg-clip-text bg-gradient-to-r from-snappy-fg to-snappy-fg/50">
              {categories.find((c) => c.value === category)?.label || 'All Media'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-snappy-card/50 text-[10px] font-bold border border-snappy-border">
              {filteredMedia.length} files
            </span>
          </div>

          <div className="flex-1 hidden md:block" />

          <div className="relative flex-1 max-w-xs group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-snappy-fg/40">
              <Search className="w-4 h-4" />
            </div>
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-snappy-card/20 border-snappy-border focus:border-primary/50 focus:bg-background transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOrder)}
              className="h-10 pl-3 pr-8 rounded-xl bg-snappy-card/20 border border-snappy-border text-xs font-bold focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">Alphabetical</option>
            </select>
            <SortAsc className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-snappy-fg/40 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-snappy-border scrollbar-track-transparent">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-snappy-fg/40">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p className="text-sm font-bold tracking-widest uppercase">Indexing Drive...</p>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
              {filteredMedia.map((item) => {
                const isPdf =
                  item.url?.toLowerCase().endsWith('.pdf') ||
                  item.filename?.toLowerCase().endsWith('.pdf') ||
                  item.mimetype === 'application/pdf'
                const itemUrl = getMediaUrl(item)

                return (
                  <div
                    key={item.id}
                    onClick={(e) => handleItemClick(e, item)}
                    onDoubleClick={() => {
                      onSelect(item)
                      onClose()
                    }}
                    className={cn(
                      'group relative aspect-square rounded-2xl border overflow-hidden bg-snappy-card/10 transition-all duration-300 cursor-pointer shadow-sm',
                      selectedIds.has(item.id)
                        ? 'border-primary ring-2 ring-primary/20 shadow-primary/10'
                        : 'border-snappy-border/60 hover:border-primary/40 hover:shadow-lg',
                    )}
                  >
                    {isPdf ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-snappy-card/20 to-snappy-card/40 group-hover:from-snappy-card/40 group-hover:to-snappy-card/60 transition-colors">
                        <FileText className="w-8 h-8 text-snappy-fg/30 group-hover:text-primary transition-colors mb-2" />
                        <span className="text-[9px] font-bold text-center text-snappy-fg/50 uppercase tracking-widest line-clamp-1">
                          Document
                        </span>
                      </div>
                    ) : (
                      <img
                        src={itemUrl || ''}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Selection Checkmark */}
                    {selectedIds.has(item.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      </div>
                    )}

                    {/* Hover Selection Overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 transition-opacity duration-200 flex flex-col items-center justify-center p-2 z-20',
                        !selectedIds.has(item.id) && 'group-hover:opacity-100',
                      )}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect(item)
                          onClose()
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 text-center shadow-2xl"
                      >
                        Use Asset
                      </button>
                    </div>

                    {/* Gradient title bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                      <p className="text-[10px] text-white font-medium truncate drop-shadow-md">
                        {item.alt || 'Untitled'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-snappy-fg/40 text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-snappy-card/20 flex items-center justify-center border border-snappy-border shadow-inner">
                <ImageIcon className="w-8 h-8 opacity-20" />
              </div>
              <div>
                <p className="text-base font-bold text-snappy-fg/80">Folder Empty</p>
                <p className="text-xs opacity-60 mt-1">
                  No assets found in {categories.find((c) => c.value === category)?.label}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Panel */}
      {selectedIds.size > 0 && (
        <div className="w-80 border-l border-snappy-border/50 flex flex-col bg-snappy-card/10 backdrop-blur-3xl animate-in slide-in-from-right duration-300 shadow-2xl z-20">
          <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-snappy-border scrollbar-track-transparent">
            {/* Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40">
                  {isMultiSelect ? 'Bulk Selection' : 'Preview'}
                </h3>
                {isMultiSelect && (
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-md">
                    {selectedIds.size} items
                  </span>
                )}
              </div>

              {!isMultiSelect ? (
                <div className="group relative">
                  <div className="aspect-square rounded-[2rem] overflow-hidden border border-snappy-border/50 bg-background shadow-inner flex items-center justify-center">
                    <img
                      src={getMediaUrl(selectedItem) || ''}
                      className="w-full h-full object-contain p-2"
                      alt="Detail View"
                    />
                  </div>
                  <div className="mt-3 bg-snappy-card/30 rounded-xl p-3 border border-snappy-border/30">
                    <p className="text-[10px] font-mono text-snappy-fg/60 break-all leading-relaxed">
                      {selectedItem.filename}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 p-3 bg-snappy-card/20 rounded-2xl border border-snappy-border/50 shadow-inner">
                  {media
                    .filter((m) => selectedIds.has(m.id))
                    .slice(0, 9)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="aspect-square rounded-xl overflow-hidden border border-snappy-border shadow-sm"
                      >
                        <img src={getMediaUrl(m)} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  {selectedIds.size > 9 && (
                    <div className="aspect-square rounded-xl bg-snappy-card/50 flex items-center justify-center text-[10px] font-black text-snappy-fg/60 border border-snappy-border">
                      +{selectedIds.size - 9}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Metadata Section */}
            {!isMultiSelect && (
              <div className="space-y-6 pt-4 border-t border-snappy-border/30">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 mb-2">
                  Metadata
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-snappy-fg/60 px-1 flex justify-between">
                    Alt Text{' '}
                    <span className="text-snappy-fg/30 font-normal">
                      Required for accessibility
                    </span>
                  </label>
                  <Input
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    className="bg-background/50 rounded-xl border-snappy-border focus:border-primary/50 text-xs py-2 shadow-inner"
                    placeholder="Describe this asset..."
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleUpdateMetadata}
                  className={cn(
                    'w-full rounded-xl gap-2 font-bold h-11 transition-all',
                    isUpdating
                      ? 'bg-primary/50'
                      : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20',
                  )}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-snappy-border/50 space-y-3">
            <Button
              type="button"
              onClick={() => {
                if (isMultiSelect) {
                  onSelect(media.filter((m) => selectedIds.has(m.id))[0])
                } else {
                  onSelect(selectedItem)
                }
                onClose()
              }}
              className="w-full rounded-2xl py-6 text-xs font-black uppercase tracking-widest h-14 bg-snappy-fg text-background hover:bg-snappy-fg/90 shadow-xl"
            >
              {isMultiSelect ? `Insert Selection (${selectedIds.size})` : 'Insert Asset'}
            </Button>

            <Button
              variant="ghost"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn(
                'w-full rounded-xl gap-2 font-bold h-10 transition-colors',
                confirmDelete
                  ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30'
                  : 'text-destructive/60 hover:text-destructive hover:bg-destructive/10',
              )}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {confirmDelete
                ? 'Confirm Delete?'
                : isMultiSelect
                  ? 'Delete Selected'
                  : 'Delete Asset'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
