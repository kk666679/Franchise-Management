import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TerritoryTable } from './TerritoryTable'

it('shows conflict badge', () => {
  render(
    <TerritoryTable
      data={[
        { id: 't1', name: 'North', region: 'NA', franchiseName: 'Acme', hasConflict: true },
      ]}
    />,
  )
  expect(screen.getByText(/conflict/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<TerritoryTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})
