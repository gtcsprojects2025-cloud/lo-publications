"use client";

import { useEditor, EditorContent } from '@tiptap/react'; // This line is already correct
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const TestTiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: '<p>Test — try dragging an image here</p>',
  })

  return <EditorContent editor={editor} />
}

export default TestTiptap