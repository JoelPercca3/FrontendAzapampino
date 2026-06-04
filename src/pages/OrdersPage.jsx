import { useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import { SalesChart } from '../components/SalesChart.jsx';
import {
    IoArrowBackOutline,
    IoPrintOutline,
    IoCloseOutline,
    IoRefreshOutline,
    IoCalendarOutline,
    IoRestaurantOutline,
    IoCashOutline,
    IoCardOutline,
    IoPhonePortraitOutline,
    IoWalletOutline,
    IoCheckmarkCircle,
    IoTimeOutline,
    IoBanOutline,
    IoTrendingUpOutline,
    IoReceiptOutline,
    IoPricetagOutline,
    IoFastFoodOutline,
    IoPeopleOutline
} from 'react-icons/io5';

const STATUS_LABEL = {
    pending: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    confirmed: { label: 'Confirmado', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    cancelled: { label: 'Cancelado', cls: 'bg-gray-50 text-gray-500 border border-gray-200' },
};

const PAYMENT_ICON = {
    cash: <IoCashOutline size={14} />,
    card: <IoCardOutline size={14} />,
    yape: <IoPhonePortraitOutline size={14} />,
    plin: <IoWalletOutline size={14} />,
};

const PAYMENT_LABEL = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    yape: 'Yape',
    plin: 'Plin',
};

export function OrdersPage() {
    const today = new Date().toISOString().slice(0, 10);

    const [date, setDate] = useState(today);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setFilter] = useState('all');
    const [salesData, setSalesData] = useState([]);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [ordersRes, statsRes, salesRes] = await Promise.all([
                api.getOrders({ date }),
                api.getStats(date),
                api.getSalesByDay({ month: date.slice(0, 7) }),
            ]);
            setOrders(ordersRes.orders);
            setStats(statsRes);
            setSalesData(salesRes.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => { load(); }, [load]);

    async function handleStatus(orderId, status) {
        try {
            await api.updateStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            if (selected?.id === orderId) setSelected(s => ({ ...s, status }));
            const statsRes = await api.getStats(date);
            setStats(statsRes);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async function handlePrint(orderId) {
        try {
            await api.printOrder(orderId);
            alert('Boleta enviada a imprimir ✅');
        } catch (err) {
            alert('Error de impresión: ' + err.message);
        }
    }

    async function openDetail(order) {
        try {
            const res = await api.getOrder(order.id);
            setSelected(res.order);
        } catch {
            setSelected(order);
        }
    }

    const filtered = statusFilter === 'all'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    const confirmedOrders = orders.filter(o => o.status === 'confirmed');
    const totalConfirmedRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const averageTicket = confirmedOrders.length > 0 ? totalConfirmedRevenue / confirmedOrders.length : 0;

    return (
        <div className="h-screen bg-gray-50 overflow-auto flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <IoArrowBackOutline size={22} />
                </a>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IoReceiptOutline size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-900 text-lg">Pedidos</h1>
                        <p className="text-xs text-gray-500">Gestión y seguimiento</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <div className="relative">
                        <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={load}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                    >
                        <IoRefreshOutline size={16} />
                        Actualizar
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

                {/* Tarjetas de estadísticas */}
                {stats && (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                icon={<IoReceiptOutline size={20} />}
                                label="Pedidos totales"
                                value={stats.totals.total_orders}
                                sub="del día"
                                color="gray"
                            />
                            <StatCard
                                icon={<IoCheckmarkCircle size={20} />}
                                label="Ingresos confirmados"
                                value={`S/ ${Number(stats.totals.confirmed_revenue).toFixed(2)}`}
                                sub="pedidos confirmados"
                                color="emerald"
                            />
                            <StatCard
                                icon={<IoTrendingUpOutline size={20} />}
                                label="Total facturado"
                                value={`S/ ${Number(stats.totals.total_revenue).toFixed(2)}`}
                                sub="todos los estados"
                                color="gray"
                            />
                            <StatCard
                                icon={<IoBanOutline size={20} />}
                                label="Cancelados"
                                value={stats.totals.cancelled_orders}
                                sub="pedidos cancelados"
                                color="red"
                            />
                        </div>

                        {/* Resumen del día */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total vendido</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        S/ {Number(stats.totals.total_revenue).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Ingresos del día</p>
                                </div>
                                <div className="w-px h-12 bg-gray-200 hidden md:block" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Ticket promedio</p>
                                    <p className="text-xl font-bold text-gray-700">
                                        S/ {averageTicket.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400">Por pedido confirmado</p>
                                </div>
                                <div className="w-px h-12 bg-gray-200 hidden md:block" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pedidos confirmados</p>
                                    <p className="text-xl font-bold text-emerald-600">
                                        {confirmedOrders.length}
                                    </p>
                                    <p className="text-xs text-gray-400">De {orders.length} totales</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Lista de pedidos */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Filtros de estado */}
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all ${statusFilter === s
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {s === 'all' ? 'Todos' : STATUS_LABEL[s].label}
                                    <span className="ml-1.5 opacity-70 text-xs">
                                        {s === 'all' ? orders.length : orders.filter(o => o.status === s).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-16 text-gray-400 gap-3">
                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm">Cargando pedidos...</span>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm border border-red-200">{error}</div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                                <IoReceiptOutline size={48} className="opacity-50" />
                                <p className="text-sm">No hay pedidos para esta fecha</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => openDetail(order)}
                                        className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selected?.id === order.id ? 'border-gray-900 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono font-bold text-gray-900 text-sm">
                                                        #{String(order.id).padStart(5, '0')}
                                                    </span>
                                                    {order.table_name && (
                                                        <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5 flex items-center gap-1">
                                                            <IoRestaurantOutline size={10} />
                                                            {order.table_name}
                                                        </span>
                                                    )}
                                                    {order.customer_name && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <IoPeopleOutline size={10} />
                                                            {order.customer_name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABEL[order.status].cls}`}>
                                                        {STATUS_LABEL[order.status].label}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        {PAYMENT_ICON[order.payment_method] || <IoCashOutline size={14} />}
                                                        {PAYMENT_LABEL[order.payment_method] || order.payment_method}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <IoTimeOutline size={12} />
                                                        {new Date(order.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-gray-900 text-lg">
                                                    S/ {Number(order.total).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400">{order.item_count} {order.item_count === 1 ? 'ítem' : 'ítems'}</p>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatus(order.id, 'confirmed')}
                                                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-3 py-1.5 transition-colors"
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(order.id, 'cancelled')}
                                                        className="text-xs border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium rounded-lg px-3 py-1.5 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatus(order.id, 'pending')}
                                                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg px-3 py-1.5 transition-colors"
                                                >
                                                    Reabrir
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handlePrint(order.id)}
                                                className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-3 py-1.5 transition-colors ml-auto"
                                            >
                                                <IoPrintOutline size={12} />
                                                Reimprimir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Panel derecho */}
                    <div className="space-y-4">

                        {/* Detalle del pedido seleccionado */}
                        {selected ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <IoReceiptOutline size={18} />
                                        Pedido #{String(selected.id).padStart(5, '0')}
                                    </h3>
                                    <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                                        <IoCloseOutline size={20} />
                                    </button>
                                </div>
                                {selected.items ? (
                                    <div className="space-y-3">
                                        {selected.items.map(it => (
                                            <div key={it.id} className="flex justify-between items-start text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-900">{it.quantity}x</span>
                                                    <span className="text-gray-600 ml-2">{it.item_name}</span>
                                                    {it.notes && <p className="text-xs text-gray-400 mt-0.5 ml-5">📝 {it.notes}</p>}
                                                </div>
                                                <span className="text-gray-700 font-medium shrink-0 ml-2">S/ {Number(it.subtotal).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-semibold text-gray-900">
                                            <span>Total</span>
                                            <span>S/ {Number(selected.total).toFixed(2)}</span>
                                        </div>
                                        {selected.notes && (
                                            <div className="bg-gray-50 rounded-lg p-3 mt-3 text-xs text-gray-500 flex gap-2">
                                                <IoPricetagOutline size={14} className="text-gray-400" />
                                                {selected.notes}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Cargando detalle...</p>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
                                <IoReceiptOutline size={48} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Selecciona un pedido</p>
                                <p className="text-xs mt-1">para ver el detalle completo</p>
                            </div>
                        )}

                        {/* Platos más vendidos */}
                        {stats?.topItems?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <IoFastFoodOutline size={18} />
                                    Más vendidos hoy
                                </h3>
                                <div className="space-y-3">
                                    {stats.topItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className={`text-xs font-bold w-6 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : 'text-gray-300'}`}>
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 truncate">{item.item_name}</p>
                                                <p className="text-xs text-gray-400">{item.qty} vendidos</p>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-600 shrink-0">
                                                S/ {Number(item.revenue).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Desglose por método de pago */}
                        {stats?.byPayment?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <IoCardOutline size={18} />
                                    Métodos de pago
                                </h3>
                                <div className="space-y-3">
                                    {stats.byPayment.map(p => (
                                        <div key={p.payment_method} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                {PAYMENT_ICON[p.payment_method] || <IoCashOutline size={14} />}
                                                {PAYMENT_LABEL[p.payment_method] || p.payment_method}
                                            </span>
                                            <div className="text-right">
                                                <span className="font-semibold text-gray-900">S/ {Number(p.total).toFixed(2)}</span>
                                                <span className="text-xs text-gray-400 ml-1">({p.count})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub, color }) {
    const colors = {
        gray: 'bg-gray-50 border border-gray-200',
        emerald: 'bg-emerald-50 border border-emerald-200',
        red: 'bg-red-50 border border-red-200',
    };
    const textColors = {
        gray: 'text-gray-900',
        emerald: 'text-emerald-700',
        red: 'text-red-600',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className={`mb-2 ${textColors[color]}`}>{icon}</div>
            <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
    );
}