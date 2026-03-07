'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createPost, updatePost } from '@/app/actions/posts'
import { toast } from 'sonner'
import { MediaUploader } from '../MediaUploader'
import { LexicalEditor } from '../LexicalEditor'

export const PostModalForm = ({
  data: initialData = {},
  isNew,
  onSuccess,
}: {
  data?: any
  isNew: boolean
  onSuccess: () => void
}) => {
  const [data, setData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (isNew) {
        await createPost(data)
        toast.success('Post created!')
      } else {
        await updatePost(data.id, data)
        toast.success('Post updated!')
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id="post-modal-form" onSubmit={handleSubmit} className="space-y-8 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Article Title
            </Label>
            <Input
              id="title"
              required
              value={data.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Enter a compelling title..."
              className="h-14 px-6 text-lg font-bold rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1">
              Content
            </Label>
            <LexicalEditor
              placeholder="Tell your story..."
              initialValue={data.content}
              onChange={(content) => setData({ ...data, content })}
            />
          </div>
        </div>

        {/* Sidebar / Metadata */}
        <div className="lg:col-span-4 space-y-8">
          <MediaUploader
            label="Featured Image"
            currentValue={data.featuredImage}
            category="post"
            onUpload={(media) => setData({ ...data, featuredImage: media })}
          />

          <div className="space-y-2">
            <Label
              htmlFor="excerpt"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Summary / Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={data.excerpt || ''}
              onChange={(e) => setData({ ...data, excerpt: e.target.value })}
              placeholder="Short summary for the index..."
              className="resize-none rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
              rows={5}
            />
            <p className="text-[10px] text-snappy-fg/40 font-medium px-2">
              Used for SEO and list previews.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
