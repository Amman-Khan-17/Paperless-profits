import { supabase } from '../lib/supabaseClient';

export const ordersAPI = {
    // Get all orders with items
    getOrders: async () => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items (*)
            `)
            .order('order_date', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get single order by ID
    getOrderById: async (id) => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items (*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create new order
    createOrder: async (orderData) => {
        // Separate items and metadata
        const { items, ...order } = orderData;

        // 1. Create Order
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert([order])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Order Items
        if (items && items.length > 0) {
            const itemsToInsert = items.map(item => ({
                order_id: newOrder.id,
                product_id: item.id,
                name: item.name,
                type: item.type,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.subtotal
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsToInsert);

            if (itemsError) {
                console.error('Error creating items', itemsError);
                throw itemsError;
            }
        }

        return newOrder;
    },

    // Update order status
    updateOrderStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Cancel order
    cancelOrder: async (id) => {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'Cancelled' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
    // Delete order
    deleteOrder: async (id) => {
        // First delete items
        const { error: itemsError } = await supabase
            .from('order_items')
            .delete()
            .eq('order_id', id);

        if (itemsError) throw itemsError;

        // Then delete order
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },
};

