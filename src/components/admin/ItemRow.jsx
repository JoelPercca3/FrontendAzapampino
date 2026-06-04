import { IoPencilOutline, IoTrashOutline, IoCheckmarkCircle, IoEllipseOutline, IoImageOutline } from 'react-icons/io5';
import { UPLOADS_URL } from '../../api';

export function ItemRow({ item, onToggle, onEdit, onDelete }) {
    return (
        <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!item.available ? 'opacity-50' : ''}`}>
            <td className="px-4 py-2">
                {item.image_url ? (
                    <img
                        src={`${UPLOADS_URL}${item.image_url}`}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover bg-gray-100"
                    />
                ) : (
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <IoImageOutline size={14} className="text-gray-400" />
                    </div>
                )}
            </td>
            <td className="px-4 py-2">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                {item.description && (
                    <p className="text-xs text-gray-400 truncate max-w-xs">{item.description}</p>
                )}
            </td>
            <td className="px-4 py-2 hidden md:table-cell">
                <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5">
                    {item.category_name}
                </span>
            </td>
            <td className="px-4 py-2 hidden lg:table-cell text-xs text-gray-500">
                {item.variants?.length > 0
                    ? item.variants.map(v => v.name).join(', ')
                    : <span className="italic">Sin variantes</span>
                }
            </td>
            <td className="px-4 py-2 text-right font-semibold text-gray-900 text-sm">
                S/ {Number(item.price).toFixed(2)}
            </td>
            <td className="px-4 py-2 text-center">
                <button
                    onClick={() => onToggle(item.id)}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${item.available
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    {item.available ? <IoCheckmarkCircle size={10} /> : <IoEllipseOutline size={10} />}
                    {item.available ? 'Activo' : 'Inactivo'}
                </button>
            </td>
            <td className="px-4 py-2 text-right">
                <div className="flex items-center justify-end gap-0.5">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title="Editar"
                    >
                        <IoPencilOutline size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id, item.name)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar"
                    >
                        <IoTrashOutline size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
}