// frontend/src/components/admin/CategoryForm.jsx

import { useState } from 'react';
import { IoCloseOutline, IoSaveOutline, IoCreateOutline } from 'react-icons/io5';

export function CategoryForm({ category, onSave, onClose }) {
    const [form, setForm] = useState({
        name: category?.name || '',
        icon: category?.icon || '🍽️',
        sort_order: category?.sort_order || 0,
    });
    const [saving, setSaving] = useState(false);

    async function handleSubmit() {
        if (!form.name.trim()) {
            alert('El nombre es obligatorio');
            return;
        }
        setSaving(true);
        try {
            await onSave({ ...form, sort_order: Number(form.sort_order) });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <IoCreateOutline size={18} />
                        {category ? 'Editar categoría' : 'Nueva categoría'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <IoCloseOutline size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                Ícono
                            </label>
                            <input
                                type="text"
                                value={form.icon}
                                onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                                className="w-full text-2xl text-center border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                placeholder="Ej: Fondos"
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                            Orden de aparición
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.sort_order}
                            onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-500 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white font-medium text-sm rounded-lg px-5 py-2 transition-colors"
                    >
                        <IoSaveOutline size={14} />
                        {saving ? 'Guardando...' : category ? 'Guardar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    );
}