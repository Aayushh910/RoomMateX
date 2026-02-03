import { MainLayout } from '../layouts/MainLayout';
import { EmptyState } from '../components/ui/EmptyState';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Wishlist = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save rooms you're interested in to view them here later."
        action={() => navigate('/rooms')}
        actionLabel="Browse Rooms"
      />
    </MainLayout>
  );
};
