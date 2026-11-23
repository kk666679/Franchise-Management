import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ReportExportMenu } from './ReportExportMenu'

it('renders export buttons', () => {
  render(<ReportExportMenu onExport={()=>{}} />)
  expect(screen.getByRole('button', { name: 'CSV' })).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ReportExportMenu onExport={()=>{}} />)
  expect(await axe(container)).toHaveNoViolations()
})
