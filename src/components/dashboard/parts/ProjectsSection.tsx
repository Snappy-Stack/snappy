import React from 'react'
import { Briefcase, Plus, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/lib/utils'

interface ProjectsSectionProps {
  projects: any[]
  isDeleting: string | null
  onAdd: () => void
  onEdit: (project: any) => void
  onDelete: (id: string | number) => void
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isDeleting,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Projects</h3>
        </div>
        <Button onClick={onAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project: any) => (
          <div
            key={project.id}
            className="group p-4 bg-snappy-card border border-snappy-border rounded-2xl hover:border-primary/50 transition-all"
          >
            <div className="aspect-video rounded-xl overflow-hidden bg-background mb-4 border border-snappy-border relative">
              {project.featuredImage ? (
                <img
                  src={getMediaUrl(project.featuredImage) || ''}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              {isDeleting === `project-${project.id}` && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">
                    Deleting...
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1 mb-4">
              <h4 className="font-bold text-sm truncate">{project.title}</h4>
              <p className="text-xs text-snappy-fg/50 truncate uppercase tracking-widest">
                {project.category || 'Portfolio'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onEdit(project)}
                variant="outline"
                size="sm"
                className="flex-1 text-xs py-0 h-8"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-snappy-fg/40 hover:text-destructive hover:border-destructive/30"
                onClick={() => onDelete(project.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
