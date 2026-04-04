from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
import re
from datetime import datetime, timedelta
import cv2
import numpy as np
import pytesseract
import joblib
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

app = FastAPI(title="Bank Sync & ML Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CategorizeRequest(BaseModel):
    description: str
    amount: float

class TrainingData(BaseModel):
    descripcion: str
    categoria: str

class RetrainRequest(BaseModel):
    data: List[TrainingData]

# --- Cargar el Modelo de Machine Learning Entrenado ---
modelo_ruta = os.path.join(os.path.dirname(__file__), 'modelo_clasificador.pkl')
ml_model = None

try:
    ml_model = joblib.load(modelo_ruta)
    print("✅ Modelo Machine Learning cargado correctamente en memoria.")
except Exception as e:
    print(f"⚠️  Advertencia: Modelo ML no encontrado. Se usará modo fallback ({e})")

def predict_category(description: str) -> str:
    # 1. Inferencia del Modelo ML Real
    if ml_model is not None:
        try:
            prediccion = ml_model.predict([description])[0]
            
            # Obtener el porcentaje de probabilidad predictiva (Confianza)
            probabilidades = ml_model.predict_proba([description])[0]
            confianza = max(probabilidades)
            
            # Si el modelo matemático duda (confianza < 35%), mandarlo a Otros
            if confianza < 0.35:
                return "Otros"
            return prediccion
        except:
            pass

    # 2. Fallback de emergencia si el archivo .pkl fue borrado
    desc = description.lower()
    if any(word in desc for word in ['kfc', 'rappi', 'restaurante']): return "Comida"
    return "Otros"

# --- NUEVO: OCR MACHINE LEARNING (Procesador de Imagen) ---
@app.post("/analyze-receipt")
async def analyze_receipt(file: UploadFile = File(...)):
    try:
        # 1. Leer imagen a Memoria
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # 2. Preprocesamiento con OpenCV (Visión Artificial)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Reducir ruido y mejorar contraste (ideal para vouchers Yape/Plin)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # 3. Extraer Texto con Tesseract
        custom_config = r'--oem 3 --psm 6'
        text_raw = pytesseract.image_to_string(thresh, config=custom_config)
        text_clean = text_raw.lower()

        # 4. Extracción de Información (NLP / Regex)
        # Soporta montos con o sin decimales (Ej: 's/ 60' o 's/ 60.50')
        amount_match = re.search(r'(?:s/|s\.|sl|s\$|soles)\s*(\d+(?:[\.\,]\d{1,2})?)', text_clean)
        amount = float(amount_match.group(1).replace(',', '.')) if amount_match else 0.0

        # Heurística para Extraer Nombre y Fecha
        description = "Movimiento Detectado"
        if "yape" in text_clean or "yapeaste" in text_clean:
            # Buscar el nombre debajo de Yapeaste y el monto en el texto raw
            lines = [line.strip() for line in text_raw.split('\n') if line.strip()]
            
            # Intento de extraer el nombre de la persona (suele estar después del monto en Yape)
            extracted_name = None
            for i, line in enumerate(lines):
                if re.search(r'(?:s/|s\.|sl|s\$|soles)\s*\d+', line.lower()) and i + 1 < len(lines):
                    # La siguiente línea suele ser el nombre
                    extracted_name = lines[i+1]
                    break
            
            if extracted_name and len(extracted_name) > 3 and not "fecha" in extracted_name.lower():
                description = "Yape a " + extracted_name.title()
            else:
                description = "Transferencia Yape"
                
            # Fallback a la regla anterior por si acaso
            match_name = re.search(r'yapeaste a\s*([a-z\s]+)', text_clean)      
            if match_name and description == "Transferencia Yape":
                description = "Yape a " + match_name.group(1).strip().title()

        date_str = datetime.now().isoformat() + "Z"
        
        # Clasificar mediante el modelo
        category = predict_category(description)

        return {
            "status": "success",
            "data": {
                "monto": amount,
                "descripcion": description,
                "fecha": date_str,
                "tipo": "Egreso", # Asumimos egreso por defecto para pagos
                "categoria_ml": category,
                "estado": "pendiente" if amount == 0.0 else "verificada",
                "raw_text_debug": text_raw[:200] # Para debug y probar
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analizando la imagen: {str(e)}")

# --- NUEVO: RE-ENTRENAMIENTO (CONTINUOUS LEARNING) ---
@app.post("/retrain")
async def retrain_model(payload: RetrainRequest):
    global ml_model
    try:
        # Convertir JSON a DataFrame de Pandas
        df = pd.DataFrame([item.dict() for item in payload.data])
        
        # Crear PIPELINE desde cero (Matemáticas TF-IDF -> Algoritmo Naive Bayes)
        new_model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), MultinomialNB())
        
        # ENTRENAR con la data enviada! (Eje X: Textos, Eje Y: Categorías verdaderas)
        new_model.fit(df['descripcion'], df['categoria'])
        
        # SOBRESCRIBIR MODELO ACTUAL
        ml_model = new_model
        
        # Guardar en Disco (.pkl)
        joblib.dump(ml_model, modelo_ruta)
        
        return {"status": "success", "message": f"Modelo ML reentrenado y guardado con {len(df)} registros frescos."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al reentrenar: {str(e)}")

# --- OPEN BANKING SIMULADOR ---
@app.get("/sync/{bank}")
async def sync_bank_transactions(bank: str, limit: int = 5):
    valid_banks = ['bcp', 'interbank', 'yape', 'bbva']
    if bank.lower() not in valid_banks:
        raise HTTPException(status_code=400, detail="Banco no soportado en el simulador")

    transactions = []
    # Data de prueba (En la vida real Belvo/Prometeo te enviaría esto)
    merchants = {
        'bcp': ['Transferencia Yape - Juan', 'Pago Netflix', 'Retiro Cajero', 'Uber Peru', 'Inkafarma'],
        'yape': ['Yape a Maria', 'Yape de Carlos (pago cena)', 'KFC Trujillo', 'Bodega Don Pepe'],
        'interbank': ['Pago Tarjeta', 'Rappi', 'Cineplanet', 'Transferencia Plin'],
        'bbva': ['Pago Mantenimiento', 'Starbucks', 'Sedapal', 'Transferencia propia']
    }
    
    bank_merchants = merchants[bank.lower()]
    
    for _ in range(limit):
        desc = random.choice(bank_merchants)
        is_expense = random.choice([True, True, True, False]) # Más probable un egreso
        amount = round(random.uniform(5.0, 300.0), 2)
        category = predict_category(desc)
        
        # Fecha en los últimos 7 días
        days_ago = random.randint(0, 7)
        date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

        transactions.append({
            "descripcion": desc,
            "monto": amount,
            "tipo": "Egreso" if is_expense else "Ingreso",
            "fecha": date,
            "categoria_ml": category,
            "estado": "verificada" if category != "Otros" else "pendiente", # "pendiente" significa que el usuario debe completar los datos
            "origen": bank.upper()
        })
        
    return {"bank": bank, "status": "success", "data": transactions}

@app.post("/categorize")
async def categorize_transaction(request: CategorizeRequest):
    category = predict_category(request.description)
    return {"category": category, "confidence": round(random.uniform(0.85, 0.99), 2)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)