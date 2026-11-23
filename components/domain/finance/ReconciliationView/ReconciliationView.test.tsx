import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ReconciliationView } from './ReconciliationView'

it('renders reconciliation items', () => {
  render(<ReconciliationView items={[{ id:'1', label:'Payment A', matched:true }]} />)
  expect(screen.getByText('Payment A')).toBeInTheDocument()
  expect(screen.getByText('Matched')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ReconciliationView items={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})
