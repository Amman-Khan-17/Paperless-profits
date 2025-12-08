import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { dummyOrders } from '../../services/orders';
import '../Books/BookList.css';
import './OrderList.css';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(dummyOrders);
    }, []);

    const columns = [
        { key: 'id', label: 'Order ID' },
        { key: 'customerName', label: 'Customer' },
        {
            key: 'orderDate',
            label: 'Order Date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            key: 'totalAmount',
            label: 'Total',
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (status) => (
                <span className={`status-badge status-${status.toLowerCase()}`}>
                    {status}
                </span>
            ),
        },
    ];

    const handleView = (order) => {
        navigate(`/orders/${order.id}`);
    };

    const handleCancel = (order) => {
        if (order.status === 'Completed') {
            alert('Cannot cancel a completed order');
            return;
        }

        if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
            setOrders(
                orders.map((o) =>
                    o.id === order.id ? { ...o, status: 'Cancelled' } : o
                )
            );
        }
    };

    const handleAdd = () => {
        navigate('/orders/new');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🧾 Orders</h1>
                <p>View and manage customer orders</p>
            </div>

            <Table
                columns={columns}
                data={orders}
                onEdit={handleView}
                onDelete={handleCancel}
                onAdd={handleAdd}
                addButtonText="Create New Order"
            />
        </div>
    );
};

export default OrderList;
