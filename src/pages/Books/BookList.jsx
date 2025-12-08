import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { dummyBooks } from '../../services/books';
import './BookList.css';

const BookList = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // In production, replace with API call
        // booksAPI.getBooks().then(setBooks);
        setBooks(dummyBooks);
    }, []);

    const columns = [
        { key: 'isbn', label: 'ISBN' },
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'publisher', label: 'Publisher' },
        { key: 'category', label: 'Category' },
        {
            key: 'price',
            label: 'Price',
            render: (price) => `$${price.toFixed(2)}`,
        },
        { key: 'stock', label: 'Stock' },
    ];

    const handleEdit = (book) => {
        navigate(`/books/${book.id}`);
    };

    const handleDelete = (book) => {
        if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
            // In production, call API and refresh
            // booksAPI.deleteBook(book.id).then(() => {
            //   setBooks(books.filter(b => b.id !== book.id));
            // });
            setBooks(books.filter((b) => b.id !== book.id));
        }
    };

    const handleAdd = () => {
        navigate('/books/new');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📚 Books Inventory</h1>
                <p>Manage your book collection</p>
            </div>

            <Table
                columns={columns}
                data={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
                addButtonText="Add New Book"
            />
        </div>
    );
};

export default BookList;
