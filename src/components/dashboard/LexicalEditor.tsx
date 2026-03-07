'use client'

import React, { useCallback, useEffect } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { CodeNode } from '@lexical/code'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getRoot,
  $getSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Heading1,
  Heading2,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// SNAPPY Premium Theme for Lexical
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder:
    'text-snappy-fg/30 absolute top-4 left-4 pointer-events-none select-none italic text-sm',
  paragraph: 'mb-4 leading-relaxed text-snappy-fg/80 last:mb-0',
  quote: 'border-l-4 border-primary/30 pl-4 py-1 italic bg-primary/5 rounded-r-lg my-4',
  heading: {
    h1: 'text-3xl font-black tracking-tighter mb-6 text-foreground bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400',
    h2: 'text-2xl font-extrabold tracking-tight mb-4 text-foreground/90',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal ml-6 space-y-2 mb-4',
    ul: 'list-disc ml-6 space-y-2 mb-4',
    listitem: 'pl-2',
  },
  text: {
    bold: 'font-black text-foreground',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
}

const Toolbar = () => {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = React.useState(false)
  const [isItalic, setIsItalic] = React.useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    // Simple state tracking for basic buttons
    // In a full implementation, we would use more robust selection checks
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      1,
    )
  }, [editor, updateToolbar])

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')

  const formatHeading = (tag: 'h1' | 'h2') => {
    editor.update(() => {
      const selection = $getSelection()
      if (selection) {
        $setBlocksType(selection, () => $createHeadingNode(tag))
      }
    })
  }

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  }

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if (selection) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }

  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined)
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined)

  return (
    <div className="flex items-center gap-1 p-2 border-b border-snappy-border bg-snappy-card/30 backdrop-blur-sm sticky top-0 z-10 overflow-x-auto no-scrollbar">
      <ToolbarButton onClick={formatBold} icon={Bold} label="Bold" />
      <ToolbarButton onClick={formatItalic} icon={Italic} label="Italic" />
      <div className="w-px h-4 bg-snappy-border mx-1" />
      <ToolbarButton onClick={formatBulletList} icon={List} label="Bullet List" />
      <ToolbarButton onClick={formatNumberedList} icon={ListOrdered} label="Numbered List" />
      <div className="w-px h-4 bg-snappy-border mx-1" />
      <ToolbarButton onClick={() => formatHeading('h1')} icon={Heading1} label="H1" />
      <ToolbarButton onClick={() => formatHeading('h2')} icon={Heading2} label="H2" />
      <ToolbarButton onClick={formatQuote} icon={Quote} label="Quote" />
      <div className="w-px h-4 bg-snappy-border mx-1" />
      <ToolbarButton onClick={undo} icon={RotateCcw} label="Undo" />
      <ToolbarButton onClick={redo} icon={RotateCw} label="Redo" />
    </div>
  )
}

const ToolbarButton = ({ onClick, icon: Icon, label, active }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'p-2 rounded-lg hover:bg-primary/10 transition-all flex items-center justify-center group relative',
      active ? 'bg-primary/20 text-primary' : 'text-snappy-fg/60 hover:text-primary',
    )}
    title={label}
  >
    <Icon className="w-4 h-4" />
    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-snappy-fg text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
      {label}
    </span>
  </button>
)

export const LexicalEditor = ({
  initialValue,
  onChange,
  placeholder = 'Start typing something amazing...',
}: {
  initialValue?: any
  onChange: (content: string) => void
  placeholder?: string
}) => {
  const initialConfig = {
    namespace: 'SnappyEditor',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode],
    editorState: initialValue
      ? typeof initialValue === 'string'
        ? initialValue
        : JSON.stringify(initialValue)
      : undefined,
  }

  return (
    <div className="relative border-2 border-snappy-border rounded-2xl bg-snappy-card/20 focus-within:border-primary/40 transition-all overflow-hidden min-h-[18.75rem] flex flex-col group">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="flex-1 relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none py-4 px-6 min-h-[15.625rem] cursor-text prose prose-invert prose-snappy max-w-none" />
            }
            placeholder={<div className={theme.placeholder}>{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const json = editorState.toJSON()
                onChange(json as any)
              })
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  )
}
