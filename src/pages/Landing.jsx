import { Link } from 'react-router-dom';
import { Home, Shield, Users, Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useState, useEffect } from 'react';
import { rooms, roommates } from '../data/rooms';
// import 

export const Landing = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Find Your Perfect Room & Roommate';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-dark-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">R</span>
              </div>
              <span className="font-display font-bold text-xl text-dark-900">
                Room<span className="text-primary-600">Mate</span>X
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-dark-700 hover:text-primary-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-dark-700 hover:text-primary-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-dark-700 hover:text-primary-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-dark-900 mb-6 leading-tight">
              {typedText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl text-dark-600 mb-8 max-w-2xl mx-auto">
              Discover verified rooms and trusted roommates in your city. Safe, simple, and stress-free housing solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started 
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {[
              { number: '2,800+', label: 'Active Users' },
              { number: '1,500+', label: 'Listed Rooms' },
              { number: '4.8★', label: 'Avg Rating' },
              { number: '98%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-display font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-dark-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Rooms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-dark-900 mb-12 text-center">
            Featured Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 3).map((room) => (
              <Card key={room.id} hover className="group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {room.featured && (
                    <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-lg mb-2">{room.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-dark-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{room.area}, {room.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary-600">
                      ₹{room.rent.toLocaleString()}<span className="text-sm text-dark-600">/mo</span>
                    </div>
                    <Link to="/login">
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/login">
              <Button variant="outline" size="lg">
                View All Rooms <ArrowRight className="w-5 h-5 ml-12" />

              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-dark-900 mb-4 text-center">
            Why Choose RoomMateX?
          </h2>
          <p className="text-center text-dark-600 mb-12 max-w-2xl mx-auto">
            We provide a secure, trusted platform to find your ideal living situation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Listings',
                description: 'All rooms and users are verified for your safety and peace of mind',
              },
              {
                icon: Users,
                title: 'Trusted Community',
                description: 'Join thousands of verified users finding their perfect match',
              },
              {
                icon: Star,
                title: 'Rating System',
                description: 'Read genuine reviews from real tenants and roommates',
              },
              {
                icon: MapPin,
                title: 'Location-Based',
                description: 'Find rooms in your preferred areas and neighborhoods',
              },
              {
                icon: CheckCircle,
                title: 'Easy Booking',
                description: 'Simple process to connect with owners and secure your room',
              },
              {
                icon: Home,
                title: 'Quality Assured',
                description: 'Only high-quality, safe accommodations make it to our platform',
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-dark-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-dark-900 mb-12 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Student',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                comment: 'Found my perfect PG within a week! The verification process made me feel so safe.',
                rating: 5,
              },
              {
                name: 'Arjun Mehta',
                role: 'Software Engineer',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                comment: 'Amazing platform! Connected with great roommates who share similar interests.',
                rating: 5,
              },
              {
                name: 'Sneha Gupta',
                role: 'Designer',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                comment: 'The review system helped me make an informed decision. Highly recommend!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-dark-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-dark-700">{testimonial.comment}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-dark-900 mb-4">
            Ready to Find Your Home?
          </h2>
          <p className="text-xl text-dark-600 mb-8">
            Join thousands of happy users who found their perfect room
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-12">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-display font-bold text-xl">R</span>
                </div>
                <span className="font-display font-bold text-xl">
                  Room<span className="text-primary-400">Mate</span>X
                </span>
              </div>
              <p className="text-dark-400">
                Your trusted platform for finding rooms and roommates
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-dark-400 hover:text-white">Features</a>
                <a href="#testimonials" className="block text-dark-400 hover:text-white">Testimonials</a>
                <Link to="/login" className="block text-dark-400 hover:text-white">Login</Link>
                <Link to="/signup" className="block text-dark-400 hover:text-white">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-dark-400 hover:text-white">Help Center</a>
                <a href="#" className="block text-dark-400 hover:text-white">Safety Tips</a>
                <a href="#" className="block text-dark-400 hover:text-white">Terms of Service</a>
                <a href="#" className="block text-dark-400 hover:text-white">Privacy Policy</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-dark-400">
                <p>support@roomatex.com</p>
                <p>+91 12345 67890</p>
                <p>Mumbai, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-800 pt-8 text-center text-dark-400">
            <p>&copy; 2026- RoomMateX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
