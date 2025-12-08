import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyCustomers } from '../../services/customers';
import { dummyBooks } from '../../services/books';
import { dummyStationary } from '../../services/stationary';
import '../Books/BookForm.css';
import './OrderCreate.css';

const OrderCreate = () => {
    const navigate = useNavigate();
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [itemType, setItemType] = useState('books');
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);

    const availableItems = itemType === 'books' ? dummyBooks : dummyStationary;

    const handleAddItem = () => {
        if (!selectedItem || quantity < 1) {
            alert('Please select an item and quantity');
            return;
        }

        const item = availableItems.find((i) => i.id === parseInt(selectedItem));
        if (!item) return;

        const newItem = {
            id: item.id,
            name: item.title || item.name,
            type: itemType === 'books' ? 'Book' : 'Stationary',
            price: item.price,
            quantity: parseInt(quantity),
            subtotal: item.price * parseInt(quantity),
        };

        setOrderItems([...orderItems, newItem]);
        setSelectedItem('');
        setQuantity(1);
    };

    const handleRemoveItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedCustomer) {
            alert('Please select a customer');
            return;
        }

        if (orderItems.length === 0) {
            alert('Please add at least one item');
            return;
        }

        const orderData = {
            customerId: selectedCustomer,
            items: orderItems,
            totalAmount: calculateTotal(),
        };

        console.log('Creating order:', orderData);
        navigate('/orders');
    };

    const handleCancel = () => {
        navigate('/orders');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>➕ Create New Order</h1>
                <p>Create a new customer order</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="data-form">
                    {/* Customer Selection */}
                    <div className="form-section">
                        <h3>Customer Information</h3>
                        <div className="form-field">
                            <label htmlFor="customer">Select Customer *</label>
                            <select
                                id="customer"
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                required
                            >
                                <option value="">-- Select Customer --</option>
                                {dummyCustomers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} - {customer.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Add Items Section */}
                    <div className="form-section">
                        <h3>Add Items</h3>
                        <div className="item-selector">
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Item Type</label>
                                    <div className="tab-toggle">
                                        <button
                                            type="button"
                                            className={itemType === 'books' ? 'active' : ''}
                                            onClick={() => setItemType('books')}
                                        >
                                            📚 Books
                                        </button>
                                        <button
                                            type="button"
                                            className={itemType === 'stationary' ? 'active' : ''}
                                            onClick={() => setItemType('stationary')}
                                        >
                                            ✏️ Stationary
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="item">Select Item</label>
                                    <select
                                        id="item"
                                        value={selectedItem}
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                    >
                                        <option value="">-- Select Item --</option>
                                        {availableItems.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.title || item.name} - ${item.price.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>

                                <div className="form-field">
                                    <label>&nbsp;</label>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="btn-add-item"
                                    >
                                        ➕ Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    {orderItems.length > 0 && (
                        <div className="form-section">
                            <h3>Order Items</h3>
                            <table className="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.type}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.subtotal.toFixed(2)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="btn-remove"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Order Summary */}
                    {orderItems.length > 0 && (
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Total Items:</span>
                                <span>{orderItems.length}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Create Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderCreate;
