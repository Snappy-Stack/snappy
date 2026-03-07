import React from 'react'
import { Briefcase, FileText, Plus, ArrowRight, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsSectionProps {
  projectCount: number
  postCount: number
  onOpenStory: () => void
  onBrowseProjects: () => void
  onBrowseArticles: () => void
  onBrowseReviews: () => void
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  projectCount,
  postCount,
  onOpenStory,
  onBrowseProjects,
  onBrowseArticles,
  onBrowseReviews,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Projects stat card — clickable */}
      <button
        onClick={onBrowseProjects}
        className={cn(
          'p-6 rounded-2xl bg-snappy-card border border-snappy-border flex flex-col justify-between text-left',
          'group hover:border-primary/30 hover:bg-snappy-card/80 transition-all duration-200 cursor-pointer',
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <Briefcase className="w-6 h-6 text-primary" />
          <ArrowRight className="w-4 h-4 text-snappy-fg/20 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
        <div>
          <div className="text-3xl font-bold tabular-nums">{projectCount}</div>
          <div className="text-xs font-semibold text-snappy-fg/50 uppercase tracking-wider mt-0.5">
            Projects
          </div>
        </div>
      </button>

      {/* Articles stat card — clickable */}
      <button
        onClick={onBrowseArticles}
        className={cn(
          'p-6 rounded-2xl bg-snappy-card border border-snappy-border flex flex-col justify-between text-left',
          'group hover:border-primary/30 hover:bg-snappy-card/80 transition-all duration-200 cursor-pointer',
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <FileText className="w-6 h-6 text-primary" />
          <ArrowRight className="w-4 h-4 text-snappy-fg/20 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
        <div>
          <div className="text-3xl font-bold tabular-nums">{postCount}</div>
          <div className="text-xs font-semibold text-snappy-fg/50 uppercase tracking-wider mt-0.5">
            Articles
          </div>
        </div>
      </button>

      {/* New Post CTA */}
      <div className="col-span-2 grid grid-cols-1 gap-2">
        <div
          onClick={onOpenStory}
          className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold">Story & Timeline</div>
              <div className="text-xs text-primary/70">Manage your career chapters</div>
            </div>
          </div>
          <div className="p-2 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
            <Plus className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          onClick={onBrowseReviews}
          className="p-4 rounded-xl bg-snappy-card border border-snappy-border flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xs font-bold">Client Reviews</div>
              <div className="text-[10px] text-snappy-fg/40">Manage your mentions</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-snappy-fg/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  )
}
