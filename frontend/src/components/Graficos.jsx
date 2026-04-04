import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// Colores disponibles para gráficos
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'];

// Componente de Tooltip personalizado para mejorar el UI
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg">
        <p className="text-gray-800 font-semibold mb-1">{label}</p>
        <p className="text-gray-600">
          S/ {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Gráfico de barras usando Recharts
export function GraficoBarras({ datos, titulo, colorPrimario = '#3B82F6', colorSecundario = '#EF4444' }) {
  if (!datos || datos.length === 0) return null;

  // Formatear datos eliminando negativos (o convirtiéndolos si se requiere) para el bar chart general
  const dataFormateada = datos.map(item => ({
    ...item,
    valorAbsolute: Math.abs(item.valor),
    fillColor: item.valor >= 0 ? colorPrimario : colorSecundario
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-96">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{titulo}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={dataFormateada} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `S/${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valorAbsolute" radius={[4, 4, 0, 0]}>
            {
              dataFormateada.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fillColor} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico de línea usando Recharts
export function GraficoLinea({ datos, titulo, color = '#3B82F6' }) {
  if (!datos || datos.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-96">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{titulo}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={datos} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(value) => `S/${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke={color} 
            strokeWidth={3}
            dot={{ r: 4, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico circular usando Recharts
export function GraficoCircular({ datos, titulo }) {
  if (!datos || datos.length === 0) return null;

  const total = datos.reduce((sum, item) => sum + item.valor, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{titulo}</h3>
      <div className="flex-1 w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              dataKey="valor"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {datos.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', color: '#374151' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Total al centro */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-semibold text-gray-500 mr-20">Total</span>
          <span className="text-md font-bold text-gray-800 hidden md:block lg:block mr-20">S/ {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}