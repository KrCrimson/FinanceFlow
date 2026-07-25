const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function solicitarPlanPro(email, metodo, nroOperacion, monto) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pagos/solicitar-pro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, metodo, nroOperacion, monto }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al enviar la solicitud de pago");
    }
    return data;
  } catch (error) {
    console.error("Error en solicitarPlanPro:", error);
    throw error;
  }
}

export async function getEstadoPlan(email) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/pagos/estado-plan/${encodeURIComponent(email)}`,
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al consultar el estado del plan");
    }
    return data;
  } catch (error) {
    console.error("Error en getEstadoPlan:", error);
    return { esPremium: false, planTipo: "free", conteoOcrMes: 0 };
  }
}
