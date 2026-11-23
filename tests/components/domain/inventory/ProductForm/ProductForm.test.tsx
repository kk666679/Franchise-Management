import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ProductForm } from './ProductForm'

it('renders product form', () => {
  render(<ProductForm onSubmit={async () => {}} />)
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ProductForm onSubmit={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})
