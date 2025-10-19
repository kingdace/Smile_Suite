/**
 * Helper functions for dentist-related operations
 */

/**
 * Get formatted dentist name with Dr. prefix
 * @param {Object} dentist - Dentist object
 * @param {string} dentist.name - Dentist name
 * @param {string} dentist.role - Dentist role
 * @returns {string} Formatted dentist name
 */
export const getDentistDisplayName = (dentist) => {
    if (!dentist || !dentist.name) {
        return "N/A";
    }

    // Clean the name and check if it already starts with "Dr." (case insensitive)
    const cleanName = dentist.name.trim();
    const nameLower = cleanName.toLowerCase();

    // If the name already starts with "Dr." (case insensitive), return as is
    if (nameLower.startsWith("dr.") || nameLower.startsWith("dr ")) {
        return cleanName;
    }

    // Add "Dr." prefix for dentists
    if (dentist.role === "dentist") {
        return `Dr. ${cleanName}`;
    }

    // Return name as is for non-dentists
    return cleanName;
};

/**
 * Get dentist name without prefix (for editing purposes)
 * @param {Object} dentist - Dentist object
 * @param {string} dentist.name - Dentist name
 * @returns {string} Dentist name without Dr. prefix
 */
export const getDentistNameWithoutPrefix = (dentist) => {
    if (!dentist || !dentist.name) {
        return "";
    }

    // Remove "Dr." prefix if present
    return dentist.name.replace(/^Dr\.\s*/, "");
};

/**
 * Check if a user is a dentist
 * @param {Object} user - User object
 * @param {string} user.role - User role
 * @returns {boolean} True if user is a dentist
 */
export const isDentist = (user) => {
    return user && user.role === "dentist";
};
