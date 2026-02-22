import api from './api';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.area) params.append('area', filters.area);
    if (filters.minRent) params.append('min_rent', filters.minRent);
    if (filters.maxRent) params.append('max_rent', filters.maxRent);
    if (filters.preferredTenant) params.append('preferred_tenant', filters.preferredTenant);
    if (filters.amenities && filters.amenities.length > 0) {
      // Backend expects comma-separated amenities in a single parameter
      params.append('amenities', filters.amenities.join(','));
    }
    
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (propertyData) => {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('property_title', propertyData.title);
    formData.append('property_type', propertyData.propertyType || 'apartment');
    formData.append('city', propertyData.city);
    formData.append('area_locality', propertyData.area);
    formData.append('monthly_rent', propertyData.rent);
    formData.append('deposit', propertyData.deposit);
    formData.append('available_from', propertyData.availableFrom);
    formData.append('preferred_tenant', propertyData.preferredTenant || 'any');
    
    // Add description if provided
    if (propertyData.description) {
      formData.append('description', propertyData.description);
    }
    
    // Add amenities as JSON array
    formData.append('amenities', JSON.stringify(propertyData.amenities || []));
    
    // Add house rules as JSON array
    formData.append('house_rules', JSON.stringify(propertyData.rules || []));
    
    // Add images
    if (propertyData.images && propertyData.images.length > 0) {
      propertyData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const formData = new FormData();
    
    // Add fields only if they exist - using backend field names
    if (propertyData.property_title) formData.append('property_title', propertyData.property_title);
    if (propertyData.property_type) formData.append('property_type', propertyData.property_type);
    if (propertyData.description) formData.append('description', propertyData.description);
    if (propertyData.monthly_rent) formData.append('monthly_rent', propertyData.monthly_rent);
    if (propertyData.deposit) formData.append('deposit', propertyData.deposit);
    if (propertyData.city) formData.append('city', propertyData.city);
    if (propertyData.area_locality) formData.append('area_locality', propertyData.area_locality);
    if (propertyData.available_from) formData.append('available_from', propertyData.available_from);
    if (propertyData.preferred_tenant) formData.append('preferred_tenant', propertyData.preferred_tenant);
    
    if (propertyData.amenities) {
      formData.append('amenities', JSON.stringify(propertyData.amenities));
    }
    
    if (propertyData.house_rules) {
      formData.append('house_rules', JSON.stringify(propertyData.house_rules));
    }
    
    // Add new images if provided
    if (propertyData.images && propertyData.images.length > 0) {
      propertyData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }
    
    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Contact property owner
  contactOwner: async (propertyId, message) => {
    const response = await api.post(`/properties/${propertyId}/contact`, {
      message: message || undefined,
    });
    return response.data;
  },

  // Report property
  reportProperty: async (propertyId, reason) => {
    const response = await api.post(`/properties/${propertyId}/report`, {
      reason,
    });
    return response.data;
  },

  // Track property view
  trackPropertyView: async (propertyId) => {
    try {
      const response = await api.post(`/properties/${propertyId}/track-view`);
      return response.data;
    } catch (error) {
      // Silently fail if tracking fails (non-critical)
      console.error('Failed to track view:', error);
      return null;
    }
  },

  // Check if user has access to owner contact details
  checkPropertyAccess: async (propertyId) => {
    try {
      const response = await api.get(`/properties/${propertyId}/check-access`);
      return response.data;
    } catch (error) {
      // User not authenticated or no access
      return { has_access: false };
    }
  },
};
