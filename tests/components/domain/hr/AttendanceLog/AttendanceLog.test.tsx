import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AttendanceLog } from './AttendanceLog'

it('renders empty state when no data', () => {
  render(<AttendanceLog data={[]} />)
  expect(screen.getByText(/No attendance records/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<AttendanceLog data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})
