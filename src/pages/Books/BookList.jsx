
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import Modal from '../../components/Modal'; // Import Modal
import { useToast } from '../../context/ToastContext'; // Import Toast
import { booksAPI } from '../../services/books';
import './BookList.css';

const BookList = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast(); // Initialize Toast

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await booksAPI.getBooks();
                setBooks(data);
            } catch (error) {
                console.error("Failed to fetch books", error);
                toast.error("Failed to load books inventory.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [toast]);

    const columns = [
        { key: 'isbn', label: 'ISBN' },
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'publisher', label: 'Publisher' },
        { key: 'category', label: 'Category' },
        {
            key: 'price',
            label: 'Price',
            render: (price) => `$${price.toFixed(2)} `,
        },
        { key: 'stock', label: 'Stock' },
    ];

    const handleEdit = (book) => {
        navigate(`/books/${book.id}`);
    };

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;
        setIsDeleting(true);

        try {
            await booksAPI.deleteBook(bookToDelete.id);
            setBooks(books.filter((b) => b.id !== bookToDelete.id));
            toast.success("Book deleted successfully! 🗑️");
            setIsModalOpen(false);
            setBookToDelete(null);
        } catch (error) {
            console.error("Failed to delete book", error);
            const msg = error?.message || "Failed to delete book.";
            if (msg.toLowerCase().includes("foreign key") || msg.toLowerCase().includes("constraint")) {
                toast.error("Cannot delete: Book has existing orders.");
            } else {
                toast.error(`Deletion failed: ${msg}`);
            }
            setIsModalOpen(false);
        } finally {
            setIsDeleting(false);
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
                onDelete={handleDeleteClick} // Use Modal Trigger
                onAdd={handleAdd}
                addButtonText="Add New Book"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Book?"
                message={`Are you sure you want to delete "${bookToDelete?.title}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default BookList;
