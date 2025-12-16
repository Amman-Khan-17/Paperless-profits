export const validation = {
    // ISBN-10 or ISBN-13: 
    // Checks for 10 or 13 digits, allowing hyphens.
    // Enhanced to ensure it doesn't contain letters (except 'X' for ISBN-10 end).
    isValidISBN: (isbn) => {
        // Remove hyphens and spaces
        const cleanIsbn = isbn.replace(/[\s-]/g, '');
        // Check length and numeric content
        if (cleanIsbn.length === 10) {
            return /^\d{9}[\dX]$/.test(cleanIsbn);
        }
        if (cleanIsbn.length === 13) {
            return /^\d{13}$/.test(cleanIsbn);
        }
        return false;
    },

    // Name validation: 
    // Allow letters, spaces, hyphens, apostrophes. 
    // Reject strings containing numbers or symbols like @#$%.
    isValidName: (name) => {
        if (!name) return false;
        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(name)) return false;
        // Allowed: letters, spaces, ., -, '
        return /^[a-zA-Z\s.'-]+$/.test(name);
    },

    // Title validation:
    // User requested "No book name as numbers".
    // We enforce that it must contain at least one letter.
    hasTextContent: (text) => {
        if (!text) return false;
        return /[a-zA-Z]/.test(text);
    },

    // Phone validation:
    // Allow digits, spaces, -, +, (, )
    // Must have at least 7 digits.
    isValidPhone: (phone) => {
        if (!phone) return false;
        const phoneRegex = /^[\d\s()+-]{7,}$/;
        // Also ensure it has some digits
        const digits = phone.replace(/\D/g, '');
        return phoneRegex.test(phone) && digits.length >= 7;
    },

    // Email validation (standard regex)
    isValidEmail: (email) => {
        if (!email) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Username validation:
    // Alphanumeric, underscores, hyphens, min 3 chars.
    isValidUsername: (username) => {
        if (!username) return false;
        return /^[a-zA-Z0-9_-]{3,}$/.test(username);
    }
};
