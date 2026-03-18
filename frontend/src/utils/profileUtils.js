/**
 * Profile completeness utility functions
 */

/**
 * Check if user profile is complete for verification
 * @param {Object} user - User object from context
 * @returns {Object} - { isComplete: boolean, missingFields: string[], completionPercentage: number }
 */
export const checkProfileCompleteness = (user) => {
  if (!user) {
    return {
      isComplete: false,
      missingFields: ['All profile information'],
      completionPercentage: 0
    };
  }

  const requiredFields = [
    { key: 'full_name', label: 'Full Name', value: user.full_name },
    { key: 'email', label: 'Email', value: user.email },
    { key: 'phone_number', label: 'Phone Number', value: user.phone_number },
    { key: 'city', label: 'City', value: user.city },
    { key: 'occupation', label: 'Occupation', value: user.occupation },
    { key: 'age', label: 'Age', value: user.age },
    { key: 'bio', label: 'Bio/About', value: user.bio },
    { key: 'budget_min', label: 'Minimum Budget', value: user.budget_min },
    { key: 'budget_max', label: 'Maximum Budget', value: user.budget_max }
  ];

  const missingFields = [];
  let filledFields = 0;

  requiredFields.forEach(field => {
    const value = field.value;
    const isEmpty = value === null || value === undefined || value === '' || 
                   (typeof value === 'string' && value.trim() === '');
    
    if (isEmpty) {
      missingFields.push(field.label);
    } else {
      filledFields++;
    }
  });

  // Check lifestyle and interests (should have at least one each)
  const lifestyle = user.lifestyle ? JSON.parse(user.lifestyle || '[]') : [];
  const interests = user.interests ? JSON.parse(user.interests || '[]') : [];

  if (lifestyle.length === 0) {
    missingFields.push('Lifestyle preferences (at least 1)');
  } else {
    filledFields++;
  }

  if (interests.length === 0) {
    missingFields.push('Interests (at least 1)');
  } else {
    filledFields++;
  }

  // Gender preference is always considered complete since "Any" (null or empty string) is a valid default choice
  filledFields++; // Always count gender preference as filled
  
  const totalFields = requiredFields.length + 3; // +2 for lifestyle/interests, +1 for gender preference
  const completionPercentage = Math.round((filledFields / totalFields) * 100);
  const isComplete = missingFields.length === 0;

  return {
    isComplete,
    missingFields,
    completionPercentage,
    totalFields,
    filledFields
  };
};

/**
 * Get profile completion message
 * @param {Object} completeness - Result from checkProfileCompleteness
 * @returns {string} - User-friendly message
 */
export const getProfileCompletionMessage = (completeness) => {
  if (completeness.isComplete) {
    return "Your profile is complete! You can now verify your account.";
  }

  const { missingFields, completionPercentage } = completeness;
  
  if (missingFields.length === 1) {
    return `Your profile is ${completionPercentage}% complete. Please fill in: ${missingFields[0]}`;
  } else if (missingFields.length <= 3) {
    return `Your profile is ${completionPercentage}% complete. Please fill in: ${missingFields.join(', ')}`;
  } else {
    return `Your profile is ${completionPercentage}% complete. Please fill in ${missingFields.length} missing fields to verify your account.`;
  }
};

/**
 * Get the next required field to fill
 * @param {Object} completeness - Result from checkProfileCompleteness
 * @returns {string|null} - Next field to fill or null if complete
 */
export const getNextRequiredField = (completeness) => {
  if (completeness.isComplete || completeness.missingFields.length === 0) {
    return null;
  }
  return completeness.missingFields[0];
};