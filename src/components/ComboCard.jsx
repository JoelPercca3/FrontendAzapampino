import { useCart } from '../context/CartContext.jsx';

export function ComboCard({ combo }) {
  const { addItem } = useCart();
  const discountPercent = combo.discount_percent || null;
  const originalPrice = combo.original_price || combo.price;

  function handleAdd() {
    addItem({
      menu_item_id: null,
      combo_id: combo.id,
      variant_id: null,
      item_name: combo.name,
      unit_price: Number(combo.price),
    });
  }

  return (
    <div className="group bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border border-gray-200">
      {/* Imagen destacada para combos */}
      <div className="relative w-full pt-[75%] bg-gray-100 overflow-hidden">
        {combo.image_url ? (
          <img
            src={combo.image_url}
            alt={combo.name}
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            🎁
          </div>
        )}

        {/* Badge de "COMBO" - estilo Pizza Hut */}
        <span className="product-card-combo-badge-pizza-hut absolute top-2 left-2 z-10 shadow-sm">
          COMBO
        </span>

        {/* Badge de descuento si existe */}
        {discountPercent && (
          <span className="product-card-discount-badge-pizza-hut absolute top-2 right-2 z-10 shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        {/* Título estilo Pizza Hut */}
        <h3 className="product-card-title-pizza-hut">
          {combo.name}
        </h3>

        {/* Descripción */}
        {combo.description && (
          <p className="product-card-description-pizza-hut">
            {combo.description}
          </p>
        )}

        {/* Precio y botón */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              {discountPercent && (
                <div className="flex items-center gap-2">
                  <del className="product-card-original-price-pizza-hut">
                    S/ {Number(originalPrice).toFixed(2)}
                  </del>
                  <span className="text-xs text-green-600 font-medium">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <span className="product-card-price-pizza-hut">
                S/ {Number(combo.price).toFixed(2)}
              </span>
            </div>

            {/* Botón de agregar */}
            <button
              onClick={handleAdd}
              className="flex items-center justify-center bg-red-600 hover:bg-red-800 text-white font-bold w-10 h-10 transition-all duration-200 hover:scale-105 shadow-md"
              style={{ borderRadius: "0px" }}
              aria-label="Agregar combo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 8a.5.5 0 0 1-.5.5h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 1 1 0-1h5v-5a.5.5 0 1 1 1 0v5h5a.5.5 0 0 1 .5.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}