// frontend/src/components/admin/VariantsSection.jsx

import { IoAddOutline, IoCloseOutline } from 'react-icons/io5';

export function VariantsSection({ variants, onAdd, onUpdate, onRemove }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Variantes / porciones
                </label>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium"
                >
                    <IoAddOutline size={14} />
                    Agregar variante
                </button>
            </div>

            {variants.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Sin variantes — el plato tiene precio fijo</p>
            ) : (
                <div className="space-y-2">
                    {variants.map((v, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={v.name}
                                onChange={e => onUpdate(idx, 'name', e.target.value)}
                                placeholder="Ej: Porción grande"
                                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">+S/</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.50"
                                    value={v.price_modifier}
                                    onChange={e => onUpdate(idx, 'price_modifier', e.target.value)}
                                    className="w-20 text-sm border border-gray-200 rounded-lg pl-7 pr-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>
                            <button
                                onClick={() => onRemove(idx)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                            >
                                <IoCloseOutline size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}