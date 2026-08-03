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

export async function checkoutDirectoPro(email, metodo, pais, monto, moneda) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pagos/checkout-directo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, metodo, pais, monto, moneda }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al procesar la suscripción");
    }
    return data;
  } catch (error) {
    console.error("Error en checkoutDirectoPro:", error);
    throw error;
  }
}

export async function crearCheckoutStripe(email) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/pagos/crear-checkout-stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Error al iniciar Stripe Checkout");
    }
    return data;
  } catch (error) {
    console.error("Error en crearCheckoutStripe:", error);
    throw error;
  }
}

export async function crearPreferenciaMercadoPago(email) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/pagos/crear-preferencia-mp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Error al iniciar Mercado Pago");
    }
    return data;
  } catch (error) {
    console.error("Error en crearPreferenciaMercadoPago:", error);
    throw error;
  }
}

export async function crearOrdenFlow(email) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/pagos/crear-orden-flow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Error al iniciar Flow.cl");
    }
    return data;
  } catch (error) {
    console.error("Error en crearOrdenFlow:", error);
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

export async function toggleDevPlan(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pagos/toggle-dev-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al alternar modo dev");
    }
    return data;
  } catch (error) {
    console.error("Error en toggleDevPlan:", error);
    throw error;
  }
}
