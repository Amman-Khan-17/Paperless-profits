import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { ordersAPI } from '../services/orders';
import { booksAPI } from '../services/books';
import { stationaryAPI } from '../services/stationary';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
    TrendingUp, DollarSign, ShoppingBag, BookOpen, AlertCircle, Clock, Package
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState('Owner');
    const [stats, setStats] = useState({
        earnings: 0,
        totalOrders: 0,
        booksCount: 0,
        stationaryCount: 0,
        monthlySales: [],
        dailySales: [],
        recentOrders: [],
        lowStockBooks: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsername = async () => {
            if (user?.id) {
                const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single();
                if (data?.username) setUsername(data.username);
            }
        };

        const fetchData = async () => {
            try {
                // Fetch all data
                const [ordersData, booksData, stationaryData] = await Promise.all([
                    ordersAPI.getOrders(),
                    booksAPI.getBooks(),
                    stationaryAPI.getStationary()
                ]);

                // Calculate KPI Stats
                const completedOrders = ordersData.filter(o => o.status === 'Completed');
                const totalEarnings = completedOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

                // Process Charts Data: Daily Sales
                const salesMap = {};
                completedOrders.forEach(order => {
                    const date = new Date(order.order_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    salesMap[date] = (salesMap[date] || 0) + parseFloat(order.total_amount || 0);
                });

                const salesChartData = Object.keys(salesMap).map(date => ({
                    name: date,
                    sales: salesMap[date]
                }));

                // Recent Orders (Top 5)
                const recentOrders = ordersData
                    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
                    .slice(0, 5);

                // Low Stock Alerts (Stock < 5)
                const lowStockBooks = booksData.filter(b => b.stock_quantity < 5);

                setStats({
                    earnings: totalEarnings,
                    totalOrders: completedOrders.length,
                    booksCount: booksData.length,
                    stationaryCount: stationaryData.length,
                    dailySales: salesChartData,
                    recentOrders,
                    lowStockBooks
                });

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsername();
        fetchData();
    }, [user]);

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}`}</p>
                    <p className="intro">${payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="loading-screen">Loading Analytics...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-analytics fade-in-up">
                <div>
                    <h1>Welcome back, {username}! 👋</h1>
                    <p className="subtitle">Here is what's happening with your bookstore today.</p>
                </div>
                <div className="date-badge">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                <div className="kpi-card card-purple delay-1">
                    <div className="kpi-icon"><DollarSign size={28} color="white" /></div>
                    <div className="kpi-info">
                        <h3>Total Earnings</h3>
                        <p>${stats.earnings.toLocaleString()}</p>
                    </div>
                </div>

                <div className="kpi-card card-blue delay-2">
                    <div className="kpi-icon"><ShoppingBag size={28} color="white" /></div>
                    <div className="kpi-info">
                        <h3>Total Orders</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="kpi-card card-orange delay-3">
                    <div className="kpi-icon"><BookOpen size={28} color="white" /></div>
                    <div className="kpi-info">
                        <h3>Books in Stock</h3>
                        <p>{stats.booksCount}</p>
                    </div>
                </div>

                <div className="kpi-card card-green delay-4">
                    <div className="kpi-icon"><TrendingUp size={28} color="white" /></div>
                    <div className="kpi-info">
                        <h3>Stationary Items</h3>
                        <p>{stats.stationaryCount}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Charts & Tables */}
            <div className="dashboard-main-grid">

                {/* Left Column: Charts */}
                <div className="charts-column">
                    <div className="chart-container delay-5">
                        <div className="chart-header">
                            <h3>📈 Sales Trend</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={stats.dailySales}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096' }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#667eea', strokeWidth: 2 }} />
                                    <Area type="monotone" dataKey="sales" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-container delay-6">
                        <h3>📊 Inventory Distribution</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={[
                                    { name: 'Books', count: stats.booksCount },
                                    { name: 'Stationary', count: stats.stationaryCount }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#F7FAFC' }} />
                                    <Bar dataKey="count" fill="#4facfe" radius={[8, 8, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts & Recent Orders */}
                <div className="info-column">

                    {/* Low Stock Alerts */}
                    <div className="info-card delay-7">
                        <h3><AlertCircle size={20} color="#e53e3e" /> Low Stock Alerts</h3>
                        {stats.lowStockBooks.length === 0 ? (
                            <p className="empty-state">All stock levels are healthy! ✅</p>
                        ) : (
                            <div className="alert-list">
                                {stats.lowStockBooks.map(book => (
                                    <div key={book.id} className="alert-item">
                                        <span className="alert-icon">⚠️</span>
                                        <div className="alert-content">
                                            <strong>{book.title}</strong>
                                            <span>Only {book.stock_quantity} left</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Orders */}
                    <div className="info-card delay-8">
                        <h3><Clock size={20} color="#718096" /> Recent Orders</h3>
                        <div className="recent-orders-list">
                            {stats.recentOrders.map(order => (
                                <div key={order.id} className="recent-order-item">
                                    <div className="order-icon-wrapper">
                                        <Package size={18} color="#4a5568" />
                                    </div>
                                    <div className="order-details">
                                        <strong>#{order.id}</strong>
                                        <span>{new Date(order.order_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </div>
                                    <div className="order-amount">
                                        ${order.total_amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
