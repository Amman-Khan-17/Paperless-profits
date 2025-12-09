import { supabase } from '../lib/supabaseClient';

export const booksAPI = {
    // Get all books
    getBooks: async () => {
        const { data, error } = await supabase.from('books').select('*').order('id', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Get single book by ID
    getBookById: async (id) => {
        const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // Create new book
    createBook: async (bookData) => {
        const { data, error } = await supabase.from('books').insert([bookData]).select().single();
        if (error) throw error;
        return data;
    },

    // Update existing book
    updateBook: async (id, bookData) => {
        const { data, error } = await supabase.from('books').update(bookData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    // Delete book
    deleteBook: async (id) => {
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },
};

