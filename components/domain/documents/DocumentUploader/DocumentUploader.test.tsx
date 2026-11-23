import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DocumentUploader } from './DocumentUploader'

it('renders uploader', () => {
  render(<DocumentUploader onUpload={async () => {}} />)
  expect(screen.getByLabelText(/Select file to upload/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<DocumentUploader onUpload={async () => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})
