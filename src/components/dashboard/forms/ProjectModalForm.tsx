'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createProject, updateProject } from '@/app/actions/projects'
import { toast } from 'sonner'
import { MediaUploader } from '../MediaUploader'
import { LexicalEditor } from '../LexicalEditor'

export const ProjectModalForm = ({
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
        await createProject(data)
        toast.success('Project created!')
      } else {
        await updateProject(data.id, data)
        toast.success('Project updated!')
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id="project-modal-form" onSubmit={handleSubmit} className="space-y-8 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: General Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Project Title
            </Label>
            <Input
              id="title"
              required
              value={data.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="e.g. Modern Portfolio"
              className="h-12 px-5 rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
              >
                Category
              </Label>
              <Input
                id="category"
                value={data.category || ''}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                placeholder="e.g. Web Design"
                className="h-11 rounded-xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="link"
                className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
              >
                Project URL
              </Label>
              <Input
                id="link"
                value={data.link || ''}
                onChange={(e) => setData({ ...data, link: e.target.value })}
                placeholder="https://..."
                className="h-11 rounded-xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1">
              Full Description
            </Label>
            <LexicalEditor
              placeholder="Details about the project, tools used, and results..."
              initialValue={data.description}
              onChange={(description) => setData({ ...data, description })}
            />
          </div>
        </div>

        {/* Right Side: Media & Summary */}
        <div className="lg:col-span-5 space-y-8">
          <MediaUploader
            label="Main Project Image"
            currentValue={data.featuredImage}
            category="project"
            onUpload={(media) => setData({ ...data, featuredImage: media })}
          />

          <div className="space-y-2">
            <Label
              htmlFor="summary"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Short Summary
            </Label>
            <Textarea
              id="summary"
              value={data.descriptionShort || ''}
              onChange={(e) => setData({ ...data, descriptionShort: e.target.value })}
              placeholder="Brief overview for the card..."
              className="resize-none rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
              rows={4}
            />
            <p className="text-[10px] text-snappy-fg/40 font-medium px-2 italic">
              Displayed on the portfolio grid.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
