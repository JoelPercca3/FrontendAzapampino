// frontend/src/components/SalesChart.jsx
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SalesChart({ data, title, type = 'line' }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-8 text-center text-gray-400 shadow-sm" style={{ borderRadius: "0px" }}>
                <p className="text-lg">📊</p>
                <p className="text-sm">No hay datos de ventas para mostrar</p>
            </div>
        );
    }

    // Formatear fechas para mostrar más legible
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
    }));

    return (
        <div className="bg-white p-4 shadow-sm" style={{ borderRadius: "0px" }}>
            <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                {type === 'line' ? (
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            tickFormatter={(value) => `S/ ${value}`}
                        />
                        <Tooltip
                            formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, 'Ventas']}
                            contentStyle={{ borderRadius: '0px', borderColor: '#e5e7eb' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--cds-colors-brand-medium, #e4002b)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: 'var(--cds-colors-brand-medium, #e4002b)' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                ) : (
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            tickFormatter={(value) => `S/ ${value}`}
                        />
                        <Tooltip
                            formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, 'Ventas']}
                            contentStyle={{ borderRadius: '0px', borderColor: '#e5e7eb' }}
                        />
                        <Bar dataKey="revenue" fill="var(--cds-colors-brand-medium, #e4002b)" />
                    </BarChart>
                )}
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 text-center mt-3">Ventas por día - {title.split(' ')[2]}</p>
        </div>
    );
}