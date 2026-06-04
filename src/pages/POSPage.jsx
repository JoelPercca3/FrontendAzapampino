import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { MenuCard } from '../components/MenuCard.jsx';
import { ComboCard } from '../components/ComboCard.jsx';
import { CartPanel } from '../components/CartPanel.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  IoArrowBackOutline,
  IoSearchOutline,
  IoRefreshOutline,
  IoSpeedometerOutline,
  IoReceiptOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoCheckmarkCircleOutline,
  IoRestaurantOutline,
  IoPersonOutline,
  IoCardOutline,
  IoFastFoodOutline
} from 'react-icons/io5';

export function POSPage() {
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => { loadMenu(); }, []);

  async function loadMenu() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMenu();
      setMenu(data.menu);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOrderSuccess(orderId) {
    setLastOrderId(orderId);
    setTimeout(() => setLastOrderId(null), 4000);
  }

  const filteredMenu = menu
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat =>
      (activeCategory === 'all' || cat.id === activeCategory) && cat.items.length > 0
    );

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <IoRefreshOutline size={32} className="text-red-500" />
          </div>
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={loadMenu}
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg px-6 py-2 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel principal */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <IoRestaurantOutline size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-lg leading-tight">Recreo Campestre</h1>
              <p className="text-xs text-gray-500">Panel del Cajero</p>
            </div>
          </div>

          {/* Buscador */}
          <div className="flex-1 max-w-md mx-auto relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar plato o bebida..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Enlaces de navegación */}
          <div className="flex items-center gap-1 shrink-0">
            <NavLink href="/dashboard" icon={<IoSpeedometerOutline size={16} />} label="Dashboard" />
            <NavLink href="/orders" icon={<IoReceiptOutline size={16} />} label="Pedidos" />
            <NavLink href="/admin" icon={<IoSettingsOutline size={16} />} label="Admin" />
            <LogoutButton />
          </div>
        </header>

        {/* Tabs de categorías */}
        <nav className="bg-white border-b border-gray-200 px-6 flex gap-1 overflow-x-auto py-2">
          <CategoryTab
            label="Ver todo"
            slug="all"
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {menu.map(cat => (
            <CategoryTab
              key={cat.id}
              label={cat.name}
              slug={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </nav>

        {/* Toast de confirmación */}
        {lastOrderId && (
          <div className="mx-6 mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3 animate-in slide-in-from-top-2">
            <IoCheckmarkCircleOutline size={18} />
            Pedido #{String(lastOrderId).padStart(5, '0')} confirmado — boleta enviada a imprimir
          </div>
        )}

        {/* Grid de platos */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-3">
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Cargando menú...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredMenu.map(cat => (
                <section key={cat.id}>
                  <SectionTitle label={cat.name} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-3">
                    {cat.items.map(item => {
                      if (cat.name === 'Combos') {
                        return <ComboCard key={item.id} combo={item} />;
                      }
                      return <MenuCard key={item.id} item={item} />;
                    })}
                  </div>
                </section>
              ))}

              {filteredMenu.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <IoFastFoodOutline size={48} className="text-gray-300" />
                  <p className="text-sm text-gray-400">Sin resultados para "{search}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <CartPanel onOrderSuccess={handleOrderSuccess} />
    </div>
  );
}

// Componente NavLink reutilizable
function NavLink({ href, icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}

// CategoryTab
function CategoryTab({ label, slug, active, onClick }) {
  return (
    <button
      onClick={onClick}
      data-slug={slug}
      className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${active
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
      {label}
    </button>
  );
}

// SectionTitle
function SectionTitle({ label }) {
  return (
    <h2 className="font-semibold text-gray-800 text-lg tracking-wide">
      {label}
    </h2>
  );
}

// LogoutButton
function LogoutButton() {
  const { user, logout } = useAuth();
  return (
    <div className="flex items-center gap-2 pl-2 ml-2 border-l border-gray-200">
      <span className="hidden lg:block text-sm text-gray-600">
        {user?.username}
      </span>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <IoLogOutOutline size={16} />
        <span className="hidden lg:inline">Salir</span>
      </button>
    </div>
  );
}