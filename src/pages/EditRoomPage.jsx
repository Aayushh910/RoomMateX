import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GUJARAT_CITIES } from '../constants/cities';
import { propertyService } from '../services/propertyService';

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
        } catch (error) {
            console.error('Failed to fetch property:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
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
                description: formData.description
            };

            await propertyService.updateProperty(id, propertyData);
            showSuccess('Property updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to update property:', error);
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
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading property...</p>
                    </div>
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
        <div className="min-h-screen flex flex-col pt-32 pb-12">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-500 hover:text-gray-900 mb-4 inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
                    <p className="text-gray-500 mt-2">Update your property listing details</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
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

                    {/* Pricing & Availability */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Availability</h2>
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
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tenant Preference</h2>
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
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
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
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
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
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
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
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Updating...' : 'Update Property'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};
