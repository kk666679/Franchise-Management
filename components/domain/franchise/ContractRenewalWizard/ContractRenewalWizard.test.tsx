import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { ContractRenewalWizard } from './ContractRenewalWizard'

it('submits renewal', async () => {
  const onRenew = vi.fn().mockResolvedValue(undefined)
  render(<ContractRenewalWizard currentRoyaltyPct={5} onRenew={onRenew} />)
  await userEvent.click(screen.getByRole('button', { name: /renew contract/i }))
  expect(onRenew).toHaveBeenCalledWith(expect.objectContaining({ royaltyRatePct: 5 }))
})

it('has no a11y violations', async () => {
  const { container } = render(<ContractRenewalWizard currentRoyaltyPct={5} onRenew={vi.fn()} />)
  expect(await axe(container)).toHaveNoViolations()
})
