import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { GoodsReceiptForm } from './GoodsReceiptForm'

it('renders form', () => {
  render(<GoodsReceiptForm onSubmit={async () => {}} />)
  expect(screen.getByLabelText(/Purchase order ID/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<GoodsReceiptForm onSubmit={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})
