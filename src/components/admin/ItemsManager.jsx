// frontend/src/components/admin/ItemsManager.jsx

import { useState, useEffect } from 'react';
import { api } from '../../api';
import { ItemForm } from './ItemForm';
import { ItemTable } from './ItemTable';
import { IoSearchOutline, IoAddOutline, IoFilterOutline } from 'react-icons/io5';

export function ItemsManager() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');

    useEffect(() => { loadAll(); }, []);

    async function loadAll() {
        try {
            setLoading(true);
            const [itemsRes, catsRes] = await Promise.all([
                api.getAdminItems(),
                api.getCategories(),
            ]);
            setItems(itemsRes.items);
            setCategories(catsRes.categories);
        } catch (err) {
            alert('Error cargando datos: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggle(id) {
        try {
            await api.toggleItem(id);
            setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async function handleDelete(id, name) {
        if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        try {
            await api.deleteItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async function handleSave(data) {
        try {
            if (editing) {
                await api.updateItem(editing.id, data);
            } else {
                await api.createItem(data);
            }
            setShowForm(false);
            setEditing(null);
            await loadAll();
        } catch (err) {
            alert('Error guardando: ' + err.message);
        }
    }

    const filteredItems = items
        .filter(i => catFilter === 'all' || i.category_id === catFilter)
        .filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.category_name?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <>
            {/* Barra de herramientas */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar plato..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-52"
                    />
                </div>
                <div className="relative">
                    <IoFilterOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select
                        value={catFilter}
                        onChange={e => setCatFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none"
                    >
                        <option value="all">Todas las categorías</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={() => { setEditing(null); setShowForm(true); }}
                    className="ml-auto flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors"
                >
                    <IoAddOutline size={16} />
                    Nuevo plato
                </button>
            </div>

            <ItemTable
                items={filteredItems}
                loading={loading}
                onToggle={handleToggle}
                onEdit={(item) => { setEditing(item); setShowForm(true); }}
                onDelete={handleDelete}
            />

            {showForm && (
                <ItemForm
                    item={editing}
                    categories={categories}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                />
            )}
        </>
    );
}