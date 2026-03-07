'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ModalType =
  | 'profile'
  | 'branding'
  | 'seo'
  | 'project-new'
  | 'project-edit'
  | 'post-new'
  | 'post-edit'
  | 'review-new'
  | 'review-edit'
  | 'browse-projects'
  | 'browse-articles'
  | 'browse-reviews'
  | 'browse-processes'
  | 'media-picker'
  | 'about-story'
  | 'confirmation'
  | 'crop'
  | 'process-new'
  | 'process-edit'

export interface ConfirmationData {
  title: string
  description: string
  confirmText?: string
  isDestructive?: boolean
  onConfirm: () => void
}

export interface CropData {
  imageUrl: string
  aspectRatio: number
  onCrop: (croppedBlob: Blob) => void
}

export interface ModalState {
  id: ModalType
  data?: any
}

interface ModalContextType {
  activeModal: ModalType | null
  selectedItem: any
  stack: ModalState[]
  push: (id: ModalType, data?: any) => void
  pop: () => void
  closeAll: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({
  children,
  components = {} as any,
}: {
  children: ReactNode
  components?: Record<ModalType, React.ComponentType<any>>
}) => {
  const [stack, setStack] = useState<ModalState[]>([])

  const active = stack.length > 0 ? stack[stack.length - 1] : null
  const activeModal = active?.id || null
  const selectedItem = active?.data || null

  const push = useCallback((id: ModalType, data?: any) => {
    setStack((prev) => [...prev, { id, data }])
  }, [])

  const pop = useCallback(() => {
    setStack((prev) => prev.slice(0, -1))
  }, [])

  const closeAll = useCallback(() => {
    setStack([])
  }, [])

  const ActiveComponent = activeModal && components ? components[activeModal] : null

  return (
    <ModalContext.Provider value={{ activeModal, selectedItem, stack, push, pop, closeAll }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModals = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider')
  }
  return context
}
