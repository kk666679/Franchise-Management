import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PosReceipt } from './PosReceipt'

const receipt = { receiptNumber: 'R-1', currency: 'USD', totalCents: 500, lines: [{ id: 'l1', name: 'Item', quantity: 1, totalCents: 500 }] }

it('renders receipt', () => {
  render(<PosReceipt receipt={receipt} />)
  expect(screen.getByText(/Receipt R-1/)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<PosReceipt receipt={receipt} />)
  expect(await axe(container)).toHaveNoViolations()
})
