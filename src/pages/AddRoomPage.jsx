import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { amenitiesList } from '../data/mockData';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { GUJARAT_CITIES } from '../constants/cities';

export const AddRoomPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [showVerificationWarning, setShowVerificationWarning] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        propertyType: 'Apartment',

        city: '',
        area: '',
        rent: '',
        deposit: '',
        availableFrom: '',
        photos: [],
        genderPreference: 'Any',
        amenities: [],
        rules: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const newAmenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities: newAmenities };
        });
    };

    const handlePhotoUpload = (e) => {
        // Mock photo upload
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        alert('Room listed successfully!');
        navigate('/dashboard');
    };

    useEffect(() => {
        if (!user?.verified) {
            setShowVerificationWarning(true);
        }
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col pt-24">
            <Navbar />
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            {['Basic Details', 'Rent & Photos', 'Preferences', 'Review'].map((label, idx) => (
                                <div key={idx} className={`text-sm font-bold ${step > idx ? 'text-green-600' : step === idx + 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 4) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden h-[calc(100vh-200px)] flex flex-col">
                        <div className="p-6 border-b border-gray-100 bg-white/30 flex justify-between items-center flex-shrink-0">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
                                <p className="text-gray-500 mt-1">Step {step} of 4</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="p-6">
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                                            placeholder="e.g. Spacious Apartment in Koregaon Park"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Type</label>
                                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white">
                                                <option>Apartment</option>
                                                <option>Independent House</option>
                                                <option>Villa</option>
                                                <option>PG</option>
                                            </select>
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                                            <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white">
                                                <option value="">Select City</option>
                                                {GUJARAT_CITIES.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Area / Locality</label>
                                            <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="Baner" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Rent (₹)</label>
                                            <input type="number" name="rent" value={formData.rent} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="15000" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deposit (₹)</label>
                                            <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="30000" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Available From</label>
                                        <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photos</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                            <input type="file" multiple onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <div className="text-gray-500">
                                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <p className="font-medium">Click to upload photos</p>
                                                <p className="text-xs mt-1">or drag and drop here</p>
                                            </div>
                                        </div>
                                        {formData.photos.length > 0 && (
                                            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                                {formData.photos.map((photo, idx) => (
                                                    <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                                        <img src={photo} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Tenant</label>
                                        <div className="flex gap-4">
                                            {['Any', 'Male', 'Female', 'Family', 'Student'].map((p) => (
                                                <label key={p} className={`cursor-pointer px-4 py-2 rounded-lg border-2 font-medium transition-all ${formData.genderPreference === p ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                    <input type="radio" name="genderPreference" value={p} checked={formData.genderPreference === p} onChange={handleChange} className="hidden" />
                                                    {p}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {amenitiesList.map((amenity) => (
                                                <label key={amenity} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.amenities.includes(amenity)}
                                                        onChange={() => handleAmenityToggle(amenity)}
                                                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                                                    />
                                                    <span className="text-gray-700 font-medium">{amenity}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                                            placeholder="Tell us more about the property..."
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Review your listing</h3>
                                        <div className="space-y-4 text-sm text-gray-600">
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span>Property Title</span>
                                                <span className="font-semibold text-gray-900">{formData.title}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span>Rent</span>
                                                <span className="font-semibold text-gray-900">₹{formData.rent}/mo</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span>Location</span>
                                                <span className="font-semibold text-gray-900">{formData.area}, {formData.city}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span>Amenities</span>
                                                <span className="font-semibold text-gray-900">{formData.amenities.length} Selected</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        By clicking Confirm, you agree to our terms and conditions for listing properties.
                                    </div>
                                </div>
                            )}

                            </div>

                            <div className="p-6 pt-4 border-t border-gray-100 flex justify-between flex-shrink-0">
                                {step > 1 ? (
                                    <button type="button" onClick={prevStep} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                        Back
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                {step < 4 ? (
                                    <button type="button" onClick={nextStep} className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5">
                                        Next Step
                                    </button>
                                ) : (
                                    <button type="submit" className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-0.5">
                                        Confirm & Publish
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Verification Warning Modal */}
            {showVerificationWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-2xl w-full max-w-md relative z-10 p-8 shadow-2xl animate-fade-in-up">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Verification Required</h3>
                            <p className="text-gray-600 mb-6">To list a room, you need to complete your personal details and verify your identity.</p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                                >
                                    Go to Profile
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
