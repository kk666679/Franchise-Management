import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { BranchForm } from './BranchForm'

const franchises = [{ id: '00000000-0000-0000-0000-000000000001', name: 'Acme North' }]

it('submits a valid branch', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(<BranchForm mode="create" franchises={franchises} onSubmit={onSubmit} />)
  await userEvent.type(screen.getByLabelText(/branch name/i), 'Downtown')
  await userEvent.type(screen.getByLabelText(/line 1/i), '123 Main')
  await userEvent.type(screen.getByLabelText(/city/i), 'Springfield')
  await userEvent.type(screen.getByLabelText(/region/i), 'IL')
  await userEvent.type(screen.getByLabelText(/postal code/i), '62701')
  await userEvent.click(screen.getByRole('button', { name: /create branch/i }))
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Downtown', address: expect.objectContaining({ city: 'Springfield' }) }),
  )
})

it('has no a11y violations', async () => {
  const { container } = render(<BranchForm mode="create" franchises={franchises} onSubmit={vi.fn()} />)
  expect((await axe(container)).violations).toEqual([])
})
