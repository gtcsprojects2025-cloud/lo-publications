// src/lib/tiptap/extensions/ImageUpload.ts
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

type ImageUploadOptions = {
  uploadFn: (file: File) => Promise<string>
}

export const ImageUpload = Extension.create<ImageUploadOptions>({
  name: 'imageUpload',

  addOptions() {
    return {
      uploadFn: async (file: File) => {
        throw new Error('uploadFn not implemented')
      },
    }
  },

  addProseMirrorPlugins() {
    const { uploadFn } = this.options

    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handleDrop(view, event) {
            const hasFiles = event.dataTransfer?.files && event.dataTransfer.files.length > 0
            if (!hasFiles) return false

            const file = event.dataTransfer.files[0]
            if (!file.type.startsWith('image/')) return false

            event.preventDefault()
            event.stopPropagation()

            uploadFn(file).then(url => {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: url })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            }).catch(err => {
              console.error('Image upload failed:', err)
              // Optional: show toast/error
            })

            return true
          },

          handlePaste(view, event) {
            const hasFiles = event.clipboardData?.files && event.clipboardData.files.length > 0
            if (!hasFiles) return false

            const file = event.clipboardData.files[0]
            if (!file.type.startsWith('image/')) return false

            event.preventDefault()
            event.stopPropagation()

            uploadFn(file).then(url => {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: url })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            }).catch(err => {
              console.error('Image paste upload failed:', err)
            })

            return true
          },
        },
      }),
    ]
  },
})