import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/ui/Card';
import { HelpCircle, Shield, Users, Home, Star, CheckCircle } from 'lucide-react';

export const Info = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">How RoomMateX Works</h1>
          <p className="text-xl text-dark-600">Find your perfect room in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Home,
              title: '1. Browse Rooms',
              description: 'Search through verified listings in your city',
            },
            {
              icon: Users,
              title: '2. Connect',
              description: 'Message owners and schedule visits',
            },
            {
              icon: CheckCircle,
              title: '3. Move In',
              description: 'Complete the booking and move in safely',
            },
          ].map((step, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-dark-600">{step.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How do I list my room?',
                a: 'Click on "List Room" in the navigation menu and fill out the form with your room details and photos.',
              },
              {
                q: 'Is RoomMateX free to use?',
                a: 'Yes, browsing and listing rooms is completely free. We only charge a small service fee upon successful booking.',
              },
              {
                q: 'How are users verified?',
                a: 'Users can verify their identity by submitting government-issued ID and phone number verification.',
              },
              {
                q: 'What if I have issues with a listing?',
                a: 'You can report any listing using the report button. Our team reviews all reports within 24 hours.',
              },
              {
                q: 'How do I contact support?',
                a: 'You can reach us at support@roomatex.com or call +91 12345 67890.',
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-dark-100 last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-dark-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-primary-50 border-primary-200">
          <div className="flex items-start gap-4">
            <Shield className="w-12 h-12 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-display font-semibold text-xl mb-2">Safety First</h3>
              <p className="text-dark-700 mb-4">
                We take safety seriously. All listings are verified, and we provide secure payment options and dispute resolution.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>ID Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Secure Messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
