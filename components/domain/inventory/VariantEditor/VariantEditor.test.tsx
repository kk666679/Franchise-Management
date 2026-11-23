import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { VariantEditor } from './VariantEditor'

it('renders variant editor', () => {
  render(<VariantEditor variants={[]} onChange={() => {}} />)
  expect(screen.getByText(/Variants/)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<VariantEditor variants={[]} onChange={() => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})
