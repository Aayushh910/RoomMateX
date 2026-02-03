import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Star } from 'lucide-react';
import { userReviews } from '../data/reviews';

export const Reviews = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-display font-bold">My Reviews</h1>

        <Card className="p-6">
          <h2 className="text-xl font-display font-semibold mb-4">Reviews Given</h2>
          {userReviews.given.length === 0 ? (
            <p className="text-dark-600">No reviews given yet</p>
          ) : (
            <div className="space-y-4">
              {userReviews.given.map((review) => (
                <div key={review.id} className="border-b border-dark-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{review.targetName}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-dark-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-dark-600">{review.date}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-display font-semibold mb-4">Reviews Received</h2>
          {userReviews.received.length === 0 ? (
            <p className="text-dark-600">No reviews received yet</p>
          ) : (
            <div className="space-y-4">
              {userReviews.received.map((review) => (
                <div key={review.id} className="border-b border-dark-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.reviewerImage}
                      alt={review.reviewerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-dark-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-dark-600">{review.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};
