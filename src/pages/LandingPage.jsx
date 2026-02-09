import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockRooms } from '../data/mockData';

export const LandingPage = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Find Your Perfect Room & Roommate   ';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              RoomMateX
            </span>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {typedText}
                <span className="animate-pulse">|</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover verified rooms and trusted roommates in your city. Safe, simple, and stress-free housing solutions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-all font-semibold"
                >
                  Learn More
                </a>
              </div>
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
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Rooms</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mockRooms.slice(0, 3).map((room) => (
              <Link
                key={room.id}
                to="/login"
                className="card hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {room.owner.verified && (
                    <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{room.area}, {room.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">₹{room.rent.toLocaleString()}<span className="text-sm text-gray-600">/mo</span></span>
                    <span className="badge badge-success">{room.roomType}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/login" className="bg-white text-primary-600 px-8 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-all inline-flex items-center font-semibold">
              View All Rooms
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RoomMateX?</h2>
            <p className="text-xl text-gray-600">We provide a secure, trusted platform to find your ideal living situation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: '🛡️', 
                title: 'Verified Listings', 
                desc: 'All rooms and users are verified for your safety and peace of mind' 
              },
              { 
                icon: '👥', 
                title: 'Trusted Community', 
                desc: 'Join thousands of verified users finding their perfect match' 
              },
              { 
                icon: '⭐', 
                title: 'Rating System', 
                desc: 'Read genuine reviews from real tenants and roommates' 
              },
              { 
                icon: '📍', 
                title: 'Location-Based', 
                desc: 'Find rooms in your preferred areas and neighborhoods' 
              },
              { 
                icon: '✅', 
                title: 'Easy Booking', 
                desc: 'Simple process to connect with owners and secure your room' 
              },
              { 
                icon: '🏠', 
                title: 'Quality Assured', 
                desc: 'Only high-quality, safe accommodations make it to our platform' 
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of happy residents</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Priya Sharma', 
                role: 'Student',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                text: 'Found my perfect PG within a week! The verification process made me feel so safe.',
                rating: 5
              },
              { 
                name: 'Arjun Mehta', 
                role: 'Software Engineer',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                text: 'Amazing platform! Connected with great roommates who share similar interests.',
                rating: 5
              },
              { 
                name: 'Sneha Gupta', 
                role: 'Designer',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                text: 'The review system helped me make an informed decision. Highly recommend!',
                rating: 5
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                RoomMateX
              </h3>
              <p className="text-gray-400">Your trusted platform for finding rooms and roommates.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety Tips</a></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 RoomMateX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
