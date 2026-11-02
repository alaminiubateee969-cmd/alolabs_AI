import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HomeExperience } from '@/components/site/home-experience'

class TestIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = TestIntersectionObserver as unknown as typeof IntersectionObserver

afterEach(cleanup)

describe('home experience', () => {
  it('shows the product story and links to the existing login', () => {
    render(<HomeExperience />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Big ideas, meet your AI team')
    expect(screen.getAllByRole('link', { name: /Open AgentOS/ })[0]).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /Discover what’s possible/ })).toHaveAttribute('href', '#platform')
  })

  it('fills an example prompt without claiming to run it', () => {
    render(<HomeExperience />)
    fireEvent.click(screen.getByRole('button', { name: /Help me plan a new project/ }))
    expect(screen.getByRole('textbox', { name: /Describe what you want to work on/ })).toHaveValue('Help me plan a new project')
    expect(screen.getByText(/sign in to start a new conversation/i)).toBeInTheDocument()
  })

  it('opens and closes mobile navigation', () => {
    render(<HomeExperience />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
  })
})
