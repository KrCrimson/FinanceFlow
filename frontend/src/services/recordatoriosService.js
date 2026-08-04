const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper para cabeceras con JWT
function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getRecordatorios() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/recordatorios`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al obtener recordatorios");
    return data;
  } catch (error) {
    console.error("Error en getRecordatorios:", error);
    throw error;
  }
}

export async function crearRecordatorio(recordatorioData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/recordatorios`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(recordatorioData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear recordatorio");
    return data;
  } catch (error) {
    console.error("Error en crearRecordatorio:", error);
    throw error;
  }
}

export async function actualizarRecordatorio(id, fields) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/recordatorios/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al actualizar recordatorio");
    return data;
  } catch (error) {
    console.error("Error en actualizarRecordatorio:", error);
    throw error;
  }
}

export async function eliminarRecordatorio(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/recordatorios/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar recordatorio");
    return data;
  } catch (error) {
    console.error("Error en eliminarRecordatorio:", error);
    throw error;
  }
}
