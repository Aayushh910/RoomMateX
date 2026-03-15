import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import api from '../services/api';

export const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: 'How do I list my room on RoomMateX?',
            answer: 'Simply sign up, verify your account, and click on "List Your Room" from the dashboard. Fill in the property details, upload photos, and your listing will be live!'
        },
        {
            question: 'Is RoomMateX free to use?',
            answer: 'Yes! Creating an account, browsing rooms, and contacting owners is completely free. We believe in making housing accessible to everyone.'
        },
        {
            question: 'How does the verification process work?',
            answer: 'After signing up, you\'ll receive an OTP via email. Enter the code to verify your account. Verified users get a blue badge and can list properties.'
        },
        {
            question: 'Can I contact multiple room owners?',
            answer: 'Yes! You can send contact requests to as many properties as you like. Once the owner accepts, you\'ll get their contact details.'
        },
        {
            question: 'How do I know if a listing is genuine?',
            answer: 'All listings are from verified users. Look for the verified badge, check reviews, and always visit the property before making any payment.'
        },
        {
            question: 'What if I face issues with a listing?',
            answer: 'You can report any listing or user through the report button. Our team reviews all reports and takes appropriate action within 24 hours.'
        }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await api.post('/contact/send', formData);
            
            if (response.data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Navbar />
            <div className="flex-1 py-8 overflow-y-auto">
                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* FAQ Section */}
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                            <p className="text-gray-600">Find quick answers to common questions</p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="glass-card border border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="pt-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Still Have Questions?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We're here to help! Choose your preferred way to reach us - fill out the form below for a quick response, 
                                or contact us directly using the information provided.
                            </p>
                        </div>

                        {/* Instructions Banner */}
                        <div className="max-w-5xl mx-auto mb-6">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">How to Contact Us</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">1.</span>
                                                <p><strong className="text-gray-900">Quick Response:</strong> Fill out the contact form below and we'll get back to you within 24 hours.</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">2.</span>
                                                <p><strong className="text-gray-900">Direct Contact:</strong> Email us directly at <a href="mailto:roommatex0help@gmail.com" className="text-blue-600 font-semibold hover:underline">roommatex0help@gmail.com</a> or call us at <a href="tel:+918200256660" className="text-blue-600 font-semibold hover:underline">+91 82002 56660</a>.</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">3.</span>
                                                <p><strong className="text-gray-900">Business Hours:</strong> We're available Monday to Saturday, 9:00 AM - 6:00 PM IST. Messages received outside business hours will be responded to on the next working day.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
                            {/* Contact Info */}
                            <div className="md:w-1/3 space-y-4">
                                <div className="glass-panel p-6 rounded-2xl border-2 border-gray-200 space-y-4">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Contact Information</h3>
                                        <p className="text-xs text-gray-500">Reach us directly</p>
                                    </div>
                                    
                                    <a href="mailto:roommatex0help@gmail.com" className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors group">
                                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Email us</p>
                                            <p className="text-sm text-gray-900 font-semibold group-hover:text-primary-600 transition-colors break-all">roommatex0help@gmail.com</p>
                                        </div>
                                    </a>
                                    
                                    <a href="tel:+918200256660" className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 transition-colors group">
                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Call us</p>
                                            <p className="text-sm text-gray-900 font-semibold group-hover:text-green-600 transition-colors">+91 82002 56660</p>
                                        </div>
                                    </a>
                                    
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Visit us</p>
                                            <p className="text-sm text-gray-900 font-semibold">Ahmedabad, Gujarat</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Working Hours</p>
                                            <p className="text-sm text-gray-900 font-semibold">Mon-Sat: 9AM-6PM</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tips */}
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-yellow-900 mb-1">Quick Tip</h4>
                                            <p className="text-xs text-yellow-800">For faster response, use the contact form. We'll reply within 24 hours!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="md:w-2/3">
                                <div className="glass-card p-8 rounded-2xl shadow-lg shadow-gray-300/50 border-2 border-gray-200">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
                                        <p className="text-sm text-gray-600">
                                            Fill out the form below and we'll get back to you within 24 hours. All fields are required.
                                        </p>
                                    </div>

                                    {status === 'success' ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h2>
                                            <p className="text-gray-600 mb-2">Thank you for contacting us, <strong>{formData.name || 'there'}</strong>!</p>
                                            <p className="text-gray-500 mb-6">We've received your message and will respond to <strong>{formData.email || 'your email'}</strong> within 24 hours.</p>
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                                                <p className="text-sm text-blue-800">
                                                    <strong>What's next?</strong><br/>
                                                    • Check your email inbox (and spam folder)<br/>
                                                    • We'll reply from roommatex0help@gmail.com<br/>
                                                    • Response time: Within 24 hours
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => setStatus('idle')} 
                                                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                                            >
                                                Send Another Message
                                            </button>
                                        </div>
                                    ) : status === 'error' ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Send Message</h2>
                                            <p className="text-gray-500 mb-6">Something went wrong. Please try again or contact us directly via email.</p>
                                            <div className="flex gap-3 justify-center">
                                                <button 
                                                    onClick={() => setStatus('idle')} 
                                                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                                                >
                                                    Try Again
                                                </button>
                                                <a 
                                                    href="mailto:roommatex0help@gmail.com" 
                                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                                >
                                                    Email Directly
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                                        placeholder="Your Name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                                        placeholder="you@email.com"
                                                    />
                                                    <p className="mt-1.5 text-xs text-blue-600 flex items-start gap-1.5">
                                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>Please enter a valid email address - we'll send our reply to this email</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                                    placeholder="How can we help?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all h-32 resize-none"
                                                    placeholder="Tell us more..."
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={status === 'submitting'}
                                                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {status === 'submitting' ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Sending Message...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        Send Message
                                                    </>
                                                )}
                                            </button>
                                            
                                            {/* Form Footer Note */}
                                            <div className="mt-4 text-center">
                                                <p className="text-xs text-gray-500">
                                                    By submitting this form, you agree to receive a response from RoomMateX via email.
                                                </p>
                                            </div>
                                            
                                            {/* Alternative Contact */}
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <p className="text-sm text-gray-600 text-center mb-3">
                                                    Prefer to contact us directly?
                                                </p>
                                                <div className="flex gap-3 justify-center">
                                                    <a 
                                                        href="mailto:roommatex0help@gmail.com"
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        Email Us
                                                    </a>
                                                    <a 
                                                        href="tel:+918200256660"
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        Call Us
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
