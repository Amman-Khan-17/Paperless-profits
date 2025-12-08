import api from './api';

export const customersAPI = {
    // Get all customers
    getCustomers: async () => {
        const response = await api.get('/customers');
        return response.data;
    },

    // Get single customer by ID
    getCustomerById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    // Create new customer
    createCustomer: async (customerData) => {
        const response = await api.post('/customers', customerData);
        return response.data;
    },

    // Update existing customer
    updateCustomer: async (id, customerData) => {
        const response = await api.put(`/customers/${id}`, customerData);
        return response.data;
    },

    // Delete customer
    deleteCustomer: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    },
};

// Dummy data for testing without backend
export const dummyCustomers = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '555-0101',
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        totalOrders: 12,
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '555-0102',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        postalCode: '90001',
        totalOrders: 8,
    },
    {
        id: 3,
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        phone: '555-0103',
        address: '789 Pine Rd',
        city: 'Chicago',
        postalCode: '60601',
        totalOrders: 15,
    },
];
