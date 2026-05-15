import { useState } from "react";
import { Alert } from "react-native";

export function useImageToMovimiento() {
  const [loadingOcr, setLoadingOcr] = useState(false);

  const processImage = async (uri, fileName, type) => {
    setLoadingOcr(true);

    try {
      console.log(
        "Enviando imagen al microservicio ML Python desde móvil:",
        fileName,
      );

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: type || "image/jpeg",
        name: fileName || "photo.jpg",
      });

      // En móvil usamos siempre URLs absolutas para la nube
      const API_URL = "https://financeflow-backend-4fbw.onrender.com"; // Ojo: Reemplazar con el tuyo si el ML Python es diferente, asumo misma ruta o render de ML
      // Ajuste si tienes un backend Python separado (como la web):
      const ML_API_URL =
        process.env.EXPO_PUBLIC_ML_URL ||
        "https://financeflow-api-python.onrender.com"; // Fallback genérico por seguridad, ajustar de ser necesario

      // Para efectos de un desarrollo fluido, probemos con la ruta que solía usar la web.
      // Si el backend lo provee bajo /api/analyze-receipt, ajustamos. Por ahora asumo un microservicio separado:
      const response = await fetch(`${ML_API_URL}/analyze-receipt`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar la imagen con Machine Learning");
      }

      const res = await response.json();
      const data = res.data;

      console.log("Respuesta del modelo ML:", data);

      return {
        monto: data.monto ? data.monto.toString() : "",
        nombre: data.descripcion || "Movimiento detectado",
        categoria: data.categoria_ml
          ? data.categoria_ml.toLowerCase()
          : "otros",
        tipo: data.tipo || "egreso",
      };
    } catch (e) {
      console.error("Error en el OCR basado en ML:", e);
      let errorMsg = e.message;
      if (
        e.message.indexOf("Network") !== -1 ||
        e.message.indexOf("fetch") !== -1
      ) {
        errorMsg =
          "El servidor de IA está despertando... Render suele demorar 50s en reiniciar. ¡Intenta de nuevo en un minuto!";
      } else {
        errorMsg = "No se pudo procesar la imagen con IA. " + errorMsg;
      }
      Alert.alert("Error de OCR", errorMsg);
      return null;
    } finally {
      setLoadingOcr(false);
    }
  };

  return { processImage, loadingOcr };
}
