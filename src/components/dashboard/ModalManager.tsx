'use client'

import React from 'react'
import { useModals, ModalType } from '@/providers/ModalProvider'
import { ContentBrowser } from './ContentBrowser'
import { ProfileForm } from './forms/ProfileForm'
import { BrandingForm } from './forms/BrandingForm'
import { ProjectModalForm } from './forms/ProjectModalForm'
import { PostModalForm } from './forms/PostModalForm'
import { ReviewModalForm } from './forms/ReviewModalForm'
import { SEOForm } from './forms/SEOForm'
import { AboutStoryForm } from './forms/AboutStoryForm'
import { MediaPicker } from './MediaPicker'
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ModalManagerProps {
  initialData: any
  handleDeleteProject: (id: string | number) => void
  handleDeletePost: (id: string | number) => void
  handleDeleteReview: (id: string | number) => void
  handleSuccess: () => void
  isDeleting: string | null
}

import { Dialog, DialogContent } from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

export const ModalManager: React.FC<ModalManagerProps> = ({
  initialData,
  handleDeleteProject,
  handleDeletePost,
  handleDeleteReview,
  handleSuccess,
  isDeleting,
}) => {
  const { activeModal, stack, push, pop, closeAll } = useModals()

  return (
    <Dialog open={!!activeModal} onOpenChange={(details) => !details.open && pop()}>
      <DialogContent className="w-[95vw] md:w-[90vw] xl:max-w-6xl p-0 border-none bg-background rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500">
        <div className="max-h-[95vh] flex flex-col">
          {stack.map((modal, index) => {
            const isTop = index === stack.length - 1
            const mId = modal.id
            const mData = modal.data
            const isBrowseModal = mId.startsWith('browse-')

            const getFormId = () => {
              if (mId === 'profile') return 'profile-form'
              if (mId === 'branding') return 'branding-form'
              if (mId === 'seo') return 'seo-form'
              if (mId === 'project-new' || mId === 'project-edit') return 'project-modal-form'
              if (mId === 'post-new' || mId === 'post-edit') return 'post-modal-form'
              if (mId === 'review-new' || mId === 'review-edit') return 'review-modal-form'
              if (mId === 'about-story') return 'story-form'
              return undefined
            }

            return (
              <div
                key={`${mId}-${index}`}
                className={cn('flex flex-col w-full h-full max-h-[95vh]', !isTop && 'hidden')}
              >
                {isBrowseModal ? (
                  <ContentBrowser
                    type={
                      mId === 'browse-projects'
                        ? 'projects'
                        : mId === 'browse-articles'
                          ? 'articles'
                          : 'reviews'
                    }
                    items={
                      mId === 'browse-projects'
                        ? initialData.projects
                        : mId === 'browse-articles'
                          ? initialData.posts
                          : initialData.reviews
                    }
                    isDeleting={isDeleting}
                    onAdd={() => {
                      push(
                        mId === 'browse-projects'
                          ? 'project-new'
                          : mId === 'browse-articles'
                            ? 'post-new'
                            : 'review-new',
                      )
                    }}
                    onEdit={(item) => {
                      push(
                        mId === 'browse-projects'
                          ? 'project-edit'
                          : mId === 'browse-articles'
                            ? 'post-edit'
                            : 'review-edit',
                        item,
                      )
                    }}
                    onDelete={
                      mId === 'browse-projects'
                        ? handleDeleteProject
                        : mId === 'browse-articles'
                          ? handleDeletePost
                          : handleDeleteReview
                    }
                    onClose={pop}
                  />
                ) : mId === 'media-picker' ? (
                  <>
                    <DialogHeader className="px-8 pt-8 pb-4">
                      <DialogTitle className="text-xl font-bold">Media Library</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden h-[75vh]">
                      <MediaPicker
                        onSelect={(media) => {
                          if (mData?.onSelect) {
                            mData.onSelect(media)
                          }
                        }}
                        onClose={pop}
                        initialCategory={mData?.category || 'all'}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <DialogHeader className="px-8 pt-8 pb-4 flex-shrink-0">
                      <DialogTitle className="text-2xl font-bold">
                        {mId === 'profile' && 'Edit Profile Info'}
                        {mId === 'branding' && 'Visual Branding'}
                        {mId === 'seo' && 'SEO & Meta'}
                        {mId === 'project-new' && 'Add New Project'}
                        {mId === 'project-edit' && `Edit Project: ${mData?.title}`}
                        {mId === 'post-new' && 'Draft New Article'}
                        {mId === 'post-edit' && `Edit Article: ${mData?.title}`}
                        {mId === 'review-new' && 'Create Review Slot'}
                        {mId === 'review-edit' && `Manage Review: ${mData?.clientName}`}
                        {mId === 'about-story' && 'Career Story & Timeline'}
                      </DialogTitle>
                      <DialogDescription className="text-snappy-fg/50 font-medium">
                        {mId === 'profile' && 'Change your name, bio, and social settings.'}
                        {mId === 'branding' && 'Customize colors, logos, and site appearance.'}
                        {mId === 'seo' &&
                          'Control how your site appears in search engines and on social media.'}
                        {mId === 'about-story' &&
                          'Manage your professional chapters and milestones.'}
                        {(mId?.startsWith('project') ||
                          mId?.startsWith('post') ||
                          mId?.startsWith('review')) &&
                          'Fill in the details below to update your content.'}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="px-8 pb-8 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex-1 overscroll-contain">
                      {mId === 'profile' && (
                        <ProfileForm data={initialData.profile} onSuccess={handleSuccess} />
                      )}
                      {mId === 'branding' && (
                        <BrandingForm
                          data={initialData.branding}
                          profile={initialData.profile}
                          onSuccess={handleSuccess}
                        />
                      )}
                      {mId === 'seo' && (
                        <SEOForm data={initialData.seo} onSuccess={handleSuccess} />
                      )}
                      {mId === 'project-new' && (
                        <ProjectModalForm isNew={true} onSuccess={handleSuccess} />
                      )}
                      {mId === 'project-edit' && (
                        <ProjectModalForm data={mData} isNew={false} onSuccess={handleSuccess} />
                      )}
                      {mId === 'post-new' && (
                        <PostModalForm isNew={true} onSuccess={handleSuccess} />
                      )}
                      {mId === 'post-edit' && (
                        <PostModalForm data={mData} isNew={false} onSuccess={handleSuccess} />
                      )}
                      {mId === 'review-new' && (
                        <ReviewModalForm isNew={true} onSuccess={handleSuccess} />
                      )}
                      {mId === 'review-edit' && (
                        <ReviewModalForm data={mData} isNew={false} onSuccess={handleSuccess} />
                      )}
                      {mId === 'about-story' && (
                        <AboutStoryForm data={initialData.story} onSuccess={handleSuccess} />
                      )}
                    </div>

                    <DialogFooter className="bg-snappy-card/50 px-8 py-5 border-t border-snappy-border flex items-center justify-end gap-3 flex-shrink-0">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={pop}
                        className="h-12 px-8 rounded-xl font-bold"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        form={getFormId()}
                        className="h-12 px-12 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
