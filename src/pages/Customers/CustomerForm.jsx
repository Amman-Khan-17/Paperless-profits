import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customersAPI } from '../../services/customers';
import { useToast } from '../../context/ToastContext'; // Use toast
import { validation } from '../../utils/validation';
import '../Books/BookForm.css';

const CustomerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id && id !== 'new';
    const toast = useToast(); // Initialize toast

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });

    useEffect(() => {
        if (isEditMode) {
            customersAPI.getCustomerById(id).then(data => {
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address || '',
                    city: data.city || '',
                    postalCode: data.postal_code || '', // Map snake_case to camelCase for form
                });
            }).catch(err => console.error(err));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validation.isValidName(formData.name)) {
            toast.error("Name contains invalid characters (numbers not allowed)."); // Now using toast
            return;
        }

        if (formData.city && !validation.isValidName(formData.city)) {
            toast.error("City contains invalid characters.");
            return;
        }

        if (!validation.isValidPhone(formData.phone)) {
            toast.error("Invalid phone number format.");
            return;
        }

        const customerData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            postal_code: formData.postalCode.trim(), // Map camelCase to snake_case
        };

        try {
            if (isEditMode) {
                await customersAPI.updateCustomer(id, customerData);
            } else {
                await customersAPI.createCustomer(customerData);
            }
            navigate('/customers');
        } catch (error) {
            console.error("Failed to save customer", error);
            toast.error("Failed to save customer"); // Use toast
        }
    };

    const handleCancel = () => {
        navigate('/customers');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{isEditMode ? '✏️ Edit Customer' : '➕ Add New Customer'}</h1>
                <p>{isEditMode ? 'Update customer information' : 'Add a new customer'}</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="data-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter customer name"
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
                                placeholder="customer@email.com"
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
                            {isEditMode ? 'Update Customer' : 'Add Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;
