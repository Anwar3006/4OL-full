"use client"

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { DRAG_DROP_PASTE } from "@lexical/rich-text"
import { isMimeType } from "@lexical/utils"
import { COMMAND_PRIORITY_LOW } from "lexical"

import { INSERT_IMAGE_COMMAND } from "@/components/editor/plugins/images-plugin"
import { uploadImageToSupabase } from "@/components/editor/utils/upload-image"

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
]

export function DragDropPastePlugin(): null {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        const hasImage = files.some((file) =>
          isMimeType(file, ACCEPTABLE_IMAGE_TYPES)
        )
        if (!hasImage) {
          return false
        }

        ;(async () => {
          for (const file of files) {
            if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
              const result = await uploadImageToSupabase(file)
              if (result.error) {
                console.error("Failed to upload image:", result.error)
                continue
              }
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: file.name,
                src: result.publicUrl,
              })
            }
          }
        })()
        return true
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])
  return null
}
