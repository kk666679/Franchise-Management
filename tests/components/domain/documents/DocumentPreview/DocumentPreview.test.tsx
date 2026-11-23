import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DocumentPreview } from './DocumentPreview'

const doc = { id:'d1', name:'Policy.pdf', category:'Policy', version:1, updatedAtIso:'2026-01-01T00:00:00.000Z', updatedBy:'A', sizeBytes:100 }

it('renders preview', () => {
  render(<DocumentPreview document={doc} />)
  expect(screen.getByText('Policy.pdf')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<DocumentPreview document={doc} />)
  expect((await axe(container)).violations).toEqual([])
})
