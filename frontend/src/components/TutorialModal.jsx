import React, { useState } from 'react';

const STEPS = [
  {
    icon: '🏠',
    title: 'Dashboard y Balances en Tiempo Real',
    description: 'Visualiza tus ingresos, egresos y balance total actualizado. Puedes filtrar por meses o ver el histórico general.'
  },
  {
    icon: '🏁',
    title: 'Carrera de Compras Planificadas',
    description: 'Añade tus metas de compra (laptop, celular, etc.). Cada meta compite en simultáneo contra tu balance disponible real para decirte cuál puedes comprar primero sin gastar antes de tiempo.'
  },
  {
    icon: '🏛️',
    title: 'Arqueo de Caja Chica (Cierres)',
    description: 'Realiza arqueos diarios y cierres mensuales para verificar que el dinero físico en caja cuadre perfectamente con el saldo contable.'
  },
  {
    icon: '📷',
    title: 'Escáner OCR Inteligente con Gemini Vision',
    description: 'Sube fotos de boletas, facturas o capturas de Yape/Plin. Nuestra IA de Gemini leerá el monto y concepto autocompletando el registro en 3 segundos.'
  }
];

function TutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
            💡 Guía Interactiva ({currentStep + 1} de {STEPS.length})
          </span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded-xl"
          >
            ✕
          </button>
        </div>

        <div className="text-center py-4 space-y-3">
          <div className="text-6xl mb-2">{step.icon}</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Indicadores de Pasos */}
        <div className="flex justify-center space-x-2 my-6">
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
        </div>

        {/* Botones de Navegación */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md"
          >
            {currentStep === STEPS.length - 1 ? '🎉 ¡Entendido, empezar!' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialModal;
