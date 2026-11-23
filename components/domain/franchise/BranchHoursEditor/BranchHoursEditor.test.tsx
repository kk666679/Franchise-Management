import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { BranchHoursEditor } from './BranchHoursEditor'
import type { WeekSchedule } from './BranchHoursEditor.types'

const schedule: WeekSchedule = Object.fromEntries(
  ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((k) => [
    k,
    { open: '09:00', close: '17:00', closed: false },
  ]),
) as WeekSchedule

it('toggles closed for a day', async () => {
  const onChange = vi.fn()
  render(<BranchHoursEditor value={schedule} onChange={onChange} />)
  const [monday] = screen.getAllByRole('checkbox')
  await userEvent.click(monday)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ mon: expect.objectContaining({ closed: true }) }),
  )
})

it('has no a11y violations', async () => {
  const { container } = render(<BranchHoursEditor value={schedule} onChange={vi.fn()} />)
  expect(await axe(container)).toHaveNoViolations()
})
