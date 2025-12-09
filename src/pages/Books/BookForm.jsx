import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI } from '../../services/books';
import { useToast } from '../../context/ToastContext';
import './BookForm.css';

const BookForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';
    const toast = useToast();

    const [formData, setFormData] = useState({
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        category: '',
        price: '',
        stock: '',
        description: '',
    });

    useEffect(() => {
        if (isEditMode) {
            booksAPI.getBookById(id).then(data => {
                setFormData({
                    isbn: data.isbn,
                    title: data.title,
                    author: data.author,
                    publisher: data.publisher,
                    category: data.category || '',
                    price: data.price,
                    stock: data.stock,
                    description: '', // Not in DB
                });
            }).catch(err => {
                console.error(err);
                toast.error("Failed to fetch book details.");
            });
        }
    }, [id, isEditMode, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Exclude description as it is not in the database schema
        const bookData = {
            isbn: formData.isbn,
            title: formData.title,
            author: formData.author,
            publisher: formData.publisher,
            category: formData.category,
            price: formData.price,
            stock: formData.stock
        };

        try {
            if (isEditMode) {
                await booksAPI.updateBook(id, bookData);
                toast.success("Book updated successfully! 📚");
            } else {
                await booksAPI.createBook(bookData);
                toast.success("New book added to inventory! 🎉");
            }
            navigate('/books');
        } catch (error) {
            console.error("Failed to save book", error);
            toast.error("Failed to save book. Please check your inputs.");
        }
    };

    const handleCancel = () => {
        navigate('/books');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{isEditMode ? '✏️ Edit Book' : '➕ Add New Book'}</h1>
                <p>{isEditMode ? 'Update book information' : 'Add a new book to inventory'}</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="data-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="isbn">ISBN *</label>
                            <input
                                id="isbn"
                                name="isbn"
                                type="text"
                                value={formData.isbn}
                                onChange={handleChange}
                                placeholder="978-0-00-000000-0"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="title">Title *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter book title"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="author">Author *</label>
                            <input
                                id="author"
                                name="author"
                                type="text"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Enter author name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="publisher">Publisher *</label>
                            <input
                                id="publisher"
                                name="publisher"
                                type="text"
                                value={formData.publisher}
                                onChange={handleChange}
                                placeholder="Enter publisher name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="category">Category</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Fiction, Programming"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="price">Price *</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="stock">Stock Quantity *</label>
                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter book description (optional)"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {isEditMode ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
