# Paperless Profits - Bookstore Management System

A minimal, clean, and maintainable React + Vite frontend for bookstore management operations.

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)
![React Router](https://img.shields.io/badge/React_Router-6-ca4245?logo=react-router)

## 🚀 Features

- **🔐 Authentication** - Role-based access control (Owner/Sales)
- **📚 Books Management** - Complete inventory system for books
- **✏️ Stationary Management** - Track stationary items
- **👥 Customer Management** - Customer database with contact info
- **🏢 Supplier Management** - Supplier information and tracking
- **👤 User Management** - System user administration (Owner only)
- **🧾 Order Processing** - Create and manage customer orders
- **🎨 Modern UI** - Clean design with gradient themes and smooth animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Paperless_Profits.git
cd Paperless_Profits
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🔑 Test Accounts

**Owner Account** (Full Access):
- Username: `admin`
- Password: `admin`

**Sales Account** (Limited Access):
- Username: `sales`
- Password: `sales`

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, Sidebar, Table)
├── pages/           # Page components organized by module
│   ├── Books/
│   ├── Stationary/
│   ├── Customers/
│   ├── Suppliers/
│   ├── Users/
│   └── Orders/
├── routes/          # Routing configuration
├── context/         # React Context (Authentication)
└── services/        # API services and dummy data
```

## 🔌 API Integration

The app currently uses dummy data for testing. To connect to your backend:

1. Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

2. Replace dummy data calls with real API calls in page components

## 🎯 Key Modules

### Books & Stationary
- View inventory in searchable tables
- Add/Edit/Delete items
- Track pricing and stock levels

### Customers & Suppliers
- Manage contact information
- Track relationships and history

### Orders
- Create new orders with item selection
- Toggle between Books and Stationary
- View detailed order information
- Cancel pending orders

### Users (Owner Only)
- Create and manage system users
- Assign roles (Owner/Sales Person)
- Control user status (Active/Inactive)

## 🛡️ Security Features

- Protected routes with authentication
- Role-based access control
- Automatic token management
- Session persistence with localStorage

## 🎨 Design Highlights

- **Purple gradient theme** throughout the app
- **Card-based layouts** for better organization
- **Smooth animations** and hover effects
- **Responsive design** for all screen sizes
- **Consistent styling** across all modules

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🧪 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built as a minimal, production-ready frontend for bookstore management.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: This is the frontend only. You'll need to connect it to a backend API for production use.
