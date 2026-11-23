import { render, screen } from '@testing-library/react'
import { ShiftCell } from './ShiftCell'

it('renders dash for empty', () => {
  render(<ShiftCell shift={null} />)
  expect(screen.getByText('—')).toBeInTheDocument()
})
