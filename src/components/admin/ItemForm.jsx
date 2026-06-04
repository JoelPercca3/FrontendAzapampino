import { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { VariantsSection } from './VariantsSection';

export function ItemForm({ item, categories, onSave, onClose }) {
    const [form, setForm] = useState({
        category_id: item?.category_id || (categories[0]?.id ?? ''),
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || '',
        image_url: item?.image_url || '',
        sort_order: item?.sort_order || 0,
        variants: item?.variants?.map(v => ({ name: v.name, price_modifier: v.price_modifier })) || [],
    });
    const [saving, setSaving] = useState(false);

    function setField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function addVariant() {
        setForm(prev => ({ ...prev, variants: [...prev.variants, { name: '', price_modifier: 0 }] }));
    }

    function updateVariant(idx, field, value) {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v),
        }));
    }

    function removeVariant(idx) {
        setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
    }

    async function handleSubmit() {
        if (!form.name.trim() || !form.price || !form.category_id) {
            alert('Nombre, precio y categoría son obligatorios');
            return;
        }
        setSaving(true);
        try {
            await onSave({ ...form, price: Number(form.price), sort_order: Number(form.sort_order) });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-800 text-lg">
                        {item ? `Editar: ${item.name}` : 'Nuevo plato'}
                    </h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Categoría */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                            Categoría *
                        </label>
                        <select
                            value={form.category_id}
                            onChange={e => setField('category_id', Number(e.target.value))}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                        </select>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                            Nombre del plato *
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setField('name', e.target.value)}
                            placeholder="Ej: Trucha Frita"
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Imagen */}
                    <ImageUploader
                        imageUrl={form.image_url}
                        onImageChange={(url) => setField('image_url', url)}
                        onImageRemove={() => setField('image_url', '')}
                    />

                    {/* Descripción */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e => setField('description', e.target.value)}
                            placeholder="Descripción breve del plato..."
                            rows={2}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    {/* Precio y orden */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                                Precio base (S/) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.50"
                                value={form.price}
                                onChange={e => setField('price', e.target.value)}
                                placeholder="0.00"
                                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                                Orden de aparición
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.sort_order}
                                onChange={e => setField('sort_order', e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>
                    </div>

                    {/* Variantes */}
                    <VariantsSection
                        variants={form.variants}
                        onAdd={addVariant}
                        onUpdate={updateVariant}
                        onRemove={removeVariant}
                    />
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-white font-semibold text-sm rounded-xl px-6 py-2 transition-colors"
                    >
                        {saving ? 'Guardando...' : item ? '💾 Guardar cambios' : '✅ Crear plato'}
                    </button>
                </div>
            </div>
        </div>
    );
}