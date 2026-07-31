import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ROUTES } from '../constants/routes';

/**
 * Main Application Routes Configuration
 * Configures nested route hierarchy under RootLayout and handles 404 fallback.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
