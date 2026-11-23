import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { EmployeeProfile } from './EmployeeProfile'

const employee = { id:'e1', fullName:'Jane Doe', email:'jane@example.com', role:'Manager', branchName:'Main', status:'active' as const, hiredAtIso:'2026-01-01T00:00:00.000Z' }

it('renders profile', () => {
  render(<EmployeeProfile employee={employee} />)
  expect(screen.getByText('Jane Doe')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<EmployeeProfile employee={employee} />)
  expect((await axe(container)).violations).toEqual([])
})
