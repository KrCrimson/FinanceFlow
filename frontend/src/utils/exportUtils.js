// Utilitario ejecutable para exportación a Excel y PDF en la Web

// 1. Exportación a Excel (.csv con formato UTF-8 BOM y estructura ejecutiva para Microsoft Excel)
export function exportToExcel(data, filename = "reporte-financeflow.csv") {
  if (!data || !data.length) {
    alert("No hay datos para exportar.");
    return;
  }

  // Calcular métricas para el bloque de resumen
  const totalIngresos = data
    .filter((item) => (item.tipo || "").toLowerCase() === "ingreso")
    .reduce((sum, item) => sum + (item.monto || 0), 0);
  
  const totalEgresos = data
    .filter((item) => (item.tipo || "").toLowerCase() === "egreso")
    .reduce((sum, item) => sum + (item.monto || 0), 0);

  const balanceNeto = totalIngresos - totalEgresos;

  // Filas del archivo CSV
  const csvRows = [];

  // Bloque Ejecutivo de Encabezado
  csvRows.push(["REPORTE FINANCIERO EJECUTIVO - FINANCEFLOW PRO"]);
  csvRows.push([`Fecha de Emisión: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`]);
  csvRows.push([]); // Espacio en blanco

  // Bloque de Resumen Financiero
  csvRows.push(["RESUMEN GENERAL"]);
  csvRows.push(["Métrica", "Monto (PEN)"]);
  csvRows.push(["Total Ingresos", totalIngresos.toFixed(2)]);
  csvRows.push(["Total Egresos", totalEgresos.toFixed(2)]);
  csvRows.push(["Balance Neto", balanceNeto.toFixed(2)]);
  csvRows.push([]); // Espacio en blanco
  csvRows.push([]); // Espacio en blanco

  // Bloque de Detalle de Movimientos
  csvRows.push(["DETALLE DE MOVIMIENTOS"]);
  const headers = [
    "Nombre",
    "Categoría",
    "Tipo",
    "Monto (PEN)",
    "Fecha",
    "Estado",
    "Recurrente",
  ];
  csvRows.push(headers);

  // Construir filas de transacciones
  data.forEach((item) => {
    csvRows.push([
      `"${(item.nombre || "").replace(/"/g, '""')}"`,
      `"${(item.categoria || "").replace(/"/g, '""')}"`,
      `"${(item.tipo || "").toUpperCase()}"`,
      (item.monto || 0).toFixed(2),
      `"${item.fecha ? new Date(item.fecha).toLocaleDateString() : ""}"`,
      `"${item.estado || "activo"}"`,
      item.esRecurrente ? "SÍ" : "NO",
    ]);
  });

  // Contenido con UTF-8 BOM (\uFEFF) para visualización directa en Excel
  const csvContent =
    "\uFEFF" + csvRows.map((row) => row.join(",")).join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 2. Exportación a PDF Premium mediante vista previa de impresión contable formateada
export function exportToPDF(
  movimientos,
  resumen = {},
  titulo = "Reporte Financiero Contable",
) {
  if (!movimientos || !movimientos.length) {
    alert("No hay datos para generar el reporte en PDF.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert(
      "Por favor permite las ventanas emergentes (popups) en tu navegador para descargar el PDF.",
    );
    return;
  }

  const totalIngresos =
    resumen.totalIngresos ||
    movimientos
      .filter((m) => m.tipo === "ingreso")
      .reduce((s, m) => s + m.monto, 0);
  const totalEgresos =
    resumen.totalEgresos ||
    movimientos
      .filter((m) => m.tipo === "egreso")
      .reduce((s, m) => s + m.monto, 0);
  const balance = totalIngresos - totalEgresos;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <title>${titulo} - FinanceFlow</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            padding: 40px; 
            color: #0f172a; 
            line-height: 1.6;
            background-color: #ffffff;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 2px solid #e2e8f0; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .brand { 
            font-size: 28px; 
            font-weight: 800; 
            color: #059669; 
            letter-spacing: -0.025em;
          }
          .brand span {
            color: #0f172a;
          }
          .title { 
            font-size: 18px; 
            color: #475569; 
            font-weight: 600;
            margin-top: 5px;
          }
          .meta-info {
            text-align: right; 
            font-size: 12px; 
            color: #64748b;
          }
          .meta-info strong {
            color: #334155;
          }
          .summary-grid { 
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px; 
            margin-bottom: 35px; 
          }
          .card { 
            padding: 20px; 
            border-radius: 16px; 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            transition: all 0.3s;
          }
          .card-title { 
            font-size: 11px; 
            text-transform: uppercase; 
            color: #64748b; 
            font-weight: 700; 
            letter-spacing: 0.05em;
          }
          .card-value { 
            font-size: 24px; 
            font-weight: 800; 
            margin-top: 8px; 
          }
          .ingreso { color: #059669; }
          .egreso { color: #e11d48; }
          .balance { color: #2563eb; }
          
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
            font-size: 12px; 
          }
          th { 
            background: #f8fafc; 
            text-align: left; 
            padding: 12px 16px; 
            border-bottom: 2px solid #e2e8f0; 
            color: #475569; 
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.05em;
          }
          td { 
            padding: 14px 16px; 
            border-bottom: 1px solid #f1f5f9; 
            color: #334155;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 6px;
            text-transform: uppercase;
          }
          .badge-ingreso {
            background: #d1fae5;
            color: #065f46;
          }
          .badge-egreso {
            background: #ffe4e6;
            color: #9f1239;
          }
          .text-right {
            text-align: right;
          }
          .font-bold {
            font-weight: 700;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 11px; 
            color: #94a3b8; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 20px; 
          }
          
          @media print {
            body { padding: 0; }
            .card { border: 1px solid #cbd5e1; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Finance<span>Flow</span> Pro 📈</div>
            <div class="title">${titulo}</div>
          </div>
          <div class="meta-info">
            Fecha de emisión: <strong>${new Date().toLocaleDateString()}</strong><br>
            Hora: <strong>${new Date().toLocaleTimeString()}</strong><br>
            Generado por: <strong>Usuario FinanceFlow</strong>
          </div>
        </div>

        <div class="summary-grid">
          <div class="card">
            <div class="card-title">Total Ingresos</div>
            <div class="card-value ingreso">+ S/ ${totalIngresos.toFixed(2)}</div>
          </div>
          <div class="card">
            <div class="card-title">Total Egresos</div>
            <div class="card-value egreso">- S/ ${totalEgresos.toFixed(2)}</div>
          </div>
          <div class="card" style="background: #eff6ff; border-color: #bfdbfe;">
            <div class="card-title" style="color: #1e40af;">Balance Neto</div>
            <div class="card-value balance" style="color: #1d4ed8;">S/ ${balance.toFixed(2)}</div>
          </div>
        </div>

        <div class="section-title">Detalle de Transacciones</div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Movimiento</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th class="text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${movimientos
              .map(
                (m) => `
              <tr>
                <td>${new Date(m.fecha).toLocaleDateString()}</td>
                <td class="font-bold">${m.nombre}</td>
                <td><span style="color: #64748b; font-weight: 500;">${m.categoria}</span></td>
                <td>
                  <span class="badge ${m.tipo === "ingreso" ? "badge-ingreso" : "badge-egreso"}">
                    ${m.tipo === "ingreso" ? "📈 Ingreso" : "📉 Egreso"}
                  </span>
                </td>
                <td class="text-right font-bold ${m.tipo === "ingreso" ? "ingreso" : "egreso"}">
                  ${m.tipo === "ingreso" ? "+" : "-"} S/ ${m.monto.toFixed(2)}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          Documento oficial de control financiero contable generado desde FinanceFlow Web • Acceso Vitalicio Pro
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
