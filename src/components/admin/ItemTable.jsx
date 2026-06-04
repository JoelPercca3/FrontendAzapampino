// frontend/src/components/admin/ItemTable.jsx

import { ItemRow } from './ItemRow';
import { IoRefreshOutline } from 'react-icons/io5';

export function ItemTable({ items, loading, onToggle, onEdit, onDelete }) {
    if (loading) {
        return (
            <div className="flex justify-center py-16 text-gray-400 gap-3">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-xs text-gray-500 uppercase tracking-wider">
                        <th className="text-left px-4 py-3 font-medium">Imagen</th>
                        <th className="text-left px-4 py-3 font-medium">Plato</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell font-medium">Categoría</th>
                        <th className="text-left px-4 py-3 hidden lg:table-cell font-medium">Variantes</th>
                        <th className="text-right px-4 py-3 font-medium">Precio</th>
                        <th className="text-center px-4 py-3 font-medium">Estado</th>
                        <th className="text-right px-4 py-3 font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-12 text-gray-400">
                                No hay platos
                            </td>
                        </tr>
                    ) : (
                        items.map(item => (
                            <ItemRow
                                key={item.id}
                                item={item}
                                onToggle={onToggle}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}