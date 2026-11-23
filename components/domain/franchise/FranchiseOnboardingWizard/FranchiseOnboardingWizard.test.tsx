import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { FranchiseOnboardingWizard } from './FranchiseOnboardingWizard'

it('progresses through steps', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(<FranchiseOnboardingWizard organizations={[]} onSubmit={onSubmit} />)

  expect(screen.getByLabelText(/onboarding progress/i)).toBeTruthy()

  await userEvent.type(screen.getByLabelText(/organization name/i), 'Acme')
  await userEvent.type(screen.getByLabelText(/legal name/i), 'Acme LLC')
  await userEvent.type(screen.getByLabelText(/tax id/i), 'TAX-1')
  await userEvent.click(screen.getByRole('button', { name: /continue/i }))

  expect(screen.getByLabelText(/franchise name/i)).toBeTruthy()
})

it('has no a11y violations on first step', async () => {
  const { container } = render(
    <FranchiseOnboardingWizard organizations={[]} onSubmit={vi.fn()} />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
