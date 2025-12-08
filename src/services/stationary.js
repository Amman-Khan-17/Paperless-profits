import api from './api';

export const stationaryAPI = {
    // Get all stationary items
    getStationary: async () => {
        const response = await api.get('/stationary');
        return response.data;
    },

    // Get single stationary item by ID
    getStationaryById: async (id) => {
        const response = await api.get(`/stationary/${id}`);
        return response.data;
    },

    // Create new stationary item
    createStationary: async (stationaryData) => {
        const response = await api.post('/stationary', stationaryData);
        return response.data;
    },

    // Update existing stationary item
    updateStationary: async (id, stationaryData) => {
        const response = await api.put(`/stationary/${id}`, stationaryData);
        return response.data;
    },

    // Delete stationary item
    deleteStationary: async (id) => {
        const response = await api.delete(`/stationary/${id}`);
        return response.data;
    },
};

// Dummy data for testing without backend
export const dummyStationary = [
    {
        id: 1,
        name: 'A4 Paper Pack',
        category: 'Paper',
        price: 12.99,
        stock: 150,
        supplier: 'Office Depot',
    },
    {
        id: 2,
        name: 'Blue Ballpoint Pens (Pack of 10)',
        category: 'Writing',
        price: 5.99,
        stock: 200,
        supplier: 'Staples',
    },
    {
        id: 3,
        name: 'Sticky Notes Set',
        category: 'Organization',
        price: 8.50,
        stock: 85,
        supplier: 'Office Depot',
    },
];
