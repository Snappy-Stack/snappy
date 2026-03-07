import React from 'react'
import { FileText, Plus, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/lib/utils'

interface PostsSectionProps {
  posts: any[]
  isDeleting: string | null
  onAdd: () => void
  onEdit: (post: any) => void
  onDelete: (id: string | number) => void
}

export const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  isDeleting,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Blog Posts</h3>
        </div>
        <Button onClick={onAdd} size="sm" variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Button>
      </div>
      <div className="space-y-3">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 bg-snappy-card border border-snappy-border rounded-xl hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-background border border-snappy-border overflow-hidden flex-shrink-0 relative">
                {post.featuredImage ? (
                  <img
                    src={getMediaUrl(post.featuredImage) || ''}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-snappy-fg/10">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                {isDeleting === `post-${post.id}` && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-snappy-fg/40">
                  {new Date(post.createdAt || post.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button onClick={() => onEdit(post)} variant="ghost" size="icon" className="h-8 w-8">
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-snappy-fg/30 hover:text-destructive"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
