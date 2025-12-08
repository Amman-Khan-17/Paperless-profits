import api from './api';

export const booksAPI = {
    // Get all books
    getBooks: async () => {
        const response = await api.get('/books');
        return response.data;
    },

    // Get single book by ID
    getBookById: async (id) => {
        const response = await api.get(`/books/${id}`);
        return response.data;
    },

    // Create new book
    createBook: async (bookData) => {
        const response = await api.post('/books', bookData);
        return response.data;
    },

    // Update existing book
    updateBook: async (id, bookData) => {
        const response = await api.put(`/books/${id}`, bookData);
        return response.data;
    },

    // Delete book
    deleteBook: async (id) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    },
};

// Dummy data for testing without backend
export const dummyBooks = [
    {
        id: 1,
        isbn: '978-0-13-468599-1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publisher: 'Prentice Hall',
        category: 'Programming',
        price: 45.99,
        stock: 25,
    },
    {
        id: 2,
        isbn: '978-0-13-468599-2',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        publisher: "O'Reilly",
        category: 'Programming',
        price: 42.50,
        stock: 18,
    },
    {
        id: 3,
        isbn: '978-0-13-468599-3',
        title: 'Design Patterns',
        author: 'Gang of Four',
        publisher: 'Addison-Wesley',
        category: 'Software Engineering',
        price: 54.99,
        stock: 12,
    },
];
