import React, { useState } from 'react';
import { createMovimiento } from '../services/movimientosService';
import { useImageToMovimiento } from '../hooks/useImageToMovimiento';
import { useNavigate } from 'react-router-dom';

function MovimientoFormPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('ingreso');
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { processImage, result, loading: loadingImg, error: ocrError } = useImageToMovimiento();

  const categorias = {
    ingreso: ['Sueldo', 'Freelance', 'Ventas', 'Inversiones', 'Regalos', 'Otros'],
    egreso: ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Otros']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !monto || monto <= 0) {
      setError('Por favor complete todos los campos requeridos correctamente');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await createMovimiento({ 
        tipo, 
        nombre: nombre.trim(), 
        monto: Number(monto), 
        categoria: categoria || categorias[tipo][0], 
        descripcion: descripcion.trim() 
      });
      setSuccess('¡Movimiento registrado exitosamente!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message || 'Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError('');
      setSuccess('');
      processImage(file);
    }
  };

  const clearForm = () => {
    setNombre('');
    setMonto('');
    setCategoria('');
    setDescripcion('');
    setError('');
    setSuccess('');
  };

  // Si hay resultado de imagen, autocompletar campos
  React.useEffect(() => {
    if (result) {
      setTipo(result.tipo || 'egreso');
      setNombre(result.nombre || '');
      setDescripcion(result.descripcion || '');
      setMonto(result.monto || '');
      setCategoria(result.categoria || '');
      
      if (result.monto > 0) {
        setSuccess(`¡OCR exitoso! Detectado: ${result.nombre} - S/${result.monto}`);
      } else {
        setSuccess('¡Texto extraído! Verifica el monto manualmente.');
      }
      
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [result]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background animate-fade-in p-4">
      <div className="bg-white/90 shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">✨ Registrar Movimiento</h2>
          <div className="flex gap-2">
            <button 
              onClick={clearForm}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              🗑️ Limpiar
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Sección de carga de imagen */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📷 Extraer datos de comprobante (OCR)</h3>
          <div className="flex items-center space-x-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImage}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-all duration-200"
            />
            {loadingImg && (
              <div className="flex items-center text-primary">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                <span className="text-sm font-medium">Analizando imagen con OCR...</span>
              </div>
            )}
          </div>
          {result && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>Detectado:</strong> {result.nombre} - S/{result.monto}
                {result.monto === 0 && (
                  <span className="block text-orange-600 mt-1">
                    ⚠️ Monto no detectado, ingésalo manualmente
                  </span>
                )}
              </p>
            </div>
          )}
          
          {/* Mostrar errores de OCR */}
          {ocrError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ❌ <strong>Error OCR:</strong> {ocrError}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Movimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Movimiento</label>
              <select 
                value={tipo} 
                onChange={e => {setTipo(e.target.value); setCategoria('');}}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="ingreso">💰 Ingreso</option>
                <option value="egreso">💸 Egreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={monto} 
                onChange={e => setMonto(e.target.value)} 
                step="0.01"
                min="0"
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Nombre y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Movimiento</label>
              <input 
                type="text" 
                placeholder="Ej: Pago de alquiler" 
                value={nombre} 
                onChange={e => setNombre(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select 
                value={categoria} 
                onChange={e => setCategoria(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Seleccionar categoría</option>
                {categorias[tipo].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (Opcional)</label>
            <textarea 
              placeholder="Detalles adicionales del movimiento..." 
              value={descripcion} 
              onChange={e => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>



          {/* Botones */}
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || !nombre.trim() || !monto}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>💾 Guardar Movimiento</>
              )}
            </button>
          </div>

          {/* Mensajes */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                {success}
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                {error}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default MovimientoFormPage;
