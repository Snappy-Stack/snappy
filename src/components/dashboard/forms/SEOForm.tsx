'use client'

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { updateSiteSettings } from '@/app/actions/settings'
import { MediaUploader } from '../MediaUploader'
import {
  Search,
  BarChart2,
  Globe,
  Share2,
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  EyeOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PreviewTab = 'google' | 'social'

// ─── Health Score ─────────────────────────────────────────────────────────────
function useSEOScore(data: any) {
  return useMemo(() => {
    const checks = [
      {
        label: 'Meta title',
        ok: data.defaultMetaTitle?.length >= 10 && data.defaultMetaTitle?.length <= 60,
        warn:
          !!data.defaultMetaTitle &&
          (data.defaultMetaTitle.length < 10 || data.defaultMetaTitle.length > 60),
        desc: '10–60 characters',
      },
      {
        label: 'Meta description',
        ok: data.defaultMetaDescription?.length >= 50 && data.defaultMetaDescription?.length <= 160,
        warn:
          !!data.defaultMetaDescription &&
          (data.defaultMetaDescription.length < 50 || data.defaultMetaDescription.length > 160),
        desc: '50–160 characters',
      },
      {
        label: 'OG / Social image',
        ok: !!data.ogImage,
        warn: false,
        desc: 'Improves social sharing',
      },
      {
        label: 'Analytics connected',
        ok: !!data.googleAnalyticsId,
        warn: false,
        desc: 'Google Analytics ID set',
      },
      {
        label: 'Site is indexable',
        ok: !data.robotsNoIndex,
        warn: data.robotsNoIndex,
        desc: 'Not blocked by robots',
      },
    ]
    const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
    return { checks, score }
  }, [data])
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive'
  const bg = score >= 80 ? 'bg-success/10' : score >= 50 ? 'bg-warning/10' : 'bg-destructive/10'
  const label = score >= 80 ? 'Great' : score >= 50 ? 'Needs Work' : 'Poor'

  return (
    <div
      className={cn('flex items-center justify-center w-20 h-20 rounded-full flex-shrink-0', bg)}
    >
      <div className="text-center">
        <div className={cn('text-2xl font-bold tabular-nums leading-none', color)}>{score}</div>
        <div className={cn('text-[9px] font-bold uppercase tracking-wide mt-0.5', color)}>
          {label}
        </div>
      </div>
    </div>
  )
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export const SEOForm = ({ data: initialData, onSuccess }: { data: any; onSuccess: () => void }) => {
  const [data, setData] = useState(initialData || {})
  const [isSaving, setIsSaving] = useState(false)
  const [previewTab, setPreviewTab] = useState<PreviewTab>('google')

  const set = (key: string, value: any) => setData((d: any) => ({ ...d, [key]: value }))
  const { checks, score } = useSEOScore(data)

  const ogImageUrl = typeof data.ogImage === 'object' && data.ogImage?.url ? data.ogImage.url : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const result = await updateSiteSettings({ seo: data })
      if (result.success) {
        toast.success('SEO settings saved!')
        onSuccess()
      }
    } catch {
      toast.error('Failed to save SEO settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form id="seo-form" onSubmit={handleSubmit} className="space-y-8 py-2">
      {/* ── Health Score ── */}
      <div className="p-5 rounded-2xl bg-snappy-card border border-snappy-border space-y-4">
        <div className="flex items-center gap-5">
          <ScoreRing score={score} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-3">SEO Health Score</p>
            <div className="space-y-1.5">
              {checks.map(({ label, ok, warn, desc }) => {
                const Icon = ok ? CheckCircle2 : warn ? AlertTriangle : CircleDashed
                return (
                  <div key={label} className="flex items-center gap-2">
                    <Icon
                      className={cn(
                        'w-3.5 h-3.5 flex-shrink-0',
                        ok ? 'text-success' : warn ? 'text-warning' : 'text-snappy-fg/20',
                      )}
                    />
                    <span className={cn('text-xs', ok ? 'text-snappy-fg/70' : 'text-snappy-fg/40')}>
                      {label}
                    </span>
                    {!ok && !warn && (
                      <span className="text-[10px] text-snappy-fg/30 ml-auto">{desc}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Preview Tabs ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 justify-between">
          <span className="text-sm font-bold uppercase tracking-widest text-snappy-fg/50">
            Preview
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-snappy-card border border-snappy-border">
            {[
              { id: 'google' as const, icon: Search, label: 'Google' },
              { id: 'social' as const, icon: Share2, label: 'Social' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPreviewTab(id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  previewTab === id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-snappy-fg/50 hover:text-snappy-fg',
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Google SERP Preview */}
        {previewTab === 'google' && (
          <div className="p-4 rounded-xl bg-snappy-card border border-snappy-border space-y-1 font-sans">
            <p className="text-[11px] text-snappy-fg/30 uppercase tracking-widest mb-2">
              Google Search Preview
            </p>
            <p className="text-base font-medium text-secondary leading-tight truncate">
              {data.defaultMetaTitle || 'Your Site Title'}
            </p>
            <p className="text-xs text-success">https://yoursite.com</p>
            <p className="text-xs text-snappy-fg/60 line-clamp-2 leading-relaxed">
              {data.defaultMetaDescription ||
                'No meta description set. Add one to improve click-through rate from search engines.'}
            </p>
          </div>
        )}

        {/* Social Card Preview */}
        {previewTab === 'social' && (
          <div className="rounded-xl border border-snappy-border overflow-hidden bg-snappy-card">
            {/* OG Image area */}
            <div className="relative w-full aspect-[1200/630] bg-snappy-bg flex items-center justify-center">
              {ogImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImageUrl} alt="OG preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-snappy-fg/20">
                  <Share2 className="w-10 h-10" />
                  <p className="text-xs font-medium">No social image uploaded</p>
                  <p className="text-[10px]">Recommended: 1200 × 630px</p>
                </div>
              )}
            </div>
            {/* Card metadata */}
            <div className="p-3 border-t border-snappy-border">
              <p className="text-[10px] text-snappy-fg/30 uppercase tracking-widest mb-1">
                yoursite.com
              </p>
              <p className="text-sm font-semibold leading-tight line-clamp-1">
                {data.defaultMetaTitle || 'Your Site Title'}
              </p>
              <p className="text-xs text-snappy-fg/50 line-clamp-2 mt-0.5 leading-relaxed">
                {data.defaultMetaDescription || 'Add a meta description to show it here.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-snappy-border" />

      {/* ── Meta Fields ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-widest text-snappy-fg/50">
            Search Metadata
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">
            Meta Title
            <span
              className={cn(
                'ml-2 text-xs font-normal',
                (data.defaultMetaTitle?.length || 0) > 60
                  ? 'text-destructive'
                  : (data.defaultMetaTitle?.length || 0) >= 10
                    ? 'text-success'
                    : 'text-snappy-fg/40',
              )}
            >
              {data.defaultMetaTitle?.length || 0}/60
            </span>
          </Label>
          <Input
            id="metaTitle"
            value={data.defaultMetaTitle || ''}
            onChange={(e) => set('defaultMetaTitle', e.target.value)}
            placeholder="Your Site Title"
            maxLength={80}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDesc">
            Meta Description
            <span
              className={cn(
                'ml-2 text-xs font-normal',
                (data.defaultMetaDescription?.length || 0) > 160
                  ? 'text-destructive'
                  : (data.defaultMetaDescription?.length || 0) >= 50
                    ? 'text-success'
                    : 'text-snappy-fg/40',
              )}
            >
              {data.defaultMetaDescription?.length || 0}/160
            </span>
          </Label>
          <Textarea
            id="metaDesc"
            value={data.defaultMetaDescription || ''}
            onChange={(e) => set('defaultMetaDescription', e.target.value)}
            placeholder="A short description of your site for search engines…"
            rows={3}
            maxLength={200}
          />
        </div>
      </div>

      <div className="h-px bg-snappy-border" />

      {/* ── OG Image ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-widest text-snappy-fg/50">
            Social Image
          </span>
        </div>
        <p className="text-xs text-snappy-fg/40 -mt-2">
          Shown when your site is shared on Twitter, LinkedIn, etc. Recommended: 1200×630px.
        </p>
        <MediaUploader
          label="OG Image"
          currentValue={data.ogImage}
          onUpload={(media: any) => set('ogImage', media || null)}
          category="other"
          aspectRatio="video"
        />
      </div>

      <div className="h-px bg-snappy-border" />

      {/* ── Analytics ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-widest text-snappy-fg/50">
            Analytics
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gaId">Google Analytics ID</Label>
          <Input
            id="gaId"
            value={data.googleAnalyticsId || ''}
            onChange={(e) => set('googleAnalyticsId', e.target.value)}
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-snappy-fg/40">Leave blank to disable tracking.</p>
        </div>
      </div>

      <div className="h-px bg-snappy-border" />

      {/* ── Robots Control ── */}
      <div
        onClick={() => set('robotsNoIndex', !data.robotsNoIndex)}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all select-none',
          data.robotsNoIndex
            ? 'bg-destructive/5 border-destructive/30 hover:bg-destructive/10'
            : 'bg-snappy-card border-snappy-border hover:border-primary/20',
        )}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            data.robotsNoIndex ? 'bg-destructive/10' : 'bg-snappy-card',
          )}
        >
          {data.robotsNoIndex ? (
            <EyeOff className="w-5 h-5 text-destructive" />
          ) : (
            <Globe className="w-5 h-5 text-success" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            {data.robotsNoIndex ? 'Search engines blocked' : 'Visible to search engines'}
          </div>
          <div className="text-xs text-snappy-fg/50">
            {data.robotsNoIndex
              ? 'noindex is active — search engines will not index your site'
              : 'Click to add noindex (hide from search results)'}
          </div>
        </div>
        {/* Toggle pill */}
        <div
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
            data.robotsNoIndex ? 'bg-destructive' : 'bg-snappy-border',
          )}
        >
          <div
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm',
              data.robotsNoIndex ? 'left-6' : 'left-1',
            )}
          />
        </div>
      </div>
    </form>
  )
}
