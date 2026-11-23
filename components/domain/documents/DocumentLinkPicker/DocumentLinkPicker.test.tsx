import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DocumentLinkPicker } from './DocumentLinkPicker'

it('renders picker', () => {
  render(<DocumentLinkPicker documents={[]} value={null} onChange={() => {}} />)
  expect(screen.getByLabelText(/Linked document/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<DocumentLinkPicker documents={[]} value={null} onChange={() => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})
