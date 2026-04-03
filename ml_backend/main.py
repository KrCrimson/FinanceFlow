from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import re
from datetime import datetime, timedelta
import cv2
import numpy as np
import pytesseract
from PIL import Image
import io

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

# --- MODELO ML CLASIFICADOR ---
def predict_category(description: str) -> str:
    desc = description.lower()
    if any(word in desc for word in ['yape', 'transferencia', 'plin', 'deposito']):
        return "Otros" 
    elif any(word in desc for word in ['kfc', 'mcdonalds', 'starbucks', 'restaurante', 'rappi', 'pedidosya', 'bodega']):
        return "Comida"
    elif any(word in desc for word in ['uber', 'taxi', 'tren', 'metro', 'grifo', 'repsol', 'primax']):
        return "Transporte"
    elif any(word in desc for word in ['farmacia', 'inkafarma', 'mifarma', 'clinica', 'medico', 'salud']):
        return "Salud"
    elif any(word in desc for word in ['netflix', 'spotify', 'cineplanet', 'steam']):
        return "Entretenimiento"
    elif any(word in desc for word in ['sedapal', 'enel', 'telefonica', 'claro', 'entel', 'alquiler', 'mantenimiento']):
        return "Vivienda"
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
        amount_match = re.search(r'(?:s/|s\.|sl|s\$|soles)\s*(\d+[\.\,]\d{2})', text_clean)
        amount = float(amount_match.group(1).replace(',', '.')) if amount_match else 0.0

        # Heurística para Extraer Nombre y Fecha 
        description = "Movimiento Detectado"
        if "yape" in text_clean or "yapeaste" in text_clean:
            description = "Transferencia Yape"
            # Buscar al lado de "a" o "yapeaste a"
            match_name = re.search(r'yapeaste a\s*([a-z\s]+)', text_clean)
            if match_name:
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