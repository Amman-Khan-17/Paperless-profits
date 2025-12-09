import { supabase } from '../lib/supabaseClient';

export const suppliersAPI = {
    // Get all suppliers
    getSuppliers: async () => {
        const { data, error } = await supabase.from('suppliers').select('*').order('id', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Get single supplier by ID
    getSupplierById: async (id) => {
        const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // Create new supplier
    createSupplier: async (supplierData) => {
        const { data, error } = await supabase.from('suppliers').insert([supplierData]).select().single();
        if (error) throw error;
        return data;
    },

    // Update existing supplier
    updateSupplier: async (id, supplierData) => {
        const { data, error } = await supabase.from('suppliers').update(supplierData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    // Delete supplier
    deleteSupplier: async (id) => {
        const { error } = await supabase.from('suppliers').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },
};

