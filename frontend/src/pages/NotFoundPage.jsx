import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
          <p className="mt-4 text-lg text-gray-600">Oops! We couldn't find the page you're looking for.</p>
          <Link
            to="/"
            className="inline-flex items-center mt-6 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
