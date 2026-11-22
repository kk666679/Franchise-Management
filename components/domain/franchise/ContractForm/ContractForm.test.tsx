import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { ContractForm } from './ContractForm'

const franchises = [{ id: '00000000-0000-0000-0000-000000000001', name: 'Acme North' }]

it('submits a contract', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(<ContractForm mode="create" franchises={franchises} onSubmit={onSubmit} />)
  await userEvent.click(screen.getByRole('button', { name: /create contract/i }))
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ franchiseId: franchises[0].id, royaltyRatePct: 5 }),
  )
})

it('has no a11y violations', async () => {
  const { container } = render(
    <ContractForm mode="create" franchises={franchises} onSubmit={vi.fn()} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
