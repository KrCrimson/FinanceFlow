const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function getAdminMetrics() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/metrics`);
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Error al consultar métricas admin");
    return data;
  } catch (error) {
    console.error("Error en getAdminMetrics:", error);
    throw error;
  }
}

export async function getAdminUsuarios(q = "", plan = "todos") {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/usuarios?q=${encodeURIComponent(q)}&plan=${encodeURIComponent(plan)}`,
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al consultar usuarios");
    return data;
  } catch (error) {
    console.error("Error en getAdminUsuarios:", error);
    throw error;
  }
}

export async function toggleUserPremium(userId, esPremium) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/toggle-premium`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, esPremium }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Error al modificar suscripción");
    return data;
  } catch (error) {
    console.error("Error en toggleUserPremium:", error);
    throw error;
  }
}

export async function getAdminPagos(q = "", estado = "todos") {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/pagos?q=${encodeURIComponent(q)}&estado=${encodeURIComponent(estado)}`,
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al consultar pagos");
    return data;
  } catch (error) {
    console.error("Error en getAdminPagos:", error);
    throw error;
  }
}

export async function aprobarRechazarPago(pagoId, nuevoEstado) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/aprobar-pago`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagoId, nuevoEstado }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al procesar el pago");
    return data;
  } catch (error) {
    console.error("Error en aprobarRechazarPago:", error);
    throw error;
  }
}
