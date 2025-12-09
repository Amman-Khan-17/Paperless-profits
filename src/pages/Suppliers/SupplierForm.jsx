import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { suppliersAPI } from '../../services/suppliers';
import { useToast } from '../../context/ToastContext';
import '../Books/BookForm.css';

const SupplierForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        totalSupplies: '', // New field
    });

    useEffect(() => {
        if (isEditMode) {
            suppliersAPI.getSupplierById(id).then(data => {
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address || '',
                    city: data.city || '',
                    postalCode: data.postal_code || '',
                    totalSupplies: data.total_supplies || 0, // Map from DB
                });
            }).catch(err => {
                console.error(err);
                toast.error("Failed to load supplier details.");
            });
        }
    }, [id, isEditMode, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const supplierData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            total_supplies: parseInt(formData.totalSupplies) || 0, // Map to Snake Case
        };

        try {
            if (isEditMode) {
                await suppliersAPI.updateSupplier(id, supplierData);
                toast.success("Supplier updated successfully! 🏢");
            } else {
                await suppliersAPI.createSupplier(supplierData);
                toast.success("New supplier added! 🎉");
            }
            navigate('/suppliers');
        } catch (error) {
            console.error("Failed to save supplier", error);
            toast.error("Failed to save supplier. Please check inputs.");
        }
    };

    const handleCancel = () => {
        navigate('/suppliers');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{isEditMode ? '✏️ Edit Supplier' : '➕ Add New Supplier'}</h1>
                <p>{isEditMode ? 'Update supplier information' : 'Add a new supplier'}</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="data-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="name">Company Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="supplier@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="phone">Phone *</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="555-0000"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="city">City</label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input
                                id="postalCode"
                                name="postalCode"
                                type="text"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="00000"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="totalSupplies">Total Supplies</label>
                            <input
                                id="totalSupplies"
                                name="totalSupplies"
                                type="number"
                                min="0"
                                value={formData.totalSupplies}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter full address"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {isEditMode ? 'Update Supplier' : 'Add Supplier'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupplierForm;
