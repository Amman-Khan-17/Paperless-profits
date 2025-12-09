
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../services/orders';
import './OrderDetails.css';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await ordersAPI.getOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (order.status === 'Completed' || order.status === 'Cancelled') {
            alert(`Order is already ${order.status}`);
            return;
        }

        if (window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
            try {
                await ordersAPI.updateOrderStatus(order.id, newStatus);
                setOrder({ ...order, status: newStatus });
            } catch (error) {
                console.error(`Failed to update order to ${newStatus}`, error);
                alert(`Failed to update order to ${newStatus}`);
            }
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
                                {new Date(order.order_date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
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
                            <span className="info-value">{order.customer_name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Customer ID:</span>
                            <span className="info-value">#{order.customer_id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Salesman:</span>
                            <span className="info-value">{order.salesman_name || 'N/A'}</span>
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
                            {order.items && order.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        <span className="item-type">{item.type}</span>
                                    </td>
                                    <td>${Number(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${Number(item.subtotal).toFixed(2)}</td>
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
                            <span>${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="details-actions">
                    <button onClick={handleBack} className="btn-back">
                        ← Back to Orders
                    </button>
                    <button onClick={() => window.print()} className="btn-print" style={{ backgroundColor: '#6b7280', color: 'white', marginRight: '10px' }}>
                        🖨️ Print Receipt
                    </button>
                    {order.status === 'Pending' && (
                        <>
                            <button onClick={() => handleStatusChange('Completed')} className="btn-complete-order" style={{ backgroundColor: '#28a745', color: 'white', marginRight: '10px' }}>
                                ✅ Complete Order
                            </button>
                            <button onClick={() => handleStatusChange('Cancelled')} className="btn-cancel-order">
                                ❌ Cancel Order
                            </button>
                        </>
                    )}
                </div>

                {/* Printable Receipt Area (Hidden by default, shown on print) */}
                <div className="printable-receipt">
                    <div className="receipt-header">
                        {/* Placeholder Logo - Replace src with actual logo URL or import */}
                        <div className="receipt-logo">
                            <span style={{ fontSize: '2rem' }}>📚</span>
                        </div>
                        <h2>Paperless Profits</h2>
                        <p>123 Bookstore Lane, Reading City</p>
                        <p>Tel: +1 234 567 890</p>
                    </div>
                    <div className="receipt-info">
                        <p>Order #: {order.id}</p>
                        <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                        <p>Salesman: {order.salesman_name || 'Owner'}</p>
                        <p>Customer: {order.customer_name}</p>
                    </div>
                    <hr />
                    <table className="receipt-items">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items && order.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${Number(item.price).toFixed(2)}</td>
                                    <td>${Number(item.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <div className="receipt-summary">
                        <div className="row">
                            <span>Total:</span>
                            <span>${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="receipt-footer">
                        <p>Thank you for your purchase!</p>
                        <p>Please come again.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
