import React, { useRef, useEffect } from 'react';

// Gráfico de barras simple
function GraficoBarras({ datos, titulo, colorPrimario = '#3B82F6', colorSecundario = '#EF4444' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datos.length) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Configuración
    const padding = 60;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Encontrar valor máximo
    const maxValor = Math.max(...datos.map(d => Math.abs(d.valor)));
    const escala = graphHeight / (maxValor * 1.1);

    // Dibujar barras
    const barWidth = graphWidth / datos.length;
    datos.forEach((item, index) => {
      const x = padding + index * barWidth + barWidth * 0.1;
      const barHeight = Math.abs(item.valor) * escala;
      const y = item.valor >= 0 ? 
        height - padding - barHeight : 
        height - padding;

      // Color según si es positivo o negativo
      ctx.fillStyle = item.valor >= 0 ? colorPrimario : colorSecundario;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      // Etiquetas
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      // Nombre de la categoría (rotado)
      ctx.save();
      ctx.translate(x + barWidth * 0.4, height - padding + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(item.label.substring(0, 10), 0, 0);
      ctx.restore();

      // Valor
      ctx.fillText(
        `S/${item.valor.toLocaleString()}`, 
        x + barWidth * 0.4, 
        y - 5
      );
    });

    // Línea del eje X
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

  }, [datos, colorPrimario, colorSecundario]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{titulo}</h3>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={300}
        className="w-full h-64"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

// Gráfico de línea simple para tendencias
function GraficoLinea({ datos, titulo, color = '#3B82F6' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datos.length) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    const maxValor = Math.max(...datos.map(d => d.valor));
    const minValor = Math.min(...datos.map(d => d.valor));
    const rango = maxValor - minValor || 1;

    // Dibujar línea
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    datos.forEach((punto, index) => {
      const x = padding + (index / (datos.length - 1)) * graphWidth;
      const y = height - padding - ((punto.valor - minValor) / rango) * graphHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Puntos
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Etiquetas
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(punto.label, x, height - padding + 20);
      ctx.fillText(`S/${punto.valor.toFixed(0)}`, x, y - 10);
    });

    ctx.stroke();

    // Ejes
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

  }, [datos, color]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{titulo}</h3>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={300}
        className="w-full h-64"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

// Gráfico circular (dona) simple
function GraficoCircular({ datos, titulo }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datos.length) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const total = datos.reduce((sum, item) => sum + item.valor, 0);
    
    const colores = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
      '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
    ];

    let currentAngle = -Math.PI / 2;

    datos.forEach((item, index) => {
      const sliceAngle = (item.valor / total) * 2 * Math.PI;
      
      // Dibujar slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = colores[index % colores.length];
      ctx.fill();

      // Dibujar línea divisoria
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Círculo interior (efecto dona)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Texto central
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Total', centerX, centerY - 5);
    ctx.fillText(`S/${total.toLocaleString()}`, centerX, centerY + 15);

  }, [datos]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{titulo}</h3>
      <div className="flex flex-col lg:flex-row items-center">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300}
          className="mb-4 lg:mb-0"
        />
        <div className="lg:ml-6">
          {datos.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded mr-2" 
                style={{ 
                  backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'][index % 10] 
                }}
              ></div>
              <span className="text-sm text-gray-700">{item.label}: S/{item.valor.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GraficoBarras, GraficoLinea, GraficoCircular };