import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { FranchiseForm } from './FranchiseForm'

const organizations = [{ id: '00000000-0000-0000-0000-000000000001', name: 'Acme Inc' }]

it('submits valid values', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(
    <FranchiseForm
      mode="create"
      organizations={organizations}
      territories={[]}
      onSubmit={onSubmit}
    />,
  )
  await userEvent.type(screen.getByLabelText(/franchise name/i), 'Acme North')
  await userEvent.type(screen.getByLabelText(/legal name/i), 'Acme North LLC')
  await userEvent.click(screen.getByRole('button', { name: /create franchise/i }))
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Acme North', legalName: 'Acme North LLC' }),
  )
})

it('shows required errors', async () => {
  render(
    <FranchiseForm
      mode="create"
      organizations={organizations}
      territories={[]}
      onSubmit={vi.fn()}
    />,
  )
  await userEvent.click(screen.getByRole('button', { name: /create franchise/i }))
  expect(await screen.findAllByText(/required/i)).not.toHaveLength(0)
})

it('has no a11y violations', async () => {
  const { container } = render(
    <FranchiseForm
      mode="create"
      organizations={organizations}
      territories={[]}
      onSubmit={vi.fn()}
    />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
