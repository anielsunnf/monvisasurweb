import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { LoginPage } from './pages/LoginPage'

describe('LoginPage', () => {
  it('redirects an authenticated client away from the login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                user={{ id: 'USR-CLIENT', email: 'client@monvisasur.test', role: 'client', name: 'Client démo' }}
                setUser={vi.fn()}
              />
            }
          />
          <Route path="/client" element={<div>Client dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Client dashboard')).toBeInTheDocument()
  })
})
