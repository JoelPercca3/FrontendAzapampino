// frontend/src/components/admin/CategoriesManager.jsx

import { useState, useEffect } from 'react';
import { api } from '../../api';
import { CategoryForm } from './CategoryForm';
import { IoAddOutline, IoRefreshOutline } from 'react-icons/io5';

export function CategoriesManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadCats(); }, []);

    async function loadCats() {
        try {
            setLoading(true);
            const res = await api.getCategories();
            setCategories(res.categories);
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(data) {
        try {
            if (editing) {
                await api.updateCategory(editing.id, data);
            } else {
                await api.createCategory(data);
            }
            setShowForm(false);
            setEditing(null);
            await loadCats();
        } catch (err) {
            alert('Error guardando: ' + err.message);
        }
    }

    return (
        <div className="h-full">
            <div className="flex justify-end mb-5">
                <button
                    onClick={() => { setEditing(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors"
                >
                    <IoAddOutline size={16} />
                    Nueva categoría
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16 text-gray-400 gap-3">
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Cargando...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <span className="text-3xl">{cat.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{cat.name}</p>
                                <p className="text-xs text-gray-400">Orden: {cat.sort_order}</p>
                            </div>
                            <button
                                onClick={() => { setEditing(cat); setShowForm(true); }}
                                className="text-xs text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <CategoryForm
                    category={editing}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                />
            )}
        </div>
    );
}