'use client'

import React, { useState } from 'react'
import { updateStory } from '@/app/actions/story'
import { toast } from 'sonner'
import { MediaUploader } from '../MediaUploader'
import { Plus, Trash2, GripVertical, Calendar, Type, AlignLeft, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const AboutStoryForm = ({
  data: initialData,
  onSuccess,
}: {
  data: any
  onSuccess: () => void
}) => {
  const [data, setData] = useState(initialData || { chapters: [] })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const result = await updateStory(data)
      if (result.success) {
        toast.success('Story updated!')
        onSuccess()
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update story')
    } finally {
      setIsSaving(false)
    }
  }

  const addChapter = () => {
    setData({
      ...data,
      chapters: [
        ...(data.chapters || []),
        {
          year: new Date().getFullYear().toString(),
          label: 'New Chapter',
          headline: '',
          body: '',
          dark: false,
          layoutStyle: 'focused',
          milestoneIcon: '',
        },
      ],
    })
  }

  const removeChapter = (index: number) => {
    const newChapters = [...data.chapters]
    newChapters.splice(index, 1)
    setData({ ...data, chapters: newChapters })
  }

  const updateChapter = (index: number, fields: any) => {
    const newChapters = [...data.chapters]
    newChapters[index] = { ...newChapters[index], ...fields }
    setData({ ...data, chapters: newChapters })
  }

  return (
    <form id="story-form" onSubmit={handleSubmit} className="space-y-8 py-4">
      <div className="space-y-6">
        {data.chapters?.map((chapter: any, index: number) => (
          <div
            key={index}
            className="group relative p-6 rounded-[2rem] bg-snappy-card/30 border-2 border-snappy-border hover:border-primary/20 transition-all shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-snappy-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-xs font-black">{index + 1}</span>
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest text-snappy-fg/80">
                  Chapter Details
                </h4>
              </div>
              <button
                type="button"
                onClick={() => removeChapter(index)}
                className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Year & Label */}
              <div className="md:col-span-3 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 px-1">
                    Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/40" />
                    <input
                      type="text"
                      value={chapter.year}
                      onChange={(e) => updateChapter(index, { year: e.target.value })}
                      placeholder="2024"
                      className="w-full h-11 pl-10 pr-4 bg-background border border-snappy-border rounded-xl focus:outline-none focus:border-primary/50 font-bold text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 px-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={chapter.label}
                    onChange={(e) => updateChapter(index, { label: e.target.value })}
                    placeholder="The Beginning"
                    className="w-full h-11 px-4 bg-background border border-snappy-border rounded-xl focus:outline-none focus:border-primary/50 font-bold text-xs"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-snappy-border/30">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 px-1">
                      Layout Style
                    </label>
                    <select
                      value={chapter.layoutStyle || 'focused'}
                      onChange={(e) => updateChapter(index, { layoutStyle: e.target.value })}
                      className="w-full h-11 px-4 bg-background border border-snappy-border rounded-xl focus:outline-none focus:border-primary/50 font-bold text-xs appearance-none"
                    >
                      <option value="focused">Focused (Center)</option>
                      <option value="side">Side-by-Side</option>
                      <option value="cinematic">Cinematic (Wide)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 px-1">
                      Milestone Icon
                    </label>
                    <input
                      type="text"
                      value={chapter.milestoneIcon || ''}
                      onChange={(e) => updateChapter(index, { milestoneIcon: e.target.value })}
                      placeholder="Sparkles, Trophy, Rocket..."
                      className="w-full h-11 px-4 bg-background border border-snappy-border rounded-xl focus:outline-none focus:border-primary/50 font-bold text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => updateChapter(index, { dark: !chapter.dark })}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300',
                      chapter.dark
                        ? 'bg-snappy-fg text-background border-snappy-fg'
                        : 'bg-background text-snappy-fg/60 border-snappy-border hover:border-snappy-fg/20',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {chapter.dark ? (
                        <Moon className="w-3.5 h-3.5" />
                      ) : (
                        <Sun className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Dark Mode
                      </span>
                    </div>
                    <div
                      className={cn(
                        'w-8 h-4 rounded-full p-0.5 transition-colors',
                        chapter.dark ? 'bg-primary' : 'bg-snappy-fg/10',
                      )}
                    >
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full bg-white transition-transform',
                          chapter.dark ? 'translate-x-4' : 'translate-x-0',
                        )}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Headline & Body */}
              <div className="md:col-span-9 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 px-1">
                    Headline
                  </label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/40" />
                    <input
                      type="text"
                      value={chapter.headline}
                      onChange={(e) => updateChapter(index, { headline: e.target.value })}
                      placeholder="Where it all started..."
                      className="w-full h-11 pl-10 pr-4 bg-background border border-snappy-border rounded-xl focus:outline-none focus:border-primary/50 font-bold text-sm tracking-tight"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-snappy-fg/40 px-1">
                    Story Body
                  </label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-4 w-3.5 h-3.5 text-primary/40" />
                    <textarea
                      value={chapter.body}
                      onChange={(e) => updateChapter(index, { body: e.target.value })}
                      rows={4}
                      placeholder="Detailed narrative for this chapter..."
                      className="w-full pl-10 pr-4 py-3 bg-background border border-snappy-border rounded-2xl focus:outline-none focus:border-primary/50 font-medium text-xs leading-relaxed resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!data.chapters || data.chapters.length === 0) && (
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-snappy-border rounded-[3rem] bg-snappy-card/5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <p className="font-black text-xs uppercase tracking-widest text-snappy-fg/40">
              No Chapters Yet
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={addChapter}
              className="mt-6 rounded-xl font-bold bg-white text-black border-none shadow-xl hover:scale-105 transition-all"
            >
              Start Your Story
            </Button>
          </div>
        )}

        {data.chapters?.length > 0 && (
          <button
            type="button"
            onClick={addChapter}
            className="w-full py-4 rounded-[1.5rem] border-2 border-dashed border-snappy-border hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-snappy-fg/60 group-hover:text-primary transition-colors">
              Add New Chapter
            </span>
          </button>
        )}
      </div>
    </form>
  )
}
