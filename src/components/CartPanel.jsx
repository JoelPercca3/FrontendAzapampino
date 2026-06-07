import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api.js';
import {
  IoReceiptOutline,
  IoCloseOutline,
  IoRemoveOutline,
  IoAddOutline,
  IoCashOutline,
  IoCardOutline,
  IoPhonePortraitOutline,
  IoWalletOutline,
  IoRestaurantOutline,
  IoPersonOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline
} from 'react-icons/io5';

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Efectivo', icon: <IoCashOutline size={20} className="text-emerald-600" />, activeIcon: <IoCashOutline size={20} className="text-white" /> },
  { value: 'card', label: 'Tarjeta', icon: <IoCardOutline size={20} className="text-blue-600" />, activeIcon: <IoCardOutline size={20} className="text-white" /> },
  { value: 'yape', label: 'Yape', icon: <IoPhonePortraitOutline size={20} className="text-purple-600" />, activeIcon: <IoPhonePortraitOutline size={20} className="text-white" /> },
  { value: 'plin', label: 'Plin', icon: <IoWalletOutline size={20} className="text-orange-600" />, activeIcon: <IoWalletOutline size={20} className="text-white" /> },
];

export function CartPanel({ onOrderSuccess }) {
  const {
    items, total, count,
    tableName, customerName, paymentMethod, notes,
    removeItem, updateQty, setField, clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    if (!items.length) return;
    setLoading(true);
    setError(null);
    try {
      const { order_id } = await api.createOrder({
        table_name: tableName,
        customer_name: customerName,
        payment_method: paymentMethod,
        notes,
        items: items.map(i => ({
          menu_item_id: i.menu_item_id,
          combo_id: i.combo_id,
          variant_id: i.variant_id,
          item_name: i.item_name,
          unit_price: i.unit_price,
          quantity: i.quantity,
        })),
      });

      await api.printOrder(order_id);
      clearCart();
      onOrderSuccess?.(order_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="w-[420px] bg-white border-l border-gray-200 flex flex-col h-full shadow-lg shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
          <IoReceiptOutline size={18} className="text-white" />
        </div>
        <h2 className="font-semibold text-gray-900 text-lg">Pedido actual</h2>
        {count > 0 && (
          <span className="ml-auto bg-gray-900 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>

      {/* Datos del cliente */}
      <div className="p-5 space-y-4 border-b border-gray-100">
        {/* Mesa */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
            NÚMERO DE MESA
          </label>
          <div className="relative">
            <IoRestaurantOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Ej: Mesa 5"
              value={tableName}
              onChange={e => setField('tableName', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Nombre del cliente */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
            NOMBRE DEL CLIENTE
          </label>
          <div className="relative">
            <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={customerName}
              onChange={e => setField('customerName', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Lista de ítems */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
            <IoReceiptOutline size={48} className="opacity-50" />
            <p className="text-sm">Agrega platos al pedido</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item._key} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">{item.item_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">S/ {Number(item.unit_price).toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => updateQty(item._key, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <IoRemoveOutline size={14} />
                </button>
                <span className="text-sm font-semibold w-5 text-center text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item._key, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <IoAddOutline size={14} />
                </button>
                <button
                  onClick={() => removeItem(item._key)}
                  className="w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center ml-1"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 space-y-4">
        {/* Método de pago - Iconos a color */}
        <div className="grid grid-cols-4 gap-2">
          {PAYMENT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setField('paymentMethod', opt.value)}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg border transition-all ${paymentMethod === opt.value
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {paymentMethod === opt.value ? opt.activeIcon : opt.icon}
              <span className={`text-xs font-medium ${paymentMethod === opt.value ? 'text-white' : 'text-gray-600'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {/* Notas */}
        <div className="relative">
          <IoCreateOutline className="absolute left-3 top-3 text-gray-400" size={16} />
          <textarea
            placeholder="Notas adicionales..."
            value={notes}
            onChange={e => setField('notes', e.target.value)}
            rows={2}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-300"
          />
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-medium text-gray-600">Total</span>
          <span className="text-2xl font-bold text-gray-900">S/ {total.toFixed(2)}</span>
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1">
            <IoTimeOutline size={12} /> {error}
          </p>
        )}

        <button
          onClick={handleConfirm}
          disabled={loading || items.length === 0}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-white font-medium rounded-lg py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <IoCheckmarkCircleOutline size={18} />
              Confirmar e Imprimir
            </>
          )}
        </button>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1 flex items-center justify-center gap-1"
          >
            <IoTrashOutline size={12} />
            Limpiar pedido
          </button>
        )}
      </div>
    </aside>
  );
}

