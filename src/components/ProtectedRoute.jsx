import { Navigate } from 'react-router-dom';  // ✅ Importar Navigate
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children, adminOnly = false }) {
    const { isLogged, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span className="text-gray-400 text-sm">Verificando sesión...</span>
                </div>
            </div>
        );
    }

    // ✅ Corregido: redirige a /login en lugar de renderizar LoginPage
    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <span className="text-5xl">🔒</span>
                <h2 className="text-gray-700 font-bold text-xl">Acceso restringido</h2>
                <p className="text-gray-400 text-sm">Solo los administradores pueden ver esta página.</p>
                <a href="/" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors">
                    Volver al panel
                </a>
            </div>
        );
    }

    return children;
}