// Utilitario ejecutable para exportación a Excel y PDF en la Web

// 1. Exportación a Excel (.csv con formato UTF-8 BOM para apertura directa en Microsoft Excel)
export function exportToExcel(data, filename = "reporte-financeflow.csv") {
  if (!data || !data.length) {
    alert("No hay datos para exportar.");
    return;
  }

  // Encabezados
  const headers = [
    "Nombre",
    "Categoría",
    "Tipo",
    "Monto",
    "Fecha",
    "Estado",
    "Recurrente",
  ];

  // Construir filas
  const rows = data.map((item) => [
    `"${(item.nombre || "").replace(/"/g, '""')}"`,
    `"${(item.categoria || "").replace(/"/g, '""')}"`,
    `"${(item.tipo || "").toUpperCase()}"`,
    (item.monto || 0).toFixed(2),
    `"${item.fecha ? new Date(item.fecha).toLocaleDateString() : ""}"`,
    `"${item.estado || "activo"}"`,
    item.esRecurrente ? "SÍ" : "NO",
  ]);

  // Contenido con UTF-8 BOM (\uFEFF) para que Excel reconozca tildes y caracteres especiales
  const csvContent =
    "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 2. Exportación a PDF ejecutable mediante vista previa de impresión contable formateada
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
    <html>
      <head>
        <title>${titulo} - FinanceFlow</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #059669; padding-bottom: 15px; margin-bottom: 25px; }
          .brand { font-size: 24px; font-weight: bold; color: #065f46; }
          .title { font-size: 18px; color: #475569; }
          .summary-grid { display: flex; gap: 15px; margin-bottom: 25px; }
          .card { flex: 1; padding: 15px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; }
          .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          .card-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
          .ingreso { color: #059669; }
          .egreso { color: #dc2626; }
          .balance { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; color: #334155; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">FinanceFlow Pro 📈</div>
            <div class="title">${titulo}</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748b;">
            Fecha de emisión: ${new Date().toLocaleDateString()}<br>
            Generado por: Usuario FinanceFlow
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
          <div class="card">
            <div class="card-title">Balance Neto</div>
            <div class="card-value balance">S/ ${balance.toFixed(2)}</div>
          </div>
        </div>

        <h3>Detalle de Transacciones</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Movimiento</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th style="text-align: right;">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${movimientos
              .map(
                (m) => `
              <tr>
                <td>${new Date(m.fecha).toLocaleDateString()}</td>
                <td><strong>${m.nombre}</strong></td>
                <td>${m.categoria}</td>
                <td><span class="${m.tipo}">${m.tipo.toUpperCase()}</span></td>
                <td style="text-align: right;" class="${m.tipo}">
                  ${m.tipo === "ingreso" ? "+" : "-"} S/ ${m.monto.toFixed(2)}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          Documento oficial generado desde FinanceFlow Web • Sistema de Balance y Gestión Financiera
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
