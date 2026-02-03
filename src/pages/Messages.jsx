import { MainLayout } from '../layouts/MainLayout';
import { EmptyState } from '../components/ui/EmptyState';
import { MessageCircle } from 'lucide-react';

export const Messages = () => {
  return (
    <MainLayout>
      <EmptyState
        icon={MessageCircle}
        title="No messages yet"
        description="Start a conversation with room owners or potential roommates to see your chats here."
      />
    </MainLayout>
  );
};
