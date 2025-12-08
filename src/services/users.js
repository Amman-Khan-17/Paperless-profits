import api from './api';

export const usersAPI = {
    // Login
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get all users (owner only)
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Get single user by ID
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Create new user (owner only)
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Update existing user (owner only)
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user (owner only)
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

// Dummy data for testing without backend
export const dummyUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@paperlessprofits.com',
        role: 'owner',
        status: 'Active',
    },
    {
        id: 2,
        username: 'sales_john',
        email: 'john@paperlessprofits.com',
        role: 'sales_man',
        status: 'Active',
    },
    {
        id: 3,
        username: 'sales_sarah',
        email: 'sarah@paperlessprofits.com',
        role: 'sales_man',
        status: 'Active',
    },
];

// Mock login function for testing without backend
export const mockLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                resolve({
                    id: 1,
                    username: 'admin',
                    email: 'admin@paperlessprofits.com',
                    role: 'owner',
                    token: 'mock-token-12345',
                });
            } else if (username === 'sales' && password === 'sales') {
                resolve({
                    id: 2,
                    username: 'sales_john',
                    email: 'john@paperlessprofits.com',
                    role: 'sales_man',
                    token: 'mock-token-67890',
                });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 500);
    });
};
