'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createReview, updateReview } from '@/app/actions/reviews'
import { toast } from 'sonner'
import { Check, Clock, User } from 'lucide-react'
import { cn, getMediaUrl } from '@/lib/utils'
import { MediaUploader } from '../MediaUploader'
import Image from 'next/image'

export const ReviewModalForm = ({
  data: initialData = {},
  isNew,
  onSuccess,
}: {
  data?: any
  isNew: boolean
  onSuccess: () => void
}) => {
  const [data, setData] = useState({
    status: 'draft',
    clientName: '',
    projectName: '',
    slug: '',
    pin: '',
    ...initialData,
  })
  const [isSaving, setIsSaving] = useState(false)

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    setData({ ...data, pin })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (isNew) {
        await createReview(data)
        toast.success('Review slot created!')
      } else {
        await updateReview(data.id, data)
        toast.success('Review updated!')
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save review')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id="review-modal-form" onSubmit={handleSubmit} className="space-y-8 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="clientName"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Client Name
            </Label>
            <Input
              id="clientName"
              required
              value={data.clientName || ''}
              onChange={(e) => {
                const name = e.target.value
                const updates: any = { clientName: name }
                if (isNew && !data.slug) {
                  updates.slug = name
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                }
                setData({ ...data, ...updates })
              }}
              placeholder="e.g. John Doe"
              className="h-12 px-5 rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="projectName"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Project Name
            </Label>
            <Input
              id="projectName"
              required
              value={data.projectName || ''}
              onChange={(e) => setData({ ...data, projectName: e.target.value })}
              placeholder="e.g. Modern Web Redesign"
              className="h-12 px-5 rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Unique Link Slug
            </Label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-snappy-fg/30 text-xs font-medium">
                /rate/
              </span>
              <Input
                id="slug"
                required
                value={data.slug || ''}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
                placeholder="test-client"
                className="h-12 pl-16 pr-5 rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50 mt-1"
              />
            </div>
            <p className="text-[10px] text-snappy-fg/40 px-2 italic">
              This creates the URL where the client will leave their feedback.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Label
              htmlFor="pin"
              className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1"
            >
              Verification PIN
            </Label>
            <div className="flex gap-2">
              <Input
                id="pin"
                required
                value={data.pin || ''}
                onChange={(e) => setData({ ...data, pin: e.target.value })}
                placeholder="e.g. 1234"
                className="h-12 px-5 rounded-2xl bg-snappy-card/30 border-2 border-snappy-border focus:border-primary/50 font-mono text-lg tracking-[0.5em]"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generatePin}
                className="h-12 px-4 rounded-2xl border-2 border-snappy-border bg-snappy-card/30 hover:bg-snappy-card"
              >
                Auto-gen
              </Button>
            </div>
            <p className="text-[10px] text-snappy-fg/30 px-2">
              The client must enter this code to submit their review.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {!isNew && (
            <>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60 ml-1">
                  Audit & Approval
                </Label>
                <div className="flex gap-3">
                  {[
                    { label: 'Not Approved', value: 'draft', icon: Clock, color: 'text-warning' },
                    { label: 'Approved', value: 'published', icon: Check, color: 'text-success' },
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setData({ ...data, status: status.value })}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border-2 transition-all group',
                        data.status === status.value
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5'
                          : 'border-snappy-border bg-snappy-card/30 hover:border-primary/30',
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                          data.status === status.value ? 'bg-primary/20' : 'bg-snappy-card',
                        )}
                      >
                        <status.icon
                          className={cn(
                            'w-5 h-5',
                            data.status === status.value ? status.color : 'text-snappy-fg/30',
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          data.status === status.value ? 'text-snappy-fg' : 'text-snappy-fg/40',
                        )}
                      >
                        {status.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-snappy-card/30 border-2 border-snappy-border border-dashed space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-snappy-fg/60">
                  Rating Stats
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-snappy-border overflow-hidden relative shadow-sm shrink-0">
                    {data.avatar ? (
                      <Image
                        src={
                          typeof data.avatar === 'object'
                            ? data.avatar.url
                            : getMediaUrl(data.avatar)
                        }
                        alt={data.clientName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <User className="w-6 h-6 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-background border border-snappy-border">
                    <span className="text-2xl font-black text-primary">{data.rating || '—'}</span>
                    <span className="text-[10px] text-snappy-fg/40 font-bold ml-1 uppercase">
                      stars
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-snappy-fg/60 line-clamp-3 italic">
                      {data.comment || 'No feedback submitted yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isNew && (
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border-2 border-primary/20 border-dashed flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[18.75rem]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary/60" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-snappy-fg">Ready for Feedback</h4>
                <p className="text-sm text-snappy-fg/50 max-w-[240px]">
                  Setting up this slot will create a private link and PIN for{' '}
                  {data.clientName || 'the client'}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
