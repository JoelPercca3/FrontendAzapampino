import { useCart } from '../context/CartContext.jsx';
import { UPLOADS_URL } from '../api';

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
      <div className="relative w-full pt-[75%] bg-gray-100 overflow-hidden">
        {combo.image_url ? (
          <img
            src={`${UPLOADS_URL}${combo.image_url}`}
            alt={combo.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            🎁
          </div>
        )}

        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10 shadow-sm">
          COMBO
        </span>

        {discountPercent && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 z-10 shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide line-clamp-2 min-h-[3rem]">
          {combo.name}
        </h3>

        {combo.description && (
          <p className="text-gray-500 text-xs line-clamp-2">
            {combo.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              {discountPercent && (
                <div className="flex items-center gap-2">
                  <del className="text-gray-400 text-xs">
                    S/ {Number(originalPrice).toFixed(2)}
                  </del>
                  <span className="text-xs text-green-600 font-medium">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <span className="text-red-600 font-bold text-xl">
                S/ {Number(combo.price).toFixed(2)}
              </span>
            </div>

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