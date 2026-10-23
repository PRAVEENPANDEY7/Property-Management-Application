import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  LoginPage,
  RegisterPage,
  PropertyListingPage,
  PropertyDetailsPage,
  AdminDashboardPage,
  AdminPropertyListPage,
  AdminPropertyCreatePage,
  AdminPropertyEditPage,
  AdminInquiriesPage,
  AdminSettingsPage,
  NotFoundPage,
} from '../pages';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Primary Discovery Marketplace - Immediate Property Access */}
      <Route path="/" element={<PropertyListingPage />} />
      <Route path="/properties" element={<PropertyListingPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />

      {/* Auth Routes (restricted if already logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <AdminRoute>
            <AdminPropertyListPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties/new"
        element={
          <AdminRoute>
            <AdminPropertyCreatePage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties/:id/edit"
        element={
          <AdminRoute>
            <AdminPropertyEditPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <AdminRoute>
            <AdminInquiriesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettingsPage />
          </AdminRoute>
        }
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
