'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReportColumnPicker } from '../ReportColumnPicker'
import { ReportFilterPanel } from '../ReportFilterPanel'
import type { ReportBuilderProps } from './ReportBuilder.types'

export function ReportBuilder({ columns, filters, onColumnsChange, onFiltersChange, onRun }: ReportBuilderProps) {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">Report builder</h3>
      <ReportColumnPicker columns={columns} onChange={onColumnsChange} />
      <ReportFilterPanel filters={filters} onChange={onFiltersChange} />
      <div className="flex justify-end"><Button onClick={onRun}>Run report</Button></div>
    </Card>
  )
}
