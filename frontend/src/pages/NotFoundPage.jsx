import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/atoms';
import { PublicLayout } from '../components/templates';

export const NotFoundPage = () => {
  return (
    <PublicLayout>
      <div className="py-24 text-center max-w-md mx-auto space-y-5">
        <div className="text-7xl font-black text-brand-600 tracking-tighter">404</div>
        <h1 className="text-2xl font-extrabold text-surface-900">Page Not Found</h1>
        <p className="text-sm text-surface-500 leading-relaxed">
          The page you are trying to visit does not exist, has been moved, or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link to="/properties">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4 mr-2" /> Return to Properties
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFoundPage;
