'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediaUploader } from './MediaUploader'
import { ProfileForm } from './forms/ProfileForm'
import { BrandingForm } from './forms/BrandingForm'
import { ProjectModalForm } from './forms/ProjectModalForm'
import { PostModalForm } from './forms/PostModalForm'
import { ReviewModalForm } from './forms/ReviewModalForm'
import { SEOForm } from './forms/SEOForm'
import { deleteProject } from '@/app/actions/projects'
import { deletePost } from '@/app/actions/posts'
import { deleteReview } from '@/app/actions/reviews'
import { toast } from 'sonner'

// Note: We'll re-import form components here once they are recreated
// For now we'll define the Hub structure

import { HubHero } from './parts/HubHero'
import { IdentitySection } from './parts/IdentitySection'
import { StatsSection } from './parts/StatsSection'
import { ContentBrowser } from './ContentBrowser'

import { useRouter } from 'next/navigation'

import { useModals } from '@/providers/ModalProvider'
import { ModalManager } from './ModalManager'

interface HubProps {
  initialData: {
    profile: any
    branding: any
    seo: any
    projects: any[]
    posts: any[]
    reviews: any[]
    story: any
  }
}

export const ControlHub: React.FC<HubProps> = ({ initialData }) => {
  const router = useRouter()
  const { activeModal, push, pop } = useModals()
  const [mounted, setMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSuccess = () => {
    router.refresh()
    pop()
  }

  const handleDeleteProject = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setIsDeleting(`project-${id}`)
    try {
      const result = await deleteProject(id as string)
      if (result.success) {
        toast.success('Project deleted')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDeletePost = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    setIsDeleting(`post-${id}`)
    try {
      const result = await deletePost(id as string)
      if (result.success) {
        toast.success('Article deleted')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDeleteReview = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    setIsDeleting(`review-${id}`)
    try {
      const result = await deleteReview(id as string)
      if (result.success) {
        toast.success('Review deleted')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-12">
      <HubHero profile={initialData.profile} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IdentitySection
          profile={initialData.profile}
          onOpenProfile={() => push('profile')}
          onOpenBranding={() => push('branding')}
          onOpenSEO={() => push('seo')}
        />

        <div className="space-y-8 flex flex-col">
          <StatsSection
            projectCount={initialData.projects.length}
            postCount={initialData.posts.length}
            onOpenStory={() => push('about-story')}
            onBrowseProjects={() => push('browse-projects')}
            onBrowseArticles={() => push('browse-articles')}
            onBrowseReviews={() => push('browse-reviews')}
          />
        </div>
      </div>

      <ModalManager
        initialData={initialData}
        handleDeleteProject={handleDeleteProject}
        handleDeletePost={handleDeletePost}
        handleDeleteReview={handleDeleteReview}
        handleSuccess={handleSuccess}
        isDeleting={isDeleting}
      />
    </div>
  )
}
