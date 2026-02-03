import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { rooms } from '../data/rooms';
import { MapPin, Eye } from 'lucide-react';

export const AdminRooms = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold">Manage Rooms</h1>

        <div className="grid gap-6">
          {rooms.map((room) => (
            <Card key={room.id} hover>
              <div className="flex gap-6 p-6">
                <img
                  src={room.images[0]}
                  alt={room.title}
                  className="w-48 h-32 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-1">{room.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-dark-600">
                        <MapPin className="w-4 h-4" />
                        <span>{room.area}, {room.city}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">₹{room.rent.toLocaleString()}</div>
                      <div className="text-sm text-dark-600">per month</div>
                    </div>
                  </div>
                  <p className="text-dark-700 mb-4 line-clamp-2">{room.description}</p>
                  <div className="flex items-center gap-3">
                    <Badge variant={room.ownerVerified ? 'success' : 'warning'}>
                      {room.ownerVerified ? 'Verified Owner' : 'Unverified'}
                    </Badge>
                    <Badge variant="info">{room.roomType}</Badge>
                    <div className="flex items-center gap-1 text-sm text-dark-600">
                      <Eye className="w-4 h-4" />
                      <span>0 views</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="danger">Remove</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
