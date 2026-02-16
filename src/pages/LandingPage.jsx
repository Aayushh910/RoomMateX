import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Shield, Users, Star, MapPin, CheckCircle, Home } from 'lucide-react';

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

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <div className="min-h-screen font-body selection:bg-indigo-100 selection:text-indigo-700 relative bg-[#F4F7FF] transition-colors duration-500">
        {/* Background with Mesh Gradients */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-100/40 blur-[120px] mix-blend-multiply animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-100/40 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
          <div className={`absolute iconset-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]`}></div>

          {/* Floating Boxes */}
          <div className="floating-box w-16 h-16 rounded-lg" style={{ left: '10%', animationDuration: '20s', animationDelay: '0s' }}></div>
          <div className="floating-box w-20 h-20 rounded-xl" style={{ left: '20%', animationDuration: '25s', animationDelay: '2s' }}></div>
          <div className="floating-box w-12 h-12 rounded-md" style={{ left: '30%', animationDuration: '18s', animationDelay: '4s' }}></div>
          <div className="floating-box w-24 h-24 rounded-2xl" style={{ left: '40%', animationDuration: '30s', animationDelay: '1s' }}></div>
          <div className="floating-box w-14 h-14 rounded-lg" style={{ left: '50%', animationDuration: '22s', animationDelay: '3s' }}></div>
          <div className="floating-box w-18 h-18 rounded-xl" style={{ left: '60%', animationDuration: '27s', animationDelay: '5s' }}></div>
          <div className="floating-box w-16 h-16 rounded-lg" style={{ left: '70%', animationDuration: '21s', animationDelay: '0s' }}></div>
          <div className="floating-box w-22 h-22 rounded-2xl" style={{ left: '80%', animationDuration: '24s', animationDelay: '2s' }}></div>
          <div className="floating-box w-12 h-12 rounded-md" style={{ left: '90%', animationDuration: '19s', animationDelay: '4s' }}></div>
          <div className="floating-box w-20 h-20 rounded-xl" style={{ left: '15%', animationDuration: '26s', animationDelay: '6s' }}></div>
          <div className="floating-box w-16 h-16 rounded-lg" style={{ left: '35%', animationDuration: '23s', animationDelay: '1s' }}></div>
          <div className="floating-box w-14 h-14 rounded-lg" style={{ left: '55%', animationDuration: '20s', animationDelay: '3s' }}></div>
          <div className="floating-box w-18 h-18 rounded-xl" style={{ left: '75%', animationDuration: '28s', animationDelay: '5s' }}></div>
          <div className="floating-box w-12 h-12 rounded-md" style={{ left: '85%', animationDuration: '17s', animationDelay: '0s' }}></div>
          <div className="floating-box w-24 h-24 rounded-2xl" style={{ left: '25%', animationDuration: '29s', animationDelay: '2s' }}></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10">

          {/* Floating Navbar */}
          <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-4">
            <nav className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-white/50 dark:border-slate-800 rounded-2xl transition-all duration-300">
              <div className="px-6 md:px-8">
                <div className="flex justify-between h-20 items-center">
                  {/* Logo */}
                  <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-indigo-500/40">
                      <svg className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300">
                      RoomMateX
                    </span>
                  </Link>

                  {/* Centered Links */}
                  <div className="hidden md:flex items-center gap-8">
                    <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors text-sm cursor-pointer">
                      Home
                    </a>
                    <a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors text-sm cursor-pointer">
                      Features
                    </a>

                    <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, 'testimonials')} className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors text-sm cursor-pointer">
                      Reviews
                    </a>
                    <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm cursor-pointer">
                      Contact
                    </a>
                  </div>

                  {/* Right Buttons */}
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="hidden sm:inline-flex px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium text-sm transition-all duration-300 hover:bg-gray-50 rounded-lg transform hover:scale-105">
                      Login
                    </Link>
                    <Link to="/signup" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 font-medium text-sm transform hover:-translate-y-1 hover:scale-105">
                      Start Free Trial
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Hero Section */}
          <section id="home" className="relative pt-44 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
              <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                {/* Rating Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 text-sm font-medium mb-10 animate-fade-in hover:shadow-lg transition-all duration-300 cursor-default transform hover:scale-105">
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border-2 border-white transform hover:scale-110 transition-transform duration-300 animate-pulse" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="" />
                    <img className="w-6 h-6 rounded-full border-2 border-white transform hover:scale-110 transition-transform duration-300" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="" />
                    <img className="w-6 h-6 rounded-full border-2 border-white transform hover:scale-110 transition-transform duration-300" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64" alt="" />
                  </div>
                  <span className="pl-1">Rated 4.9/5 from verified users</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                  {typedText}
                  <span className="text-primary-600">|</span>
                </h1>
                <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Discover verified rooms and trusted roommates in your city. Safe, simple, and stress-free housing solutions designed for modern living.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-xl shadow-primary-600/20 hover:shadow-2xl hover:shadow-primary-600/40 font-semibold text-lg transform hover:scale-105 hover:-translate-y-1"
                  >
                    Get Started Now
                  </Link>
                  <a
                    href="#features"
                    onClick={(e) => handleSmoothScroll(e, 'features')}
                    className="w-full sm:w-auto text-gray-700 px-8 py-4 rounded-lg hover:bg-white/50 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 transform hover:scale-105 border-2 border-transparent hover:border-gray-200 group cursor-pointer"
                  >
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Learn More
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
                  <div key={index} className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer">
                    <div className="text-4xl font-bold text-primary-600 mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Demo Cards / Featured Rooms */}
          <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-xl shadow-xl shadow-blue-900/5 border border-white/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Rooms</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Placeholder Room Cards */}
                {[
                  { title: 'Cozy Studio Apartment', location: 'Downtown, Mumbai', price: '15,000', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
                  { title: 'Spacious Apartment', location: 'Koramangala, Bangalore', price: '25,000', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
                  { title: 'Modern Shared Room', location: 'Gurgaon, Delhi NCR', price: '12,000', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
                ].map((room, idx) => (
                  <Link
                    key={idx}
                    to="/login"
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group border border-gray-100 hover:border-primary-200"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-primary-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-20">
                        Featured
                      </div>
                      <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-lg text-sm font-bold z-20">
                        ₹{room.price}/mo
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{room.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{room.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">Available</span>
                        <span className="text-xs text-gray-400 font-medium">Contact now</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link to="/login" className="bg-white text-primary-600 px-8 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-all inline-flex items-center font-semibold shadow-sm hover:shadow-md">
                  View All Rooms
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RoomMateX?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">We provide a secure, trusted platform to find your ideal living situation with verified profiles and smart matching.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: 'Verified Listings',
                    desc: 'All rooms and users are verified for your safety and peace of mind.'
                  },
                  {
                    icon: Users,
                    title: 'Trusted Community',
                    desc: 'Join thousands of verified users finding their perfect match everyday.'
                  },
                  {
                    icon: Star,
                    title: 'Rating System',
                    desc: 'Read genuine reviews from real tenants and roommates before booking.'
                  },
                  {
                    icon: MapPin,
                    title: 'Location-Based',
                    desc: 'Find rooms in your preferred areas and neighborhoods with our smart map.'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Easy Booking',
                    desc: 'Simple process to connect with owners and secure your room online.'
                  },
                  {
                    icon: Home,
                    title: 'Quality Assured',
                    desc: 'Only high-quality, safe accommodations make it to our platform.'
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white/50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center border border-gray-100 group">
                    <div className="mb-6 flex justify-center">
                      <feature.icon className="w-12 h-12 text-primary-600 transform group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-xl shadow-xl shadow-blue-900/5 border border-white/50 rounded-2xl p-6 md:p-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-600">Join thousands of happy residents who found their home with us.</p>
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
                  <div key={idx} className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                        <p className="text-primary-600 text-sm font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="py-12 relative overflow-hidden mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-xl shadow-xl shadow-blue-900/5 border border-white/50 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="col-span-1">
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                    RoomMateX
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your trusted partner for finding the perfect room and compatible roommates. Making housing simple and safe.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6 text-gray-900">Company</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li><a href="#" className="hover:text-primary-600 transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-primary-600 transition-colors">Press</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6 text-gray-900">Support</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li><a href="#" className="hover:text-primary-600 transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-primary-600 transition-colors">Safety Tips</a></li>
                    <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Us</Link></li>
                    <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6 text-gray-900">Follow Us</h4>
                  <div className="flex gap-4">
                    {/* Social Icons */}
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; 2026 RoomMateX. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
