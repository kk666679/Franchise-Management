import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { TerritoryForm } from './TerritoryForm'

it('submits a territory', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(<TerritoryForm mode="create" onSubmit={onSubmit} />)
  await userEvent.type(screen.getByLabelText(/name/i), 'North')
  await userEvent.type(screen.getByLabelText(/region/i), 'NA')
  await userEvent.click(screen.getByRole('button', { name: /create territory/i }))
  expect(onSubmit).toHaveBeenCalledWith({ name: 'North', region: 'NA' })
})

it('has no a11y violations', async () => {
  const { container } = render(<TerritoryForm mode="create" onSubmit={vi.fn()} />)
  expect((await axe(container)).violations).toEqual([])
})
