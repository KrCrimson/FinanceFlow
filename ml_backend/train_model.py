import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib
import os

print("Iniciando proceso de Machine Learning...")

# 1. DATASET DE ENTRENAMIENTO (Tus datos históricos)
# En la vida real, sacarías esto de tu base de datos de MongoDB de los meses anteriores.
datos_entrenamiento = {
    'descripcion': [
        'Yape a Maria', 'Transferencia de Juan', 'Plin Luis', 'Deposito sueldo', 'Yape Pedro',
        'KFC', 'McDonalds', 'Restaurante El Buen Sabor', 'Rappi', 'Cevichería', 'Polleria', 'Pizza Hut',
        'Uber', 'Taxi', 'Gasolinera Repsol', 'Pasaje tren', 'Vuelo Latam', 'Primax', 'Corredor azul',
        'Inkafarma', 'Mifarma', 'Clinica Delgado', 'Consulta medica', 'Pastillas', 'Laboratorio ROE',
        'Netflix', 'Spotify', 'Cineplanet', 'Steam Games', 'Entradas concierto', 'Disney Plus',
        'Sedapal', 'Luz del Sur', 'Mantenimiento edificio', 'Alquiler departamento', 'Claro internet'
    ],
    'categoria': [
        'Otros', 'Otros', 'Otros', 'Otros', 'Otros',
        'Comida', 'Comida', 'Comida', 'Comida', 'Comida', 'Comida', 'Comida',
        'Transporte', 'Transporte', 'Transporte', 'Transporte', 'Transporte', 'Transporte', 'Transporte',
        'Salud', 'Salud', 'Salud', 'Salud', 'Salud', 'Salud',
        'Entretenimiento', 'Entretenimiento', 'Entretenimiento', 'Entretenimiento', 'Entretenimiento', 'Entretenimiento',
        'Vivienda', 'Vivienda', 'Vivienda', 'Vivienda', 'Vivienda'
    ]
}

df = pd.DataFrame(datos_entrenamiento)
print(f"Dataset cargado con {len(df)} registros.")

# 2. CREACIÓN DEL PIPELINE DE ML
# TF-IDF: Convierte palabras en números matemáticos según qué tan raras e importantes son.
# MultinomialNB: Teorema de Bayes para calcular la probabilidad de la categoría.
modelo_nlp = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), MultinomialNB())

# 3. ENTRENAMIENTO DEL MODELO (El corazón del ML)
print("Entrenando el modelo...")
modelo_nlp.fit(df['descripcion'], df['categoria'])

# 4. PRUEBA DE EVALUACIÓN RÁPIDA
prueba = "pago mensual disney"
prediccion = modelo_nlp.predict([prueba])[0]
print(f"Prueba del modelo -> Si el texto es '{prueba}', la categoría predicha es: {prediccion}")

# 5. GUARDAR EL MODELO (Persistencia)
# Exportamos el "cerebro" para que FastAPI pueda leerlo sin tener que re-entrenar
ruta_modelo = os.path.join(os.path.dirname(__file__), 'modelo_clasificador.pkl')
joblib.dump(modelo_nlp, ruta_modelo)

print(f"¡Éxito! Modelo matemáticamente entrenado y exportado a: {ruta_modelo}")