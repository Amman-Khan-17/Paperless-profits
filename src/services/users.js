import { supabase } from '../lib/supabaseClient';

export const usersAPI = {
    // Login is handled by AuthContext but keeping this for reference or potential usage
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data.user;
    },

    // Logout
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get all users (profiles)
    getUsers: async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('username', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Get single user by ID
    getUserById: async (id) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create new user (Not supported via Client SDK for Admins)
    createUser: async (_userData) => {
        // Limitation: Admin cannot create users without signing out current user or using Service Role.
        throw new Error("User creation is not supported from the client-side. Please invite users from the Supabase Dashboard.");
    },

    // Update existing user (profile)
    updateUser: async (id, userData) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(userData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete user (profile only)
    deleteUser: async (id) => {
        // This only deletes the profile. The auth user will remain unless deleted via Dashboard.
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    },
};
