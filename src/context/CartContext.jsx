import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  tableName: '',
  customerName: '',
  paymentMethod: 'cash',
  notes: '',
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key      = `${action.item.menu_item_id ?? action.item.combo_id}-${action.item.variant_id ?? 'base'}`;
      const existing = state.items.find(i => i._key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._key === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, _key: key, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._key !== action.key) };
    case 'UPDATE_QTY':
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i._key !== action.key) };
      return { ...state, items: state.items.map(i => i._key === action.key ? { ...i, quantity: action.qty } : i) };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem    = item           => dispatch({ type: 'ADD_ITEM',    item });
  const removeItem = key            => dispatch({ type: 'REMOVE_ITEM', key });
  const updateQty  = (key, qty)     => dispatch({ type: 'UPDATE_QTY',  key, qty });
  const setField   = (field, value) => dispatch({ type: 'SET_FIELD',   field, value });
  const clearCart  = ()             => dispatch({ type: 'CLEAR' });

  const total = state.items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);
  const count = state.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, total, count, addItem, removeItem, updateQty, setField, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
