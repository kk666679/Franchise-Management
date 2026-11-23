'use client'

import { Button } from '@/components/ui/button'
import type { ReportExportMenuProps } from './ReportExportMenu.types'

export function ReportExportMenu({ onExport }: ReportExportMenuProps) {
  return (
    <div className="flex gap-2" aria-label="Export report">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}>CSV</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>XLSX</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>PDF</Button>
    </div>
  )
}
