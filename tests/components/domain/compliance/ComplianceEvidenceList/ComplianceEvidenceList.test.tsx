import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ComplianceEvidenceList } from './ComplianceEvidenceList'

it('renders empty state', () => {
  render(<ComplianceEvidenceList evidence={[]} />)
  expect(screen.getByText(/No evidence uploaded/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ComplianceEvidenceList evidence={[]} />)
  expect((await axe(container)).violations).toEqual([])
})
