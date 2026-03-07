'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { uploadMedia } from '@/app/actions/media'
import { Image as ImageIcon, X, Upload, Loader2, Library, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MediaPicker } from './MediaPicker'
import { cn, getMediaUrl } from '@/lib/utils'

interface MediaUploaderProps {
  onUpload: (media: any) => void
  currentValue?: any
  label?: string
  aspectRatio?: 'square' | 'video' | 'any'
  category?: 'brand' | 'logo' | 'favicon' | 'project' | 'post' | 'other'
}

import { useModals } from '@/providers/ModalProvider'

export const MediaUploader = ({
  onUpload,
  currentValue,
  label,
  aspectRatio = 'any',
  category = 'other',
}: MediaUploaderProps) => {
  const { push } = useModals()
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const preview = getMediaUrl(currentValue)
  const isPdf =
    preview?.toLowerCase().endsWith('.pdf') || currentValue?.mimetype === 'application/pdf'

  const handleOpenPicker = () => {
    push('media-picker', {
      category,
      onSelect: (media: any) => onUpload(media),
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', file.name)
    formData.append('category', category)

    try {
      const result = await uploadMedia(formData)
      if (result.success && result.doc) {
        onUpload(result.doc)
      } else {
        alert('Upload failed')
      }
    } catch (error) {
      console.error(error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpload(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60">
            {label}
          </label>
        )}
      </div>

      <div
        className={cn(
          'relative group border-2 border-dashed border-snappy-border rounded-3xl overflow-hidden transition-all duration-500 bg-snappy-card/5',
          aspectRatio === 'square'
            ? 'aspect-square'
            : aspectRatio === 'video'
              ? 'aspect-video'
              : 'min-h-[13.75rem]',
          !preview && 'border-none bg-transparent',
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="relative w-full h-full group/preview">
            {isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-snappy-card/50 rounded-2xl p-4">
                <FileText className="w-12 h-12 text-primary mb-2 opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-snappy-fg/60 text-center line-clamp-2">
                  {currentValue?.alt || 'PDF Document'}
                </span>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-[2rem] p-2"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm rounded-[2rem] m-2">
              <div className="flex gap-2 scale-90 group-hover/preview:scale-100 transition-transform duration-500">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl h-10 px-4 font-bold bg-white text-black hover:bg-white/90"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleOpenPicker}
                  className="rounded-xl h-10 px-4 font-bold border-white/20 text-white hover:bg-white/10"
                >
                  <Library className="w-4 h-4 mr-2" /> Library
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-4 right-4 p-2 bg-destructive/80 hover:bg-destructive rounded-xl text-white shadow-xl transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/preview:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-4 h-full min-h-[11.25rem] p-2 relative"
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
              const file = e.dataTransfer.files?.[0]
              if (!file) return

              setIsUploading(true)
              const formData = new FormData()
              formData.append('file', file)
              formData.append('alt', file.name)
              formData.append('category', category)

              try {
                const result = await uploadMedia(formData)
                if (result.success && result.doc) {
                  onUpload(result.doc)
                } else {
                  alert('Upload failed')
                }
              } catch (error) {
                console.error(error)
                alert('Upload failed')
              } finally {
                setIsUploading(false)
              }
            }}
          >
            {isDragging && (
              <div className="absolute inset-2 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary rounded-[2rem] pointer-events-none">
                <h2 className="text-xl font-black text-primary drop-shadow-md tracking-widest uppercase">
                  Drop File
                </h2>
              </div>
            )}

            {/* Upload Option */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group/opt relative flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-snappy-card/20 border-2 border-dashed border-snappy-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/opt:scale-110 transition-transform duration-500">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest">Upload</p>
                <p className="text-[10px] text-snappy-fg/40 font-bold uppercase tracking-tighter mt-1">
                  New Asset
                </p>
              </div>
            </button>

            {/* Library Option */}
            <button
              type="button"
              onClick={handleOpenPicker}
              className="group/opt relative flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-snappy-card/20 border-2 border-dashed border-snappy-border hover:border-snappy-fg/40 hover:bg-snappy-fg/5 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-snappy-fg/5 flex items-center justify-center border border-snappy-border group-hover/opt:scale-110 transition-transform duration-500">
                <Library className="w-6 h-6 text-snappy-fg/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest">Library</p>
                <p className="text-[10px] text-snappy-fg/40 font-bold uppercase tracking-tighter mt-1">
                  Existing Asset
                </p>
              </div>
            </button>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs mt-3 font-bold uppercase tracking-widest text-primary animate-pulse">
              Processing...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
