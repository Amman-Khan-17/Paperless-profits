import api from './api';

export const ordersAPI = {
    // Get all orders
    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    // Get single order by ID
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Create new order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Update order status
    updateOrderStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },

    // Cancel order
    cancelOrder: async (id) => {
        const response = await api.patch(`/orders/${id}/cancel`);
        return response.data;
    },
};

// Dummy data for testing without backend
export const dummyOrders = [
    {
        id: 1,
        customerId: 1,
        customerName: 'John Smith',
        orderDate: '2024-12-01',
        totalAmount: 158.48,
        status: 'Completed',
        items: [
            { id: 1, name: 'Clean Code', type: 'Book', price: 45.99, quantity: 2, subtotal: 91.98 },
            { id: 2, name: 'A4 Paper Pack', type: 'Stationary', price: 12.99, quantity: 5, subtotal: 64.95 },
        ],
    },
    {
        id: 2,
        customerId: 2,
        customerName: 'Sarah Johnson',
        orderDate: '2024-12-05',
        totalAmount: 97.48,
        status: 'Pending',
        items: [
            { id: 1, name: 'The Pragmatic Programmer', type: 'Book', price: 42.50, quantity: 2, subtotal: 85.00 },
            { id: 2, name: 'Blue Ballpoint Pens', type: 'Stationary', price: 5.99, quantity: 2, subtotal: 11.98 },
        ],
    },
    {
        id: 3,
        customerId: 3,
        customerName: 'Michael Brown',
        orderDate: '2024-12-07',
        totalAmount: 229.46,
        status: 'Pending',
        items: [
            { id: 1, name: 'Design Patterns', type: 'Book', price: 54.99, quantity: 4, subtotal: 219.96 },
            { id: 2, name: 'Sticky Notes Set', type: 'Stationary', price: 8.50, quantity: 1, subtotal: 8.50 },
        ],
    },
];
