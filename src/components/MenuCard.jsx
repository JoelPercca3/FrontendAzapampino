import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { UPLOADS_URL } from '../api';

export function MenuCard({ item }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelected] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const hasVariants = item.variants?.length > 0;
  const discountPercent = item.discount_percent || null;
  const originalPrice = item.original_price || item.price;

  function handleAdd() {
    if (hasVariants && !selectedVariant) {
      setShowPicker(true);
      return;
    }
    const variant = selectedVariant
      ? item.variants.find(v => v.id === Number(selectedVariant))
      : null;

    addItem({
      menu_item_id: item.id,
      combo_id: null,
      variant_id: variant?.id ?? null,
      item_name: variant ? `${item.name} (${variant.name})` : item.name,
      unit_price: Number(item.price) + Number(variant?.price_modifier ?? 0),
    });

    setShowPicker(false);
    setSelected('');
  }

  return (
    <div className="group bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col border border-gray-200 rounded-lg">
      {/* Imagen */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="relative w-full pt-[65%] bg-gray-100 overflow-hidden"
      >
        {item.image_url ? (
          <img
            src={`${UPLOADS_URL}${item.image_url}`}
            alt={item.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gray-50">
            🍽️
          </div>
        )}
        {discountPercent && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
      </button>

      {/* Contenido */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-gray-400 text-xs line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="mt-2 pt-1">
          {hasVariants && showPicker ? (
            <div className="flex flex-col gap-2">
              <select
                className="w-full text-xs border border-gray-200 px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 rounded"
                value={selectedVariant}
                onChange={e => setSelected(e.target.value)}
              >
                <option value="">— Elige opción —</option>
                {item.variants.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                    {v.price_modifier > 0 && ` (+S/ ${Number(v.price_modifier).toFixed(2)})`}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPicker(false)}
                  className="flex-1 text-xs bg-gray-100 text-gray-600 font-medium py-1.5 hover:bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedVariant}
                  className={`flex-1 text-xs text-white font-medium py-1.5 rounded ${selectedVariant ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-200 cursor-not-allowed'}`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div>
                {discountPercent && (
                  <del className="text-gray-400 text-xs">
                    S/ {Number(originalPrice).toFixed(2)}
                  </del>
                )}
                <span className="font-bold text-gray-900 text-base">
                  S/ {Number(item.price).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white rounded-lg w-8 h-8 transition-all"
                aria-label="Agregar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14 8a.5.5 0 0 1-.5.5h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 1 1 0-1h5v-5a.5.5 0 1 1 1 0v5h5a.5.5 0 0 1 .5.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}