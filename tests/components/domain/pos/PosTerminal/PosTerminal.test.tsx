import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PosTerminal } from './PosTerminal'

const noop = () => {}
const asyncNoop = async () => {}

it('renders terminal sections', () => {
  render(<PosTerminal products={[]} cart={[]} onAdd={noop} onQtyChange={noop} onRemove={noop} onTender={asyncNoop} />)
  expect(screen.getByText('Products')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<PosTerminal products={[]} cart={[]} onAdd={noop} onQtyChange={noop} onRemove={noop} onTender={asyncNoop} />)
  expect((await axe(container)).violations).toEqual([])
})
