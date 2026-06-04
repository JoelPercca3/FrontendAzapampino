import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('pos_token');
        if (token) {
            api.verify()
                .then(({ user: u }) => {
                    setUser(u);
                })
                .catch(() => {
                    localStorage.removeItem('pos_token');
                    localStorage.removeItem('pos_user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // ✅ Corregido: recibe token y lo guarda
    function login(userData, token) {
        setUser(userData);
        localStorage.setItem('pos_token', token);
        localStorage.setItem('pos_user', JSON.stringify(userData));
    }

    function logout() {
        localStorage.removeItem('pos_token');
        localStorage.removeItem('pos_user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLogged: !!user,
            isAdmin: user?.role === 'admin',
            loading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}