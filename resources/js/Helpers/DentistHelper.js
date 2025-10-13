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

    // If the name already starts with "Dr.", return as is
    if (dentist.name.startsWith("Dr.")) {
        return dentist.name;
    }

    // Add "Dr." prefix for dentists
    if (dentist.role === "dentist") {
        return `Dr. ${dentist.name}`;
    }

    // Return name as is for non-dentists
    return dentist.name;
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
