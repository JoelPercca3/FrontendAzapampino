import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import {
    IoRestaurantOutline,
    IoPersonOutline,
    IoLockClosedOutline,
    IoLogInOutline,
    IoWarningOutline,
    IoArrowForwardOutline
} from 'react-icons/io5';

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Completa usuario y contraseña');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { token, user } = await api.login({ username, password });
            login(user, token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="bg-white shadow-xl w-full max-w-md rounded-xl overflow-hidden">

                {/* Header con icono y gradiente */}
                <div className="bg-gray-900 px-8 py-6 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IoRestaurantOutline size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Recreo Campestre
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Sistema de Caja
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Campo Usuario */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                            Usuario
                        </label>
                        <div className="relative">
                            <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="admin"
                                autoComplete="username"
                                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                            Contraseña
                        </label>
                        <div className="relative">
                            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            <IoWarningOutline size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Botón de ingreso */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-lg transition-all mt-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Ingresando...
                            </>
                        ) : (
                            <>
                                <IoLogInOutline size={18} />
                                Ingresar
                                <IoArrowForwardOutline size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer con versión */}
                <div className="px-8 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        Sistema POS © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}