import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TaskChecklist } from './TaskChecklist'

it('renders items', () => {
  render(<TaskChecklist items={[{id:'1',label:'Do thing',done:false}]} onToggle={() => {}} />)
  expect(screen.getByLabelText('Do thing')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<TaskChecklist items={[]} onToggle={() => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})
