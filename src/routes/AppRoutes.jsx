import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Auth
import Login from '../pages/Login';

// Dashboard
import Dashboard from '../pages/Dashboard';

// Books
import BookList from '../pages/Books/BookList';
import BookForm from '../pages/Books/BookForm';

// Stationary
import StationaryList from '../pages/Stationary/StationaryList';
import StationaryForm from '../pages/Stationary/StationaryForm';

// Customers
import CustomerList from '../pages/Customers/CustomerList';
import CustomerForm from '../pages/Customers/CustomerForm';

// Suppliers
import SupplierList from '../pages/Suppliers/SupplierList';
import SupplierForm from '../pages/Suppliers/SupplierForm';

// Users
import UserList from '../pages/Users/UserList';
import UserForm from '../pages/Users/UserForm';

// Orders
import OrderList from '../pages/Orders/OrderList';
import OrderCreate from '../pages/Orders/OrderCreate';
import OrderDetails from '../pages/Orders/OrderDetails';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Books Routes */}
            <Route
                path="/books"
                element={
                    <ProtectedRoute>
                        <BookList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/books/:id"
                element={
                    <ProtectedRoute>
                        <BookForm />
                    </ProtectedRoute>
                }
            />

            {/* Stationary Routes */}
            <Route
                path="/stationary"
                element={
                    <ProtectedRoute>
                        <StationaryList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stationary/:id"
                element={
                    <ProtectedRoute>
                        <StationaryForm />
                    </ProtectedRoute>
                }
            />

            {/* Customers Routes */}
            <Route
                path="/customers"
                element={
                    <ProtectedRoute>
                        <CustomerList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customers/:id"
                element={
                    <ProtectedRoute>
                        <CustomerForm />
                    </ProtectedRoute>
                }
            />

            {/* Suppliers Routes */}
            <Route
                path="/suppliers"
                element={
                    <ProtectedRoute>
                        <SupplierList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/suppliers/:id"
                element={
                    <ProtectedRoute>
                        <SupplierForm />
                    </ProtectedRoute>
                }
            />

            {/* Users Routes (Owner Only) */}
            <Route
                path="/users"
                element={
                    <ProtectedRoute ownerOnly>
                        <UserList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users/:id"
                element={
                    <ProtectedRoute ownerOnly>
                        <UserForm />
                    </ProtectedRoute>
                }
            />

            {/* Orders Routes */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrderList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/new"
                element={
                    <ProtectedRoute>
                        <OrderCreate />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
