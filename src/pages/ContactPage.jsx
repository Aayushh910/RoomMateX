import { useState } from 'react';
import { Navbar } from '../components/Navbar';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate network delay
        setTimeout(() => {
            const newMessage = {
                id: Date.now(),
                ...formData,
                date: new Date().toISOString(),
                status: 'New'
            };

            const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            localStorage.setItem('contact_messages', JSON.stringify([newMessage, ...existingMessages]));

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
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
                            <p className="text-gray-600">Get in touch with us and we'll respond as soon as possible</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
                            {/* Contact Info */}
                            <div className="md:w-1/3 space-y-4">
                                <div className="glass-panel p-6 rounded-2xl border-2 border-gray-200 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Email us</p>
                                            <p className="text-sm text-gray-500">roommatex0help@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Call us</p>
                                            <p className="text-sm text-gray-500">+91 987 654 3210</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Visit us</p>
                                            <p className="text-sm text-gray-500">Ahmedabad, Gujarat</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="md:w-2/3">
                                <div className="glass-card p-8 rounded-2xl shadow-lg shadow-gray-300/50 border-2 border-gray-200">
                                    {status === 'success' ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                                            <p className="text-gray-500 mb-6">Thank you for contacting us. We will get back to you shortly.</p>
                                            <button onClick={() => setStatus('idle')} className="text-primary-600 font-bold hover:underline">Send another message</button>
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
                                                        Sending...
                                                    </>
                                                ) : 'Send Message'}
                                            </button>
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
