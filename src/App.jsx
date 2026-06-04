import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { POSPage } from './pages/POSPage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Página de login - pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Panel cajero — requiere login (cualquier rol) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <POSPage />
                </ProtectedRoute>
              }
            />

            {/* Historial de pedidos — requiere login */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* Panel admin — solo rol 'admin' */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}