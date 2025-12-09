import { supabase } from '../lib/supabaseClient';

export const stationaryAPI = {
    // Get all stationary items
    getStationary: async () => {
        const { data, error } = await supabase.from('stationary').select('*').order('id', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Get single stationary item by ID
    getStationaryById: async (id) => {
        const { data, error } = await supabase.from('stationary').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // Create new stationary item
    createStationary: async (stationaryData) => {
        const { data, error } = await supabase.from('stationary').insert([stationaryData]).select().single();
        if (error) throw error;
        return data;
    },

    // Update existing stationary item
    updateStationary: async (id, stationaryData) => {
        const { data, error } = await supabase.from('stationary').update(stationaryData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    // Delete stationary item
    deleteStationary: async (id) => {
        const { error } = await supabase.from('stationary').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },
};

