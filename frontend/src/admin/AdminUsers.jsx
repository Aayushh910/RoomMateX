import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Shield, Search } from 'lucide-react';

export const AdminUsers = () => {
  const users = [
    { id: '1', name: 'Rahul Kumar', email: 'rahul@example.com', role: 'seeker', verified: true, trustScore: 4.8 },
    { id: '2', name: 'Priya Sharma', email: 'priya@example.com', role: 'owner', verified: true, trustScore: 4.9 },
    { id: '3', name: 'Amit Patel', email: 'amit@example.com', role: 'seeker', verified: false, trustScore: 4.2 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Manage Users</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input type="text" placeholder="Search users..." className="pl-10 input w-64" />
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 border-b border-dark-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trust Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-dark-600">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.verified ? (
                        <Badge variant="success">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning">Unverified</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{user.trustScore}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
