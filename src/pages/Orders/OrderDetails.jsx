import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyOrders } from '../../services/orders';
import './OrderDetails.css';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // In production, fetch order by ID
        const foundOrder = dummyOrders.find((o) => o.id === parseInt(id));
        setOrder(foundOrder);
    }, [id]);

    const handleCancel = () => {
        if (order.status === 'Completed') {
            alert('Cannot cancel a completed order');
            return;
        }

        if (window.confirm(`Are you sure you want to cancel this order?`)) {
            setOrder({ ...order, status: 'Cancelled' });
        }
    };

    const handleBack = () => {
        navigate('/orders');
    };

    if (!order) {
        return (
            <div className="page-container">
                <p>Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🧾 Order Details - #{order.id}</h1>
                <p>View complete order information</p>
            </div>

            <div className="order-details-container">
                {/* Order Information Card */}
                <div className="details-card">
                    <h3>Order Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Order ID:</span>
                            <span className="info-value">#{order.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Order Date:</span>
                            <span className="info-value">
                                {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer Information Card */}
                <div className="details-card">
                    <h3>Customer Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{order.customerName}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Customer ID:</span>
                            <span className="info-value">#{order.customerId}</span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="details-card">
                    <h3>Order Items</h3>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        <span className="item-type">{item.type}</span>
                                    </td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Summary */}
                <div className="details-card summary-card">
                    <h3>Order Summary</h3>
                    <div className="summary-section">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="details-actions">
                    <button onClick={handleBack} className="btn-back">
                        ← Back to Orders
                    </button>
                    {order.status === 'Pending' && (
                        <button onClick={handleCancel} className="btn-cancel-order">
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
