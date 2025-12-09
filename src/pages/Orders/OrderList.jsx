import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { ordersAPI } from '../../services/orders';
import { usersAPI } from '../../services/users';
import { useAuth } from '../../context/AuthContext';
import '../Books/BookList.css';
import './OrderList.css';

const OrderList = () => {
    const navigate = useNavigate();
    const { isOwner } = useAuth();
    const [orders, setOrders] = useState([]);
    const [profiles, setProfiles] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, profilesData] = await Promise.all([
                    ordersAPI.getOrders(),
                    usersAPI.getUsers()
                ]);

                // Create profile map
                const profileMap = {};
                profilesData.forEach(p => {
                    profileMap[p.id] = p.role;
                });

                setProfiles(profileMap);
                setOrders(ordersData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'id', label: 'Order ID' },
        { key: 'customer_name', label: 'Customer' },
        {
            key: 'order_date',
            label: 'Order Date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            key: 'total_amount',
            label: 'Total',
            render: (amount) => amount ? `$${amount.toFixed(2)}` : '$0.00',
        },
        {
            key: 'salesman_name',
            label: 'Salesman (Role)',
            render: (name, row) => {
                if (!name) return 'Owner';
                const role = profiles[row.salesman_id] || (name.includes('owner') ? 'Owner' : 'Salesman');
                return `${name} (${role})`;
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (status) => (
                <span className={`status-badge status-${status?.toLowerCase() || 'pending'}`}>
                    {status || 'Pending'}
                </span>
            ),
        },
    ];

    const handleView = (order) => {
        navigate(`/orders/${order.id}`);
    };

    const handleDelete = async (order) => {
        if (!isOwner) {
            alert("Only Owners can delete order history.");
            return;
        }

        if (window.confirm(`Are you sure you want to PERMANENTLY delete order #${order.id}? This action cannot be undone.`)) {
            try {
                await ordersAPI.deleteOrder(order.id);
                setOrders(orders.filter(o => o.id !== order.id));
            } catch (error) {
                console.error("Failed to delete order", error);
                alert("Failed to delete order");
            }
        }
    };

    const handleComplete = async (order) => {
        if (order.status !== 'Pending') return;

        if (window.confirm(`Mark order #${order.id} as Completed?`)) {
            try {
                await ordersAPI.updateOrderStatus(order.id, 'Completed');
                setOrders(
                    orders.map((o) =>
                        o.id === order.id ? { ...o, status: 'Completed' } : o
                    )
                );
            } catch (error) {
                console.error("Failed to complete order", error);
                alert("Failed to complete order");
            }
        }
    };

    const handleCancel = async (order) => {
        if (order.status === 'Completed') return;

        if (window.confirm(`Cancel order #${order.id}?`)) {
            try {
                await ordersAPI.cancelOrder(order.id);
                setOrders(
                    orders.map((o) =>
                        o.id === order.id ? { ...o, status: 'Cancelled' } : o
                    )
                );
            } catch (error) {
                console.error("Failed to cancel order", error);
                alert("Failed to cancel order");
            }
        }
    };

    const downloadReport = () => {
        if (orders.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = ["Order ID", "Date", "Customer", "Salesman", "Role", "Total", "Status"];
        const csvContent = orders.map(order => {
            const role = profiles[order.salesman_id] || 'Salesman';
            return [
                order.id,
                new Date(order.order_date).toLocaleDateString(),
                `"${order.customer_name}"`,
                `"${order.salesman_name || ''}"`,
                role,
                order.total_amount.toFixed(2),
                order.status
            ].join(",");
        }).join("\n");

        const blob = new Blob([headers.join(",") + "\n" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Prepare data with extra actions
    const ordersWithActions = orders.map(order => {
        const actions = [];

        // Complete Action (Pending only)
        if (order.status === 'Pending') {
            actions.push({
                icon: '✅',
                title: 'Complete Order',
                onClick: () => handleComplete(order),
                className: 'btn-complete'
            });

            // Cancel Action (Pending only)
            actions.push({
                icon: '❌',
                title: 'Cancel Order',
                onClick: () => handleCancel(order),
                className: 'btn-cancel-small' // Need to add style
            });
        }

        // Delete Action (Owner only, any status)
        if (isOwner) {
            actions.push({
                icon: '🗑️',
                title: 'Delete Permanently',
                onClick: () => handleDelete(order),
                className: 'btn-delete-perm'
            });
        }

        return { ...order, extraActions: actions };
    });

    const handleAdd = () => {
        navigate('/orders/new');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>🧾 Orders</h1>
                    <p>View and manage customer orders</p>
                </div>
                <button onClick={downloadReport} className="btn-secondary" style={{ marginLeft: 'auto', marginRight: '10px' }}>
                    📊 Download Report
                </button>
            </div>

            <Table
                columns={columns}
                data={ordersWithActions}
                onEdit={handleView}
                // we handle specific actions via extraActions now, so we can disable default Delete/Edit if needed
                // but Table uses onEdit for the "View" pencil, so we keep it. 
                // We remove onDelete here because we handle it via extraActions for granular control
                onAdd={handleAdd}
                addButtonText="Create New Order"
            />
        </div>
    );
};

export default OrderList;
