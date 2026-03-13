import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GUJARAT_CITIES } from '../constants/cities';
import { propertyService } from '../services/propertyService';

export const AddRoomPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [step, setStep] = useState(1);
    const [showVerificationWarning, setShowVerificationWarning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        propertyType: 'apartment',
        city: '',
        area: '',
        rent: '',
        deposit: '',
        availableFrom: '',
        photoFiles: [],
        genderPreference: 'any',
        amenities: [],
        rules: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
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
        const files = Array.from(e.target.files);
        if (files.length + formData.photoFiles.length > 5) {
            showError('Maximum 5 images allowed');
            return;
        }
        
        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            showError('Please upload only JPG, PNG, or WebP images');
            return;
        }
        
        // Validate file sizes (max 5MB per file)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            showError('Each image must be less than 5MB');
            return;
        }
        
        setFormData(prev => ({ ...prev, photoFiles: [...prev.photoFiles, ...files] }));
        
        // Clear photo error when photos are added
        if (errors.photoFiles) {
            setErrors(prev => ({ ...prev, photoFiles: null }));
        }
    };

    const removePhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photoFiles: prev.photoFiles.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (stepNumber) => {
        const newErrors = {};
        
        if (stepNumber === 1) {
            // Title validation
            if (!formData.title.trim()) {
                newErrors.title = "Property title is required";
            } else if (formData.title.trim().length < 10) {
                newErrors.title = "Title must be at least 10 characters long";
            } else if (formData.title.trim().length > 100) {
                newErrors.title = "Title must not exceed 100 characters";
            }
            
            // Property type validation
            if (!formData.propertyType) {
                newErrors.propertyType = "Property type is required";
            }
            
            // City validation
            if (!formData.city) {
                newErrors.city = "City selection is required";
            }
            
            // Area validation
            if (!formData.area.trim()) {
                newErrors.area = "Area/Locality is required";
            } else if (formData.area.trim().length < 3) {
                newErrors.area = "Area name must be at least 3 characters";
            }
        } else if (stepNumber === 2) {
            // Rent validation
            if (!formData.rent) {
                newErrors.rent = "Monthly rent is required";
            } else if (formData.rent <= 0) {
                newErrors.rent = "Rent must be a positive amount";
            } else if (formData.rent < 1000) {
                newErrors.rent = "Rent must be at least ₹1,000";
            } else if (formData.rent > 1000000) {
                newErrors.rent = "Rent cannot exceed ₹10,00,000";
            }
            
            // Deposit validation
            if (!formData.deposit) {
                newErrors.deposit = "Deposit amount is required";
            } else if (formData.deposit <= 0) {
                newErrors.deposit = "Deposit must be a positive amount";
            } else if (formData.deposit < 1000) {
                newErrors.deposit = "Deposit must be at least ₹1,000";
            } else if (formData.deposit > 5000000) {
                newErrors.deposit = "Deposit cannot exceed ₹50,00,000";
            }
            
            // Available from validation
            if (!formData.availableFrom) {
                newErrors.availableFrom = "Available from date is required";
            } else {
                const selectedDate = new Date(formData.availableFrom);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    newErrors.availableFrom = "Available date cannot be in the past";
                }
            }
            
            // Photos validation
            if (formData.photoFiles.length === 0) {
                newErrors.photoFiles = "At least 3 photos are required to showcase your property";
            } else if (formData.photoFiles.length < 3) {
                newErrors.photoFiles = `Please upload ${3 - formData.photoFiles.length} more photo(s). Minimum 3 photos required`;
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep(step)) {
            showError('Please fill all required fields');
            return;
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
            return;
        }

        // Validate all steps before submission
        if (!validateStep(1) || !validateStep(2)) {
            showError('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        
        try {
            // Convert rules string to array
            const rulesArray = formData.rules
                .split('\n')
                .map(rule => rule.trim())
                .filter(rule => rule.length > 0);

            // Prepare property data
            const propertyData = {
                title: formData.title,
                propertyType: formData.propertyType,
                description: formData.description,
                rent: parseInt(formData.rent),
                deposit: parseInt(formData.deposit),
                city: formData.city,
                area: formData.area,
                availableFrom: formData.availableFrom,
                preferredTenant: formData.genderPreference,
                amenities: formData.amenities,
                rules: rulesArray,
                images: formData.photoFiles,
            };

            await propertyService.createProperty(propertyData);
            showSuccess('Property listed successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create property:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to create property. Please try again.';
            showError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!user?.is_verified) {
            setShowVerificationWarning(true);
        }
    }, [user]);

    return (
        <div className="h-screen flex flex-col pt-20">
            <Navbar />
            <div className="flex-1 overflow-hidden">
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex gap-6 h-full">
                        {/* Left Sidebar - Progress & Notices */}
                        <div className="w-72 flex-shrink-0">
                            <div className="h-full flex flex-col space-y-4">
                                {/* Header */}
                                <div className="flex-shrink-0">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">List Your Property</h1>
                                    <p className="text-gray-500 text-sm">Step {step} of 4 - Complete all steps to publish</p>
                                </div>

                                {/* Progress Steps */}
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-shrink-0">
                                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Progress</h3>
                                    <div className="space-y-3">
                                        {[
                                            { id: 1, label: 'Basic Details', desc: 'Title, type, location' },
                                            { id: 2, label: 'Rent & Photos', desc: 'Pricing and images' },
                                            { id: 3, label: 'Preferences', desc: 'Tenant and amenities' },
                                            { id: 4, label: 'Review', desc: 'Final check' }
                                        ].map((stepItem, idx) => (
                                            <div key={stepItem.id} className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                    step > stepItem.id 
                                                        ? 'bg-green-500 text-white' 
                                                        : step === stepItem.id 
                                                            ? 'bg-primary-600 text-white' 
                                                            : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                    {step > stepItem.id ? (
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        stepItem.id
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-medium ${
                                                        step >= stepItem.id ? 'text-gray-900' : 'text-gray-500'
                                                    }`}>
                                                        {stepItem.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{stepItem.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(((step - 1) / 4) * 100)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-600 transition-all duration-500 ease-out"
                                                style={{ width: `${((step - 1) / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step-specific Notices */}
                                <div className="flex-1 min-h-0">
                                </div>

                                {/* Tips */}
                                <div className="bg-gray-50 rounded-xl p-3 flex-shrink-0">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
                                        <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Pro Tips
                                    </h4>
                                    <ul className="text-gray-600 text-xs space-y-0.5">
                                        <li>• Properties with photos get 60% more views</li>
                                        <li>• Detailed descriptions increase inquiries</li>
                                        <li>• Competitive pricing attracts quality tenants</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Form */}
                        <div className="flex-1 min-w-0">
                            <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col">
                                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                                    <div className="flex-1 overflow-y-auto p-6">
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Property Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                                errors.title 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                            } outline-none text-sm`}
                                            placeholder="e.g. Spacious 2BHK Apartment in Prime Location"
                                            maxLength="100"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.title}
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            Write a descriptive title (10-100 characters)
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Property Type <span className="text-red-500">*</span>
                                            </label>
                                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                                errors.propertyType 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                            } outline-none bg-white text-sm`}>
                                                <option value="apartment">Apartment</option>
                                                <option value="house">Independent House</option>
                                                <option value="villa">Villa</option>
                                                <option value="pg">PG</option>
                                            </select>
                                            {errors.propertyType && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.propertyType}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <select name="city" value={formData.city} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                                errors.city 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                            } outline-none bg-white text-sm`}>
                                                <option value="">Select City</option>
                                                {GUJARAT_CITIES.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Area / Locality <span className="text-red-500">*</span>
                                            </label>
                                            <input type="text" name="area" value={formData.area} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                                errors.area 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                            } outline-none text-sm`} placeholder="e.g. Baner, Satellite, Vastrapur" />
                                            {errors.area && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.area}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1">
                                                Specify the neighborhood or area name
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Monthly Rent (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <input type="number" name="rent" value={formData.rent} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                                errors.rent 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                            } outline-none text-sm`} placeholder="15000" min="1000" max="1000000" />
                                            {errors.rent && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.rent}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1">
                                                Enter monthly rent amount
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Deposit (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                                errors.deposit 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                            } outline-none text-sm`} placeholder="30000" min="1000" max="5000000" />
                                            {errors.deposit && (
                                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.deposit}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1">
                                                Security deposit amount
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Available From <span className="text-red-500">*</span>
                                        </label>
                                        <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                                            errors.availableFrom 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                                        } outline-none text-sm`} min={new Date().toISOString().split('T')[0]} />
                                        {errors.availableFrom && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.availableFrom}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Photos <span className="text-red-500">*</span>
                                            <span className="text-sm font-normal text-gray-500 ml-2">
                                                (Minimum 3 photos required)
                                            </span>
                                        </label>
                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative ${
                                            errors.photoFiles 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}>
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handlePhotoUpload} 
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                            />
                                            <div className="text-gray-500">
                                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <p className="font-medium">Click to upload photos</p>
                                                <p className="text-xs mt-1">or drag and drop here</p>
                                                <p className="text-xs mt-2 text-blue-600">
                                                    📸 Upload 3-5 high-quality photos • JPG, PNG, WebP • Max 5MB each
                                                </p>
                                            </div>
                                        </div>
                                        {formData.photoFiles.length > 0 && (
                                            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                                {formData.photoFiles.map((file, idx) => (
                                                    <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(idx)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {errors.photoFiles && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {errors.photoFiles}
                                            </p>
                                        )}
                                        {formData.photoFiles.length > 0 && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className={`w-full bg-gray-200 rounded-full h-2 ${formData.photoFiles.length >= 3 ? 'bg-green-200' : ''}`}>
                                                    <div 
                                                        className={`h-2 rounded-full transition-all ${formData.photoFiles.length >= 3 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.min((formData.photoFiles.length / 3) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-sm font-medium ${formData.photoFiles.length >= 3 ? 'text-green-600' : 'text-blue-600'}`}>
                                                    {formData.photoFiles.length}/3
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Tenant</label>
                                        <div className="flex gap-4 flex-wrap">
                                            {['any', 'male', 'female', 'family'].map((p) => (
                                                <label key={p} className={`cursor-pointer px-4 py-2 rounded-lg border-2 font-medium transition-all ${formData.genderPreference === p ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                    <input type="radio" name="genderPreference" value={p} checked={formData.genderPreference === p} onChange={handleChange} className="hidden" />
                                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {['wifi', 'ac', 'parking', 'security', 'gym', 'swimming_pool', 'power_backup', 'elevator', 'meals', 'laundry', 'water_supply', 'playground'].map((amenity) => (
                                                <label key={amenity} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.amenities.includes(amenity)}
                                                        onChange={() => handleAmenityToggle(amenity)}
                                                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                                                    />
                                                    <span className="text-gray-700 font-medium capitalize">{amenity.replace('_', ' ')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">House Rules (One per line)</label>
                                        <textarea
                                            name="rules"
                                            value={formData.rules}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                                            placeholder="No smoking&#10;No pets&#10;Quiet hours after 10 PM"
                                        ></textarea>
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
                                </div>
                            )}

                                    </div>

                                    <div className="p-4 border-t border-gray-100 flex justify-between flex-shrink-0 bg-white">
                                        {step > 1 ? (
                                            <button type="button" onClick={prevStep} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                                                Back
                                            </button>
                                        ) : (
                                            <div></div>
                                        )}

                                        {step < 4 ? (
                                            <button 
                                                type="button" 
                                                onClick={nextStep} 
                                                className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all text-sm"
                                            >
                                                Next Step
                                            </button>
                                        ) : (
                                            <button 
                                                type="submit" 
                                                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all disabled:opacity-50 text-sm"
                                                disabled={submitting}
                                            >
                                                {submitting ? 'Publishing...' : 'Confirm & Publish'}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
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
