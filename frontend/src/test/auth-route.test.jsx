import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context';
import ProtectedRoute from '../routes/ProtectedRoute';
import AdminRoute from '../routes/AdminRoute';

describe('Route Guards and RBAC Protection', () => {
  it('ProtectedRoute redirects unauthenticated visitors to /login', () => {
    const mockAuthContext = {
      isAuthenticated: false,
      loading: false,
      user: null,
      isAdmin: false,
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Secret Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page View</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Secret Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page View')).toBeInTheDocument();
  });

  it('AdminRoute blocks regular USER role and redirects to /properties', () => {
    const mockAuthContext = {
      isAuthenticated: true,
      loading: false,
      user: { id: 1, email: 'regular@example.com', role: 'USER' },
      isAdmin: false,
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <div>Admin Secret Area</div>
                </AdminRoute>
              }
            />
            <Route path="/properties" element={<div>Public Properties View</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Admin Secret Area')).not.toBeInTheDocument();
    expect(screen.getByText('Public Properties View')).toBeInTheDocument();
  });

  it('AdminRoute permits authenticated ADMIN role', () => {
    const mockAuthContext = {
      isAuthenticated: true,
      loading: false,
      user: { id: 2, email: 'admin@example.com', role: 'ADMIN' },
      isAdmin: true,
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <div>Admin Secret Area</div>
                </AdminRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Admin Secret Area')).toBeInTheDocument();
  });
});
