// =========================================================================
// FINANCEFLOW PRESENTATION CONTROLLER (GAMMA-STYLE)
// =========================================================================

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let currentSlideIndex = 0;

// UI Elements
const currentNumEl = document.getElementById('current-slide-num');
const totalNumEl = document.getElementById('total-slides-num');
const progressFill = document.getElementById('progress-fill');
const notesDrawer = document.getElementById('notes-drawer');
const notesContent = document.getElementById('notes-content');
const modalGrid = document.getElementById('modal-grid');
const timerEl = document.getElementById('timer-display');

// Initialize slide counter
totalNumEl.textContent = totalSlides;

// Speaker notes database for all 22 slides
const speakerNotes = [
  "Apertura formal. Saludo al Mag. Ricardo Valcárcel Alvarado y a la mesa evaluadora. Presentación del equipo (Sebastian Arce y Brant Chata) y del marco del curso Construcción de Software I.",
  "Presentación del marco metodológico: Enfatizar que no se trata de scripts aislados, sino de un ciclo de vida formal que conecta FD01 (viabilidad), FD02 (visión), FD03 (requisitos), FD04 (arquitectura 4+1) y FD07 (Scrum).",
  "FD01: Explicar la problemática real. El 78% abandona el registro manual. Destacar los 5 objetivos específicos: Tesseract OCR, microservicio FastAPI, Silent Training, Recharts y despliegue cloud.",
  "FD01: Las 5 dimensiones de factibilidad. Resaltar la Factibilidad Legal (Ley N° 29733 de Datos Personales) y la Factibilidad Ambiental (Zero Paper / Bisfenol A).",
  "FD01: Costos cloud y riesgos. Demostrar la eficiencia del presupuesto ($20-$43/mes) y cómo OpenCV y Keep-Alive mitigaron los riesgos técnicos clave.",
  "FD02: Declaración formal de posicionamiento. Resaltar la ventaja competitiva: captura asistida en 2 segundos y aprendizaje personalizado continuo.",
  "FD02: Alcance. Demostrar disciplina de ingeniería: explicar por qué no se desarrollaron apps nativas en fase 1 para evitar dispersión de recursos.",
  "FD03: Identidad y Procesos. Comparar el proceso AS-IS (15 minutos de digitación propensa a errores) frente al proceso propuesto TO-BE (<3 segundos por boleta).",
  "FD03: Catálogo de 22 Requerimientos Funcionales. Explicar cómo se distribuyen en 4 módulos críticos: Auth, OCR, Analítica y Contable.",
  "FD03: Casos de Uso e Interfaces Reales. Mostrar las pantallas del Dashboard (CU-05), Arqueo Diario con semáforo (CU-14) y Cierre Mensual (CU-15).",
  "FD03: RNF y Dominio. Explicar métricas duras: bcrypt con 10 salt rounds (<300ms), 100 req/s, latencia <300ms y la relación de composición fuerte en el dominio.",
  "FD04: Modelo 4+1 de Kruchten. Justificar la adopción del estándar IEEE/Kruchten y explicar el rol central de la Vista de Casos de Uso.",
  "FD04: Vista Lógica. Explicar el diagrama de paquetes y la secuencia de Cierre Mensual donde se consolida el balance contable y se bloquean transacciones.",
  "FD04: Vista Lógica (Datos). Explicar el diagrama de clases y el esquema optimizado en MongoDB Atlas con índices compuestos y borrado lógico.",
  "FD04: Vista de Implementación. Presentar la organización Monorepo en GitHub y cómo el paquete desacoplado @financeflow/sdk aísla el frontend de la API.",
  "FD04: Vista de Procesos. Detallar el flujo de digitalización OCR con Tesseract y el reentrenamiento continuo en segundo plano (Silent Training).",
  "FD04: Vista de Despliegue. Explicar la topología Cloud (Vercel CDN + Render Node + Render Python + Atlas) y los escenarios de resiliencia y Cold Start.",
  "FD07: Metodología Scrum. Detallar los roles aplicados (PO, Scrum Master rotativo, Dev Team) y los 5 criterios innegociables de la Definition of Done.",
  "FD07: Ciclo de Sprints 1 al 7. Mostrar el diagrama de Gantt 4K y resumir el avance modular semana a semana hasta la puesta en producción.",
  "FD07: Testing y Calidad. Enfatizar la suite de 94 pruebas automatizadas con Jest y Pytest al 100% de éxito y cómo el Scrum Master desbloqueó CORS y memoria.",
  "Síntesis de Trazabilidad. Demostrar la coherencia absoluta entre los 5 documentos normativos y las métricas de impacto (-85% tiempo, 90%+ precisión, 99.7% uptime).",
  "Conclusiones y Cierre. Resumir los logros de ingeniería, presentar el Roadmap (React Native y Open Banking) y agradecer al docente asesor y jurado evaluador."
];

