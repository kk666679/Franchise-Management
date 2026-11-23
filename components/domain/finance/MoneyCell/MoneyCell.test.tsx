import { render, screen } from '@testing-library/react'
import { MoneyCell } from './MoneyCell'

it('formats money', () => {
  render(<MoneyCell cents={12345} currency="USD" />)
  expect(screen.getByText(/$123.45/)).toBeInTheDocument()
})
