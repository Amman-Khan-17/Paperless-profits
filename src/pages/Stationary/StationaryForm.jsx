import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { stationaryAPI } from '../../services/stationary';
import { useToast } from '../../context/ToastContext';
import { validation } from '../../utils/validation';
import '../Books/BookForm.css';

const StationaryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';
    const toast = useToast();

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
            stationaryAPI.getStationaryById(id).then(data => {
                setFormData({
                    name: data.name,
                    category: data.category || '',
                    price: data.price,
                    stock: data.stock,
                    supplier: data.supplier || '',
                    description: '', // Not in DB
                });
            }).catch(err => {
                console.error(err);
                toast.error("Failed to fetch item details.");
            });
        }
    }, [id, isEditMode, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(formData.price) < 0 || parseInt(formData.stock) < 0) {
            toast.error("Price and Stock cannot be negative.");
            return;
        }

        if (!validation.hasTextContent(formData.name)) {
            toast.error("Item name must contain letters.");
            return;
        }

        // Exclude description as it is not in the database schema
        const stationaryData = {
            name: formData.name.trim(),
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            supplier: formData.supplier
        };

        try {
            if (isEditMode) {
                await stationaryAPI.updateStationary(id, stationaryData);
                toast.success("Item updated successfully! ✏️");
            } else {
                await stationaryAPI.createStationary(stationaryData);
                toast.success("New item added to inventory! 🎉");
            }
            navigate('/stationary');
        } catch (error) {
            console.error("Failed to save stationary item", error);
            toast.error("Failed to save item. Please check your inputs.");
        }
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
                                min="0"
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
                                min="0"
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
