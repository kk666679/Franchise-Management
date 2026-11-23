'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { DocumentUploaderProps } from './DocumentUploader.types'

export function DocumentUploader({ onUpload }: DocumentUploaderProps) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Upload document</h3>
      <input ref={ref} type="file" className="block w-full text-sm" aria-label="Select file to upload" />
      <Button onClick={() => { const f = ref.current?.files?.[0]; if (f) void onUpload(f) }}>Upload</Button>
    </Card>
  )
}