// Go to slide function
function goToSlide(index) {
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;

  slides.forEach((slide, idx) => {
    slide.classList.remove('active', 'previous');
    if (idx === index) {
      slide.classList.add('active');
    } else if (idx < index) {
      slide.classList.add('previous');
    }
  });

  currentSlideIndex = index;
  currentNumEl.textContent = currentSlideIndex + 1;
  const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
  progressFill.style.width = `${progressPercent}%`;

  // Update speaker notes
  notesContent.textContent = speakerNotes[currentSlideIndex] || "Sin notas adicionales.";

  // Update grid thumb active state
  document.querySelectorAll('.thumb-card').forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === currentSlideIndex);
  });
}

function nextSlide() { goToSlide(currentSlideIndex + 1); }
function prevSlide() { goToSlide(currentSlideIndex - 1); }

// Event Listeners for Nav Buttons
document.getElementById('btn-prev').addEventListener('click', prevSlide);
document.getElementById('btn-next').addEventListener('click', nextSlide);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(totalSlides - 1);
  } else if (e.key.toLowerCase() === 'f') {
    toggleFullscreen();
  } else if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'n') {
    toggleNotes();
  } else if (e.key.toLowerCase() === 'g' || e.key.toLowerCase() === 'o') {
    toggleGrid();
  } else if (e.key === 'Escape') {
    if (modalGrid.classList.contains('open')) toggleGrid();
    if (notesDrawer.classList.contains('open')) toggleNotes();
  }
});

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}
document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

// Notes Drawer
function toggleNotes() {
  notesDrawer.classList.toggle('open');
}
document.getElementById('btn-notes').addEventListener('click', toggleNotes);
document.getElementById('btn-close-notes').addEventListener('click', toggleNotes);

// Grid Overview Modal
function toggleGrid() {
  modalGrid.classList.toggle('open');
}
document.getElementById('btn-grid').addEventListener('click', toggleGrid);
document.getElementById('btn-close-grid').addEventListener('click', toggleGrid);

// Print / PDF Export
document.getElementById('btn-print').addEventListener('click', () => {
  window.print();
});

// Build Grid Thumbnails
const gridContainer = document.getElementById('modal-grid-container');
slides.forEach((slide, idx) => {
  const title = slide.querySelector('.slide-title')?.textContent || `Diapositiva ${idx + 1}`;
  const tag = slide.querySelector('.slide-tag')?.textContent || 'FINANCEFLOW';
  
  const thumb = document.createElement('div');
  thumb.className = `thumb-card ${idx === 0 ? 'active' : ''}`;
  thumb.innerHTML = `
    <div class="thumb-num">SLIDE ${idx + 1}</div>
    <div class="badge-pill badge-green" style="font-size: 8px; width: fit-content;">${tag}</div>
    <div class="thumb-title">${title}</div>
  `;
  thumb.addEventListener('click', () => {
    goToSlide(idx);
    toggleGrid();
  });
  gridContainer.appendChild(thumb);
});

// Presentation Timer
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;

function updateTimer() {
  timerSeconds++;
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const secs = String(timerSeconds % 60).padStart(2, '0');
  timerEl.textContent = `⏱️ ${mins}:${secs}`;
}

timerEl.addEventListener('click', () => {
  if (!timerRunning) {
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
    timerEl.style.borderColor = 'var(--accent-green)';
    timerEl.style.color = 'var(--accent-green)';
  } else {
    clearInterval(timerInterval);
    timerRunning = false;
    timerEl.style.borderColor = 'var(--accent-amber)';
    timerEl.style.color = 'var(--accent-amber)';
  }
});

// Double click timer to reset
timerEl.addEventListener('dblclick', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 0;
  timerEl.textContent = '⏱️ 00:00';
  timerEl.style.borderColor = 'rgba(245, 158, 11, 0.3)';
  timerEl.style.color = 'var(--accent-amber)';
});

// Start at Slide 0
goToSlide(0);
console.log('FinanceFlow Presentation Deck Initialized with 22 Slides!');
