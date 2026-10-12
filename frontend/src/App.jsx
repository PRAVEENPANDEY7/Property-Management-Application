import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, NotificationProvider, GeolocationProvider } from './context';
import AppRoutes from './routes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <GeolocationProvider>
            <AppRoutes />
          </GeolocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
