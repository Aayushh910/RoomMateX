import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-display font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-4xl font-display font-bold text-dark-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-dark-600 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. Let's get you back home.
          </p>
        </div>
        <Link to="/dashboard">
          <Button size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
