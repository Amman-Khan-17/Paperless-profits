import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

const AppLayout = () => {
  // We can safely useAuth here because it's wrapped by AuthProvider below
  // Note: AppLayout is a child of AuthProvider in the JSX structure below
  // But wait, useAuth requires AuthContext.
  // The structure below is: Toast -> Auth -> AppLayout.
  // So AppLayout is inside AuthProvider. This is correct.

  // However, we need to import useAuth to use it.
  const { isAuthenticated } = require('./context/AuthContext').useAuth();
  // Wait, standard import at top is better. 

  if (!isAuthenticated) {
    return <AppRoutes />;
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

// Re-importing useAuth correctly at top level to avoid issues
import { useAuth } from './context/AuthContext';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AppRoutes />;
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ProtectedLayout />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
