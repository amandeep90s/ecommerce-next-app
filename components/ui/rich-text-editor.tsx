'use client';

import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Separator } from './separator';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-8', isActive && 'bg-muted text-foreground')}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Start typing…',
      }),
    ],
    content: value ?? '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Treat empty doc as empty string
      const isEmpty = editor.isEmpty;
      onChange?.(isEmpty ? '' : html);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[160px] px-3 py-2 focus:outline-none',
      },
    },
  });

  // Sync external value changes (e.g. form.reset in edit mode)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  // Sync disabled state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        'border-input bg-background focus-within:ring-ring rounded-md border focus-within:ring-2 focus-within:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={disabled}
          title="Bold"
        >
          <BoldIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={disabled}
          title="Italic"
        >
          <ItalicIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          disabled={disabled}
          title="Underline"
        >
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          disabled={disabled}
          title="Strikethrough"
        >
          <StrikethroughIcon className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          disabled={disabled}
          title="Heading 1"
        >
          <Heading1Icon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          disabled={disabled}
          title="Heading 2"
        >
          <Heading2Icon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          disabled={disabled}
          title="Heading 3"
        >
          <Heading3Icon className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          disabled={disabled}
          title="Bullet list"
        >
          <ListIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          disabled={disabled}
          title="Ordered list"
        >
          <ListOrderedIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          disabled={disabled}
          title="Blockquote"
        >
          <QuoteIcon className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          disabled={disabled}
          title="Align left"
        >
          <AlignLeftIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          disabled={disabled}
          title="Align center"
        >
          <AlignCenterIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          disabled={disabled}
          title="Align right"
        >
          <AlignRightIcon className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = editor.isActive('link') ? null : window.prompt('Enter URL', 'https://');
            if (url === null) {
              editor.chain().focus().unsetLink().run();
            } else if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
          disabled={disabled}
          title="Link"
        >
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
