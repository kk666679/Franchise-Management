import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { TerritoryBoundsEditor } from './TerritoryBoundsEditor'

const bounds = { north: 45, south: 40, east: -85, west: -90 }

it('updates on change', async () => {
  const onChange = vi.fn()
  render(<TerritoryBoundsEditor value={bounds} onChange={onChange} />)
  const input = screen.getByLabelText(/north/i)
  await userEvent.clear(input)
  await userEvent.type(input, '50')
  expect(onChange).toHaveBeenCalled()
})

it('has no a11y violations', async () => {
  const { container } = render(<TerritoryBoundsEditor value={bounds} onChange={vi.fn()} />)
  expect(await axe(container)).toHaveNoViolations()
})
