import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BookForm.css';

const BookForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';

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
            // In production, fetch book by ID
            // booksAPI.getBookById(id).then(setFormData);

            // Mock data for editing
            setFormData({
                isbn: '978-0-13-468599-1',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                publisher: 'Prentice Hall',
                category: 'Programming',
                price: '45.99',
                stock: '25',
                description: 'A handbook of agile software craftsmanship',
            });
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // In production, call create or update API
        // if (isEditMode) {
        //   booksAPI.updateBook(id, formData).then(() => navigate('/books'));
        // } else {
        //   booksAPI.createBook(formData).then(() => navigate('/books'));
        // }

        console.log('Submitting book:', formData);
        navigate('/books');
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
