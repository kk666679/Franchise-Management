import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ReportColumnPicker } from './ReportColumnPicker'

it('renders columns', () => {
  render(<ReportColumnPicker columns={[{id:'c1',label:'Name',selected:true}]} onChange={()=>{}} />)
  expect(screen.getByLabelText('Name')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ReportColumnPicker columns={[]} onChange={()=>{}} />)
  expect((await axe(container)).violations).toEqual([])
})
