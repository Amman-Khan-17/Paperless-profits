import api from './api';

export const suppliersAPI = {
    // Get all suppliers
    getSuppliers: async () => {
        const response = await api.get('/suppliers');
        return response.data;
    },

    // Get single supplier by ID
    getSupplierById: async (id) => {
        const response = await api.get(`/suppliers/${id}`);
        return response.data;
    },

    // Create new supplier
    createSupplier: async (supplierData) => {
        const response = await api.post('/suppliers', supplierData);
        return response.data;
    },

    // Update existing supplier
    updateSupplier: async (id, supplierData) => {
        const response = await api.put(`/suppliers/${id}`, supplierData);
        return response.data;
    },

    // Delete supplier
    deleteSupplier: async (id) => {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    },
};

// Dummy data for testing without backend
export const dummySuppliers = [
    {
        id: 1,
        name: 'Office Depot',
        email: 'sales@officedepot.com',
        phone: '555-1001',
        address: '1000 Business Blvd',
        city: 'New York',
        postalCode: '10002',
        totalSupplies: 45,
    },
    {
        id: 2,
        name: 'Staples Inc.',
        email: 'wholesale@staples.com',
        phone: '555-1002',
        address: '2000 Commerce Dr',
        city: 'Boston',
        postalCode: '02101',
        totalSupplies: 38,
    },
    {
        id: 3,
        name: 'BookMaster Publishers',
        email: 'orders@bookmaster.com',
        phone: '555-1003',
        address: '3000 Publisher Way',
        city: 'San Francisco',
        postalCode: '94102',
        totalSupplies: 52,
    },
];
