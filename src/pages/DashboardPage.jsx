import { useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import { SalesChart } from '../components/SalesChart.jsx';
import {
    IoArrowBackOutline,
    IoRefreshOutline,
    IoCalendarOutline,
    IoStatsChartOutline,
    IoPieChartOutline,
    IoBarChartOutline,
    IoTrendingUpOutline,
    IoReceiptOutline,
    IoCashOutline,
    IoWalletOutline,
    IoCalendarClearOutline,
    IoAnalyticsOutline,
    IoSettingsOutline,
    IoSearchOutline
} from 'react-icons/io5';

export function DashboardPage() {
    // ✅ Función para obtener fecha local correcta
    const getLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(() => getLocalDate(new Date()));
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('line');

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const salesRes = await api.getSalesByDay({ month: date.slice(0, 7) });
            const formattedData = (salesRes.data || []).map(item => ({
                ...item,
                revenue: Number(item.revenue) || 0,
                orders: Number(item.orders) || 0
            }));
            setSalesData(formattedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => { load(); }, [load]);

    const totalRevenue = salesData.reduce((sum, day) => sum + (Number(day.revenue) || 0), 0);
    const totalOrders = salesData.reduce((sum, day) => sum + (Number(day.orders) || 0), 0);
    const averagePerDay = salesData.length > 0 ? totalRevenue / salesData.length : 0;
    const bestDay = salesData.reduce((max, day) => {
        const revenue = Number(day.revenue) || 0;
        return revenue > (Number(max.revenue) || 0) ? day : max;
    }, { revenue: 0, date: '' });

    const monthName = new Date(date).toLocaleString('es-PE', { month: 'long', year: 'numeric' });

    return (
        <div className="h-screen bg-gray-50 overflow-auto flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <IoArrowBackOutline size={22} />
                </a>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IoStatsChartOutline size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-900 text-lg">Estadísticas</h1>
                        <p className="text-xs text-gray-500">Análisis de ventas</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <div className="relative">
                        <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="month"
                            value={date.slice(0, 7)}
                            onChange={e => setDate(e.target.value + '-01')}
                            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setChartType('line')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === 'line'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <IoTrendingUpOutline size={14} />
                            Línea
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === 'bar'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <IoBarChartOutline size={14} />
                            Barras
                        </button>
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

            {/* Contenido */}
            <div className="flex-1 px-6 py-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Tarjetas de resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={<IoCashOutline size={20} />}
                            label="Total facturado"
                            value={`S/ ${totalRevenue.toFixed(2)}`}
                            sub={monthName}
                            color="gray"
                        />
                        <StatCard
                            icon={<IoReceiptOutline size={20} />}
                            label="Total pedidos"
                            value={totalOrders}
                            sub="Pedidos confirmados"
                            color="emerald"
                        />
                        <StatCard
                            icon={<IoWalletOutline size={20} />}
                            label="Promedio por día"
                            value={`S/ ${averagePerDay.toFixed(2)}`}
                            sub="Venta diaria promedio"
                            color="blue"
                        />
                        <StatCard
                            icon={<IoCalendarClearOutline size={20} />}
                            label="Mejor día"
                            value={`S/ ${Number(bestDay.revenue).toFixed(2)}`}
                            sub={bestDay.date ? new Date(bestDay.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long' }) : 'Sin datos'}
                            color="purple"
                        />
                    </div>

                    {/* Gráfica principal */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <IoAnalyticsOutline size={18} />
                                Ventas de {monthName}
                            </h3>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <IoPieChartOutline size={12} />
                                {chartType === 'line' ? 'Tendencia lineal' : 'Comparativa por barras'}
                            </span>
                        </div>
                        <SalesChart
                            data={salesData}
                            title=""
                            type={chartType}
                        />
                    </div>

                    {/* Tabla de ventas por día */}
                    {salesData.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <IoStatsChartOutline size={18} />
                                    Detalle de ventas por día
                                </h3>
                                <span className="text-xs text-gray-400">{salesData.length} días</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pedidos
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ventas
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {salesData.map((day, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 text-gray-700">
                                                    {new Date(day.date).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </td>
                                                <td className="px-5 py-3 text-right text-gray-700 font-medium">
                                                    {Number(day.orders) || 0}
                                                </td>
                                                <td className="px-5 py-3 text-right font-semibold text-gray-900">
                                                    S/ {Number(day.revenue).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* Footer con totales */}
                                    <tfoot className="bg-gray-50 border-t border-gray-200">
                                        <tr>
                                            <td className="px-5 py-3 text-left font-semibold text-gray-900">
                                                Total
                                            </td>
                                            <td className="px-5 py-3 text-right font-semibold text-gray-900">
                                                {totalOrders}
                                            </td>
                                            <td className="px-5 py-3 text-right font-semibold text-gray-900">
                                                S/ {totalRevenue.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Estados de carga, error y vacío */}
                    {loading && (
                        <div className="flex justify-center py-16">
                            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm text-center rounded-lg">
                            ⚠️ {error}
                        </div>
                    )}

                    {!loading && !error && salesData.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <IoStatsChartOutline size={32} className="text-gray-300" />
                            </div>
                            <p className="text-sm">No hay datos de ventas para este mes</p>
                            <p className="text-xs text-gray-400 mt-1">Selecciona otro período</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Componente StatCard reutilizable
function StatCard({ icon, label, value, sub, color }) {
    const colors = {
        gray: 'bg-gray-50 border border-gray-200',
        emerald: 'bg-emerald-50 border border-emerald-200',
        blue: 'bg-blue-50 border border-blue-200',
        purple: 'bg-purple-50 border border-purple-200',
    };

    const iconColors = {
        gray: 'text-gray-700',
        emerald: 'text-emerald-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
    };

    const valueColors = {
        gray: 'text-gray-900',
        emerald: 'text-emerald-700',
        blue: 'text-blue-700',
        purple: 'text-purple-700',
    };

    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className={`mb-2 ${iconColors[color]}`}>{icon}</div>
            <p className={`text-2xl font-bold ${valueColors[color]}`}>{value}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
    );
}