import { supabase } from '../lib/supabaseClient';

export const customersAPI = {
    // Get all customers with real-time order count
    getCustomers: async () => {
        const { data, error } = await supabase
            .from('customers')
            .select('*, orders(count)')
            .order('id', { ascending: true });

        if (error) throw error;

        // Flatten the structure: customers.orders[0].count -> customers.total_orders
        return data.map(customer => ({
            ...customer,
            total_orders: customer.orders ? customer.orders[0].count : 0
        }));
    },

    // Get single customer by ID
    getCustomerById: async (id) => {
        const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // Create new customer
    createCustomer: async (customerData) => {
        const { data, error } = await supabase.from('customers').insert([customerData]).select().single();
        if (error) throw error;
        return data;
    },

    // Update existing customer
    updateCustomer: async (id, customerData) => {
        const { data, error } = await supabase.from('customers').update(customerData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    // Delete customer
    deleteCustomer: async (id) => {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },
};

