// frontend/src/components/admin/ItemRow.jsx

import { IoPencilOutline, IoTrashOutline, IoCheckmarkCircle, IoEllipseOutline, IoImageOutline } from 'react-icons/io5';

export function ItemRow({ item, onToggle, onEdit, onDelete }) {
    return (
        <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!item.available ? 'opacity-50' : ''}`}>
            <td className="px-4 py-3">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                        }}
                    />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <IoImageOutline size={18} className="text-gray-400" />
                    </div>
                )}
            </td>
            <td className="px-4 py-3">
                <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">{item.description}</p>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                    {item.category_name}
                </span>
            </td>
            <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">
                {item.variants?.length > 0
                    ? item.variants.map(v => v.name).join(', ')
                    : <span className="italic">Sin variantes</span>
                }
            </td>
            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                S/ {Number(item.price).toFixed(2)}
            </td>
            <td className="px-4 py-3 text-center">
                <button
                    onClick={() => onToggle(item.id)}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-colors ${item.available
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                >
                    {item.available ? <IoCheckmarkCircle size={12} /> : <IoEllipseOutline size={12} />}
                    {item.available ? 'Activo' : 'Inactivo'}
                </button>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Editar"
                    >
                        <IoPencilOutline size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id, item.name)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar"
                    >
                        <IoTrashOutline size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}