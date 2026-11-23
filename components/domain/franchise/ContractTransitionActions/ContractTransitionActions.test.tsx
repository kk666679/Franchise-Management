import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { ContractTransitionActions } from './ContractTransitionActions'

vi.mock('@/components/auth/PermissionGate', () => ({
  PermissionGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

it('shows available transitions for status', () => {
  render(<ContractTransitionActions contractId="c1" status="draft" onTransition={vi.fn()} />)
  expect(screen.getByRole('button', { name: /submit for approval/i })).toBeTruthy()
  expect(screen.queryByRole('button', { name: /terminate/i })).not.toBeTruthy()
})

it('calls onTransition', async () => {
  const onTransition = vi.fn().mockResolvedValue(undefined)
  render(<ContractTransitionActions contractId="c1" status="draft" onTransition={onTransition} />)
  await userEvent.click(screen.getByRole('button', { name: /submit for approval/i }))
  expect(onTransition).toHaveBeenCalledWith('submit')
})

it('has no a11y violations', async () => {
  const { container } = render(
    <ContractTransitionActions contractId="c1" status="active" onTransition={vi.fn()} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
