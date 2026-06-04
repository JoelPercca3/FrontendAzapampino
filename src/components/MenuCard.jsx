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
    <div className="group bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col border border-gray-200">
      {/* Contenedor de imagen */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="relative w-full pt-[75%] bg-gray-100 overflow-hidden cursor-pointer"
      >
        {item.image_url ? (
          <img
            src={`${UPLOADS_URL}${item.image_url}`}
            alt={item.name}
            onError={(e) => { e.target.src = '/placeholder-food.png'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            {item.icon ?? '🍽️'}
          </div>
        )}

        {/* Badge de descuento */}
        {discountPercent && (
          <span className="product-card-discount-badge-pizza-hut absolute top-2 left-2 z-10 shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </button>

      {/* Contenido inferior */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        {/* Título estilo Pizza Hut */}
        <h3 className="product-card-title-pizza-hut">
          {item.name}
        </h3>

        {/* Descripción estilo Pizza Hut */}
        {item.description && (
          <p className="product-card-description-pizza-hut">
            {item.description}
          </p>
        )}

        {/* Precios y acciones */}
        <div className="mt-auto pt-2">
          {hasVariants && showPicker ? (
            <div className="flex flex-col gap-2">
              <select
                className="w-full text-sm border border-gray-200 px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ borderRadius: "0px" }}
                value={selectedVariant}
                onChange={e => setSelected(e.target.value)}
              >
                <option value="">— Elige una opción —</option>
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
                  className="flex-1 text-sm bg-gray-200 text-gray-600 font-semibold py-2 hover:bg-gray-300 transition-colors"
                  style={{ borderRadius: "0px" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!selectedVariant}
                  className="flex-1 text-sm text-white font-semibold py-2 transition-colors"
                  style={{
                    backgroundColor: selectedVariant ? "#e4002b" : "#dfe1e2",
                    borderRadius: "0px",
                    cursor: selectedVariant ? "pointer" : "not-allowed"
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                {discountPercent && (
                  <div className="flex items-center gap-2">
                    <del className="product-card-original-price-pizza-hut">
                      S/ {Number(originalPrice).toFixed(2)}
                    </del>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="product-card-price-pizza-hut">
                    S/ {Number(item.price).toFixed(2)}
                  </span>
                  {discountPercent && (
                    <span className="text-xs text-green-600 font-medium">
                      Ahorra S/ {(originalPrice - item.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center justify-center bg-red-600 hover:bg-red-800 text-white font-bold w-10 h-10 transition-all duration-200 hover:scale-105 shadow-md"
                style={{ borderRadius: "0px" }}
                aria-label="Agregar producto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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