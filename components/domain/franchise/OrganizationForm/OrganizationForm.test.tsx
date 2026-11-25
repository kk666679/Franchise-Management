import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { OrganizationForm } from './OrganizationForm'

it('submits valid values', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  render(<OrganizationForm mode="create" onSubmit={onSubmit} />)
  await userEvent.type(screen.getByLabelText(/organization name/i), 'Acme Inc')
  await userEvent.type(screen.getByLabelText(/legal name/i), 'Acme Holdings LLC')
  await userEvent.type(screen.getByLabelText(/tax id/i), 'TAX-1')
  await userEvent.click(screen.getByRole('button', { name: /create organization/i }))
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Acme Inc', legalName: 'Acme Holdings LLC', taxId: 'TAX-1' }),
  )
})

it('has no a11y violations', async () => {
  const { container } = render(<OrganizationForm mode="create" onSubmit={vi.fn()} />)
  expect(await axe(container)).toHaveNoViolations()
})
