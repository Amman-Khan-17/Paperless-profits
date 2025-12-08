import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Books/BookForm.css';

const StationaryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        supplier: '',
        description: '',
    });

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: 'A4 Paper Pack',
                category: 'Paper',
                price: '12.99',
                stock: '150',
                supplier: 'Office Depot',
                description: 'Premium white A4 paper, 500 sheets',
            });
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting stationary item:', formData);
        navigate('/stationary');
    };

    const handleCancel = () => {
        navigate('/stationary');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{isEditMode ? '✏️ Edit Stationary Item' : '➕ Add New Stationary Item'}</h1>
                <p>{isEditMode ? 'Update item information' : 'Add a new item to inventory'}</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="data-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="name">Item Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter item name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="category">Category</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Paper, Writing"
                            />
                        </div>
                    </div>

                    <div className="form-row">
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

                        <div className="form-field">
                            <label htmlFor="supplier">Supplier</label>
                            <input
                                id="supplier"
                                name="supplier"
                                type="text"
                                value={formData.supplier}
                                onChange={handleChange}
                                placeholder="Enter supplier name"
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
                            placeholder="Enter item description (optional)"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {isEditMode ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StationaryForm;
