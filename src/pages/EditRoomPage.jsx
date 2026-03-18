import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GUJARAT_CITIES } from '../constants/cities';
import { propertyService } from '../services/propertyService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getImageUrl } from '../utils/imageUtils';

export const EditRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        propertyType: 'apartment',
        city: '',
        area: '',
        rent: '',
        deposit: '',
        availableFrom: '',
        genderPreference: 'any',
        amenities: [],
        rules: '',
        description: ''
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);

    useEffect(() => {
        fetchPropertyData();
    }, [id]);

    const fetchPropertyData = async () => {
        try {
            const property = await propertyService.getPropertyById(id);
            
            // Convert amenities array to lowercase with underscores
            const amenitiesFormatted = property.amenities?.map(a => 
                a.amenity_name || a
            ) || [];
            
            // Convert house rules array to string
            const rulesString = property.house_rules?.map(r => 
                r.rule_text || r
            ).join('\n') || '';
            
            setFormData({
                title: property.property_title || '',
                propertyType: property.property_type || 'apartment',
                city: property.city || '',
                area: property.area_locality || '',
                rent: property.monthly_rent || '',
                deposit: property.deposit || '',
                availableFrom: property.available_from || '',
                genderPreference: property.preferred_tenant || 'any',
                amenities: amenitiesFormatted,
                rules: rulesString,
                description: property.description || ''
            });
            
            // Set existing images
            setExistingImages(property.images || []);
        } catch (error) {
            showError('Failed to load property data');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingImages.length - imagesToRemove.length + newImages.length + files.length;
        
        if (totalImages > 5) {
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
        
        setNewImages(prev => [...prev, ...files]);
    };

    const removeExistingImage = (imageUrl) => {
        setImagesToRemove(prev => [...prev, imageUrl]);
    };

    const restoreExistingImage = (imageUrl) => {
        setImagesToRemove(prev => prev.filter(url => url !== imageUrl));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
            return;
        }

        // Validate minimum images
        const totalImages = existingImages.length - imagesToRemove.length + newImages.length;
        if (totalImages < 3) {
            showError('At least 3 images are required');
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
                property_title: formData.title,
                property_type: formData.propertyType,
                city: formData.city,
                area_locality: formData.area,
                monthly_rent: parseInt(formData.rent),
                deposit: parseInt(formData.deposit),
                available_from: formData.availableFrom,
                preferred_tenant: formData.genderPreference,
                amenities: formData.amenities,
                house_rules: rulesArray,
                description: formData.description,
                images: newImages, // New images to upload
                images_to_remove: imagesToRemove // Existing images to remove
            };

            await propertyService.updateProperty(id, propertyData);
            showSuccess('Property updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            showError(error.response?.data?.detail || 'Failed to update property. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col pt-32">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading property..." />
                </div>
            </div>
        );
    }

    const amenitiesList = [
        { value: 'wifi', label: 'WiFi' },
        { value: 'ac', label: 'AC' },
        { value: 'parking', label: 'Parking' },
        { value: 'power_backup', label: 'Power Backup' },
        { value: 'gym', label: 'Gym' },
        { value: 'swimming_pool', label: 'Swimming Pool' },
        { value: 'security', label: 'Security' },
        { value: 'lift', label: 'Lift' }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-20 pb-12 bg-gray-50">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-primary-600 mb-6 inline-flex items-center gap-2 font-semibold transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Edit Property</h1>
                            <p className="text-gray-600 mt-1">Update your property listing details</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Basic Information */}
                    <div className="bg-primary-50 px-8 py-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., Spacious 2BHK Apartment"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="pg">PG</option>
                                    <option value="villa">Villa</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Select City</option>
                                    {GUJARAT_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Area/Locality <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., Satellite, Vastrapur"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Images */}
                    <div className="bg-primary-50 px-8 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Property Images</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        {/* Current Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {existingImages.map((image, idx) => (
                                        <div key={idx} className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                            imagesToRemove.includes(image) 
                                                ? 'border-red-300 opacity-50' 
                                                : 'border-gray-200'
                                        }`}>
                                            <div className="aspect-square">
                                                <img 
                                                    src={getImageUrl(image)} 
                                                    alt={`Property ${idx + 1}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {imagesToRemove.includes(image) ? (
                                                <button
                                                    type="button"
                                                    onClick={() => restoreExistingImage(image)}
                                                    className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5 hover:bg-green-600 transition-colors"
                                                    title="Restore image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(image)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                                                    title="Remove image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                            {imagesToRemove.includes(image) && (
                                                <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                                                    <span className="text-red-600 font-bold text-sm">REMOVED</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Images */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {existingImages.length > 0 ? 'Add More Images' : 'Upload Images'}
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    (Minimum 3 images total required)
                                </span>
                            </h3>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageUpload} 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                />
                                <div className="text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-medium">Click to upload new photos</p>
                                    <p className="text-xs mt-1">or drag and drop here</p>
                                    <p className="text-xs mt-2 text-blue-600">
                                        📸 JPG, PNG, WebP • Max 5MB each • Up to 5 images total
                                    </p>
                                </div>
                            </div>

                            {/* New Images Preview */}
                            {newImages.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">New Images to Upload</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {newImages.map((file, idx) => (
                                            <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-green-200">
                                                <div className="aspect-square">
                                                    <img 
                                                        src={URL.createObjectURL(file)} 
                                                        alt={`New ${idx + 1}`} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                    NEW
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Image Count Summary */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-700 font-medium">
                                        Total Images: {existingImages.length - imagesToRemove.length + newImages.length} / 5
                                    </span>
                                    <span className={`font-medium ${
                                        existingImages.length - imagesToRemove.length + newImages.length >= 3 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {existingImages.length - imagesToRemove.length + newImages.length >= 3 
                                            ? '✓ Minimum requirement met' 
                                            : `Need ${3 - (existingImages.length - imagesToRemove.length + newImages.length)} more image(s)`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Availability */}
                    <div className="bg-primary-50 px-8 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Pricing & Availability</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monthly Rent (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="rent"
                                    value={formData.rent}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="10000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deposit (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="deposit"
                                    value={formData.deposit}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="20000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available From <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="availableFrom"
                                    value={formData.availableFrom}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tenant Preference */}
                    <div className="bg-primary-50 px-8 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Tenant Preference</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <select
                            name="genderPreference"
                            value={formData.genderPreference}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="any">Any</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="family">Family</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    {/* Amenities */}
                    <div className="bg-primary-50 px-8 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {amenitiesList.map(amenity => (
                                <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.value)}
                                        onChange={() => handleAmenityToggle(amenity.value)}
                                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">{amenity.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-primary-50 px-8 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Describe your property..."
                        />
                    </div>

                    {/* House Rules */}
                    <div className="bg-primary-50 px-8 py-6 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">House Rules</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <textarea
                            name="rules"
                            value={formData.rules}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter each rule on a new line&#10;e.g.,&#10;No smoking&#10;No pets&#10;Quiet hours after 10 PM"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-white hover:border-gray-400 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Update Property'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};
