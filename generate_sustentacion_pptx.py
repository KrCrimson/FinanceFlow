# ═══ FinanceFlow · Trazabilidad ═══
# Archivo .........: generate_sustentacion_pptx.py
# Capa / módulo ...: Documentación · Generador
# Función .........: Genera la presentación de sustentación (PowerPoint). Es una herramienta del equipo, no forma parte del sistema.
# Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
# Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
# Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
# ════════════════════════════════════════════════════════════
import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Dark Luxury Theme Colors
    BG_DARK = RGBColor(10, 25, 47)         # #0A192F Deep Navy
    PANEL_BG = RGBColor(17, 34, 64)        # #112240 Elevated Slate Navy
    PANEL_BORDER = RGBColor(35, 53, 84)    # Border
    ACCENT_CYAN = RGBColor(0, 212, 178)    # #00D4B2 Vibrant Teal
    ACCENT_BLUE = RGBColor(56, 189, 248)   # #38BDF8 Sky Blue
    ACCENT_GREEN = RGBColor(34, 197, 94)   # Green #22C55E
    ACCENT_AMBER = RGBColor(251, 191, 36)  # Amber #FBBF24
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(148, 163, 184)   # Slate Muted #94A3B8
    TEXT_LIGHT = RGBColor(226, 232, 240)

    def set_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, section_tag, title, slide_num, total_slides=20):
        # Section category
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = section_tag.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_CYAN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(10.5), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(20)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE

        # Divider line
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.02))
        div.fill.solid()
        div.fill.fore_color.rgb = PANEL_BORDER
        div.line.fill.background()

        # Slide Number
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(0.5), Inches(1.0), Inches(0.4))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = f"{slide_num:02d} / {total_slides:02d}"
        p_num.font.size = Pt(11)
        p_num.font.color.rgb = TEXT_MUTED
        p_num.alignment = PP_ALIGN.RIGHT

    def add_card(slide, left, top, width, height, title, items, badge_text="", badge_color=ACCENT_CYAN):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = PANEL_BG
        card.line.color.rgb = PANEL_BORDER
        card.line.width = Pt(1)

        # Title / Badge
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_top = Inches(0.22)
        tf.margin_right = Inches(0.25)
        tf.margin_bottom = Inches(0.2)

        p_h = tf.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = badge_color
        p_h.space_after = Pt(8)

        for item in items:
            p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_LIGHT
            p.space_after = Pt(4)

        return card

    # ==========================================
    # SLIDE 1: PORTADA OFICIAL
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_background(s1)

    # University header
    box_uni = s1.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(1.0))
    tf_u = box_uni.text_frame
    p_u1 = tf_u.paragraphs[0]
    p_u1.text = "UNIVERSIDAD PRIVADA DE TACNA • FACULTAD DE INGENIERÍA"
    p_u1.font.size = Pt(12)
    p_u1.font.bold = True
    p_u1.font.color.rgb = ACCENT_CYAN

    p_u2 = tf_u.add_paragraph()
    p_u2.text = "ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS | CONSTRUCCIÓN DE SOFTWARE II"
    p_u2.font.size = Pt(11)
    p_u2.font.color.rgb = TEXT_MUTED

    # Title Card
    tcard = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.0), Inches(11.333), Inches(3.2))
    tcard.fill.solid()
    tcard.fill.fore_color.rgb = PANEL_BG
    tcard.line.color.rgb = ACCENT_CYAN
    tcard.line.width = Pt(1.5)

    tf_tc = tcard.text_frame
    tf_tc.word_wrap = True
    tf_tc.margin_left = Inches(0.5)
    tf_tc.margin_top = Inches(0.4)
    p_tc1 = tf_tc.paragraphs[0]
    p_tc1.text = "CONFIGURACIÓN DE AMBIENTES Y PROCEDIMIENTO DE DESPLIEGUE"
    p_tc1.font.size = Pt(24)
    p_tc1.font.bold = True
    p_tc1.font.color.rgb = TEXT_WHITE

    p_tc2 = tf_tc.add_paragraph()
    p_tc2.text = "Prácticas de Integración Continua (CI), Entrega Continua (CD) y DevOps aplicadas a FinanceFlow"
    p_tc2.font.size = Pt(14)
    p_tc2.font.color.rgb = ACCENT_BLUE
    p_tc2.space_before = Pt(8)

    p_tc3 = tf_tc.add_paragraph()
    p_tc3.text = "Proyecto: FinanceFlow — Sistema de Gestión Financiera & Inteligencia con IA (v1.4.0)"
    p_tc3.font.size = Pt(11.5)
    p_tc3.font.color.rgb = TEXT_MUTED
    p_tc3.space_before = Pt(14)

    # Footer Info
    fbox = s1.shapes.add_textbox(Inches(1.0), Inches(5.6), Inches(11.333), Inches(1.4))
    tf_f = fbox.text_frame
    p_f1 = tf_f.paragraphs[0]
    p_f1.text = "Docente Evaluador: Mag. Ricardo Eduardo Valcárcel Alvarado"
    p_f1.font.size = Pt(11)
    p_f1.font.bold = True
    p_f1.font.color.rgb = TEXT_LIGHT

    p_f2 = tf_f.add_paragraph()
    p_f2.text = "Integrantes: Sebastian Arce Bracamonte (2019062886) | Brant Antony Chata Choque (2020067577)"
    p_f2.font.size = Pt(11)
    p_f2.font.color.rgb = ACCENT_CYAN

    # Notes
    s1.notes_slide.notes_text_frame.text = "Minuto 00:00 - 01:00: Saludo formal al docente Mag. Ricardo Valcárcel. Presentación del equipo y título del trabajo."

    # ==========================================
    # SLIDE 2: CONTEXTUALIZACIÓN Y PROBLEMA
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_background(s2)
    add_header(s2, "Contextualización", "Problemática Financiera y la Solución FinanceFlow", 2)

    add_card(s2, 0.8, 1.8, 3.7, 4.8, "⚠️ El Problema Real", [
        "Descontrol financiero en personas y microempresas.",
        "Proliferación de transacciones en Yape, Plin y tarjetas móviles.",
        "Alta fricción operativa por digitación manual de boletas.",
        "85% de usuarios abandonan apps contables en 2 semanas.",
        "Falta de visibilidad de caja y sobreendeudamiento."
    ], badge_color=RGBColor(248, 113, 113))

    add_card(s2, 4.8, 1.8, 3.7, 4.8, "💎 La Solución FinanceFlow", [
        "Plataforma inteligente de control de ingresos y egresos.",
        "Digitalización con Gemini Pro Vision OCR en segundos.",
        "Extracción automática: comercio, monto y categoría.",
        "Dashboard reactivo con balance en tiempo real.",
        "Monetización multi-pasarela (Culqi / Stripe / MercadoPago)."
    ], badge_color=ACCENT_CYAN)

    add_card(s2, 8.8, 1.8, 3.7, 4.8, "🎯 Reto de Construcción II", [
        "El software debe operar con confiabilidad bancaria.",
        "Garantizar disponibilidad continua (SLA 99.9%).",
        "Aislamiento riguroso de ambientes de desarrollo y prod.",
        "Automatizar la entrega de valor mediante CI/CD.",
        "Gobernanza de configuración y control de versiones."
    ], badge_color=ACCENT_BLUE)

    # ==========================================
    # SLIDE 3: COMPETENCIA Y OBJETIVOS
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_background(s3)
    add_header(s3, "Marco Académico", "Competencia y Objetivos de la Actividad", 3)

    add_card(s3, 0.8, 1.8, 5.7, 4.8, "🎓 Competencia del Curso", [
        "Implementa, integra y despliega soluciones de software aplicando estándares de calidad, automatización, gestión de configuración y buenas prácticas DevOps para garantizar su correcta operación en diversos ambientes tecnológicos.",
        "",
        "Resultados de Aprendizaje Clave:",
        "1. Configurar ambientes DEV, QA, STAGING y PROD.",
        "2. Diseñar procedimientos de despliegue seguros.",
        "3. Aplicar DevOps y Pipelines de Integración Continua.",
        "4. Gestionar riesgos y protocolos de Rollback."
    ], badge_color=ACCENT_CYAN)

    add_card(s3, 6.8, 1.8, 5.7, 4.8, "📌 Objetivos Específicos Alcanzados", [
        "1. Investigación teórica profunda de despliegue y herramientas.",
        "2. Análisis y diagramación de la arquitectura de FinanceFlow.",
        "3. Definición formal de parámetros para los 4 ambientes.",
        "4. Diseño del procedimiento formal de despliegue en 6 fases.",
        "5. Matriz RACI, Checklist interactivo y Plan de Rollback.",
        "6. Implementación del pipeline CI/CD en GitHub Actions.",
        "7. Certificación de 12 suites de pruebas y evidencias Git."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 4: TEMA 1 - DESPLIEGUE Y SDLC
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_background(s4)
    add_header(s4, "Parte I: Investigación Teórica", "Tema 1: Despliegue de Software en el SDLC", 4)

    add_card(s4, 0.8, 1.8, 5.7, 4.8, "🚀 Concepto e Importancia", [
        "Definición: Proceso tecnológico integrado para mover el software desde el repositorio hacia ambientes de ejecución.",
        "Puente Crítico de Valor: El software solo genera retorno de inversión cuando opera estable en producción.",
        "Reducción del Time-to-Market: De semanas a minutos.",
        "Fast Feedback Loop: Telemetría inmediata de uso y fallos.",
        "Superficie de Cambio Reducida: Entregas atómicas frecuentes."
    ], badge_color=ACCENT_CYAN)

    add_card(s4, 6.8, 1.8, 5.7, 4.8, "⚖️ Beneficios vs. Riesgos Operativos", [
        "Beneficios Fundamentales:",
        " • Despliegues predecibles y reproducibles.",
        " • Trazabilidad por commit hash y tags inmutables.",
        " • Detección temprana de incompatibilidades de API.",
        "",
        "Riesgos si no hay control formal:",
        " • Incompatibilidad de esquemas de datos (Breaking changes).",
        " • Inyección errónea de variables de entorno y secretos.",
        " • Caída del servicio durante migraciones no idempotentes."
    ], badge_color=ACCENT_AMBER)

    # ==========================================
    # SLIDE 5: ESTRATEGIAS DE DESPLIEGUE
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_background(s5)
    add_header(s5, "Parte I: Investigación Teórica", "Tema 1: Análisis Comparativo de Estrategias", 5)

    add_card(s5, 0.8, 1.8, 3.7, 4.8, "🔄 Recreate vs. Rolling", [
        "Recreate:",
        " • Apaga v1 y enciende v2.",
        " • Simplicidad total, pero con downtime.",
        " • Uso: Entornos de desarrollo / batch.",
        "",
        "Rolling Update:",
        " • Actualiza pods/instancias por lotes.",
        " • Cero tiempo de caída.",
        " • Requiere API retrocompatible.",
        " • Uso en FinanceFlow: Render Backend."
    ], badge_color=ACCENT_BLUE)

    add_card(s5, 4.8, 1.8, 3.7, 4.8, "🔵 Blue/Green Deployment", [
        "Mecanismo:",
        " • Entorno Azul (Producción activa).",
        " • Entorno Verde (Nueva versión validada).",
        " • Conmutación atómica de DNS / Router.",
        "",
        "Ventajas Clave:",
        " • Cero downtime visible.",
        " • Rollback casi instantáneo (< 30s).",
        " • Uso en FinanceFlow: Vercel Edge CDN."
    ], badge_color=ACCENT_CYAN)

    add_card(s5, 8.8, 1.8, 3.7, 4.8, "🐥 Canary & Shadow Launch", [
        "Canary Deployment:",
        " • Enruta 2-5% del tráfico a la nueva versión.",
        " • Evalúa métricas antes de expandir al 100%.",
        " • Ideal para plataformas masivas.",
        "",
        "Shadow / Dark Launching:",
        " • Duplica tráfico real en segundo plano.",
        " • Evalúa modelos de IA sin impacto en usuarios."
    ], badge_color=ACCENT_AMBER)

    # ==========================================
    # SLIDE 6: MANUAL VS AUTOMATIZADO
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_background(s6)
    add_header(s6, "Parte I: Investigación Teórica", "Tema 1: Despliegue Manual vs. Automatizado", 6)

    add_card(s6, 0.8, 1.8, 5.7, 4.8, "🛑 Despliegue Manual (Tradicional)", [
        "Tiempo de Ejecución: Varias horas o días de trabajo.",
        "Tasa de Error: Muy alta por equivocación humana o tipeo.",
        "Consistencia: Pobre ('funciona en mi máquina pero falla allá').",
        "Rollback: Lento, no probado e improvisado.",
        "Documentación: Bitácoras en hojas de texto o correos.",
        "Estrés Operativo: Alto estrés durante ventanas nocturnas."
    ], badge_color=RGBColor(248, 113, 113))

    add_card(s6, 6.8, 1.8, 5.7, 4.8, "⚡ Despliegue Automatizado (CI/CD)", [
        "Tiempo de Ejecución: 2 a 5 minutos orquestados en la nube.",
        "Tasa de Error: Prácticamente nula; pasos deterministas.",
        "Consistencia: Total mediante contenedores Docker e IaC.",
        "Rollback: Automatizado en segundos por punteros de versión.",
        "Trazabilidad: Auditoría completa con SHA y GitHub logs.",
        "Eficiencia de Costos: Elimina trabajo repetitivo (Toil)."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 7: AMBIENTES DE SOFTWARE
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_background(s7)
    add_header(s7, "Parte I: Investigación Teórica", "Tema 2: Segregación de Ambientes de Software", 7)

    add_card(s7, 0.8, 1.8, 2.7, 4.8, "💻 DEV", [
        "Desarrollo Local.",
        "VS Code + Node 20.",
        "Docker MongoDB local.",
        "Hot reload activo.",
        "Datos mockeados.",
        "Logs nivel debug."
    ], badge_color=TEXT_WHITE)

    add_card(s7, 3.8, 1.8, 2.7, 4.8, "🧪 QA", [
        "Control de Calidad.",
        "Render Sandbox.",
        "Pruebas de regresión.",
        "Jest & Supertest.",
        "Postman / Newman.",
        "Réplica de BD sintética."
    ], badge_color=ACCENT_CYAN)

    add_card(s7, 6.8, 1.8, 2.7, 4.8, "🎭 STAGING", [
        "Pre-Producción.",
        "Espejo idéntico a Prod.",
        "Pruebas de carga k6.",
        "Certificados TLS reales.",
        "Simulacro de Rollback.",
        "Aceptación UAT final."
    ], badge_color=ACCENT_AMBER)

    add_card(s7, 9.8, 1.8, 2.7, 4.8, "🚀 PROD", [
        "Producción Real.",
        "Vercel Edge + Render.",
        "MongoDB Atlas M10.",
        "SLA > 99.9%.",
        "Hardening & WAF.",
        "Sentry live telemetry."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 8: GESTIÓN DE CONFIGURACIÓN Y DEVOPS
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_background(s8)
    add_header(s8, "Parte I: Investigación Teórica", "Temas 3 & 4: Gestión de Configuración & DevOps", 8)

    add_card(s8, 0.8, 1.8, 5.7, 4.8, "📦 Gestión de Configuración (SCM)", [
        "Control de Versiones: Hashing inmutable con Git.",
        "Control de Cambios: Pull Requests con revisión obligatoria.",
        "Líneas Base (Baselines): Tags criptográficos congelados.",
        "Trazabilidad Total: Issue -> Commit -> PR -> Artifact -> Prod.",
        "Gestión de Artefactos: 'Build Once, Deploy Anywhere'.",
        "Inmutabilidad de imágenes Docker y paquetes compilados."
    ], badge_color=ACCENT_BLUE)

    add_card(s8, 6.8, 1.8, 5.7, 4.8, "♾️ DevOps & Integración Continua", [
        "Cultura CAMS: Cultura, Automatización, Medición y Compartir.",
        "Continuous Integration (CI): Integraciones diarias con build y tests.",
        "Continuous Delivery (CD): Software siempre listo para producción.",
        "Continuous Deployment: Despliegue 100% automático sin fricción.",
        "Pipeline de Despliegue: Compuertas de calidad (Quality Gates).",
        "Infraestructura como Código (IaC): Definición declarativa."
    ], badge_color=ACCENT_CYAN)

    # ==========================================
    # SLIDE 9: HERRAMIENTAS MODERNAS
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_background(s9)
    add_header(s9, "Parte I: Investigación Teórica", "Tema 5: Análisis del Ecosistema de Herramientas", 9)

    add_card(s9, 0.8, 1.8, 3.7, 4.8, "🔧 Código y Repositorios", [
        "Git:",
        " • Control de versiones distribuido estándar.",
        " • Ramificación rápida y segura.",
        "",
        "GitHub & GitLab:",
        " • Plataformas centrales colaborativas.",
        " • GitHub Actions y GitLab CI/CD nativos.",
        " • Políticas de protección de ramas."
    ], badge_color=ACCENT_CYAN)

    add_card(s9, 4.8, 1.8, 3.7, 4.8, "🐳 Empaquetado & Orquestación", [
        "Docker:",
        " • Contenedores ligeros e inmutables.",
        " • Aislamiento total por cgroups y namespaces.",
        "",
        "Kubernetes (K8s):",
        " • Orquestación distribuida a gran escala.",
        " • Autorreparación y autoescalado horizontal.",
        "",
        "Jenkins:",
        " • Servidor de automatización Open Source."
    ], badge_color=ACCENT_BLUE)

    add_card(s9, 8.8, 1.8, 3.7, 4.8, "🛡️ Calidad & APIs", [
        "SonarQube:",
        " • Análisis estático de código (SAST).",
        " • Quality Gates obligatorios (cobertura >= 75%).",
        "",
        "Postman & Newman:",
        " • Automatización de contratos de API.",
        " • Ejecución de Smoke Tests por consola (CLI).",
        " • Validación de respuestas HTTP 200/201."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 10: ARQUITECTURA DE FINANCEFLOW
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_background(s10)
    add_header(s10, "Parte II: Configuración de Ambientes", "Arquitectura Tecnológica de FinanceFlow", 10)

    add_card(s10, 0.8, 1.8, 3.7, 4.8, "⚛️ Frontend Tier (Vercel)", [
        "React 18 SPA + Tailwind CSS.",
        "Desplegado en Vercel Edge Network.",
        "Compresión Brotli y enrutamiento atómico.",
        "Dashboard con gráficos interactivos Recharts.",
        "Conexión segura vía HTTPS TLS 1.3 a la API."
    ], badge_color=ACCENT_CYAN)

    add_card(s10, 4.8, 1.8, 3.7, 4.8, "🟢 Backend Tier (Render)", [
        "Node.js 20 LTS + Express 5 Core API.",
        "Render Web Service en Alta Disponibilidad.",
        "Middlewares: Helmet, Rate Limit, Zod.",
        "Autenticación con JWT de alta entropía.",
        "Integración con Gemini Vision OCR y Culqi."
    ], badge_color=ACCENT_BLUE)

    add_card(s10, 8.8, 1.8, 3.7, 4.8, "🍃 Persistence & Sentry", [
        "MongoDB Atlas M10 Clúster Dedicado.",
        "Réplicas Multi-AZ en AWS us-east-1.",
        "Cifrado en reposo AES-256.",
        "Sentry Observability en vivo para telemetría.",
        "Monitoreo de Golden Signals de rendimiento."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 11: TABLAS DE CONFIGURACIÓN DE AMBIENTES
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_background(s11)
    add_header(s11, "Parte II: Configuración de Ambientes", "Especificación Técnica de los 4 Ambientes", 11)

    add_card(s11, 0.8, 1.8, 5.7, 2.3, "Ambiente DEV (Desarrollo)", [
        "SO: Windows 11 / Ubuntu WSL2 | IDE: VS Code con ESLint.",
        "Runtimes: Node.js v20.18.0 LTS | React 18 | Express 5.",
        "BD: MongoDB Community v7.0 local en puerto 27017."
    ], badge_color=TEXT_WHITE)

    add_card(s11, 6.8, 1.8, 5.7, 2.3, "Ambiente QA (Calidad)", [
        "Servidor: Render Linux Container dedicado a QA.",
        "Herramientas: Jest, Supertest, Newman CLI Runner.",
        "BD: MongoDB Atlas sandbox QA con datos sintéticos."
    ], badge_color=ACCENT_CYAN)

    add_card(s11, 0.8, 4.3, 5.7, 2.3, "Ambiente STAGING (Preproducción)", [
        "Infraestructura: Render Web Service + Vercel Preview Edge.",
        "Seguridad: Certificado TLS 1.3 gestionado Cloudflare.",
        "Pruebas: Carga con k6, validación de migración de índices."
    ], badge_color=ACCENT_AMBER)

    add_card(s11, 6.8, 4.3, 5.7, 2.3, "Ambiente PROD (Producción)", [
        "Hosting: Vercel CDN Global + Render HA Instance.",
        "BD: MongoDB Atlas M10 (3 nodos réplica en AWS).",
        "Seguridad: Helmet, Rate Limit 100 req/15min, Backups 3-2-1."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 12: GESTIÓN DE VERSIONES FINANCEFLOW
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_background(s12)
    add_header(s12, "Parte II: Configuración de Ambientes", "Estrategia de Ramas y Versiones", 12)

    add_card(s12, 0.8, 1.8, 5.7, 4.8, "🌿 Modelo GitFlow Adaptado", [
        "main: Rama inmutable de producción. Tag inmutable.",
        "develop: Integración continua de features aprobadas.",
        "feature/*: Ramas temporales de casos de uso (ej. feature/culqi).",
        "release/*: Estabilización previa a producción (release/v1.4.0).",
        "hotfix/*: Parches de emergencia desprendidos de main.",
        "",
        "Políticas de Protección de Ramas:",
        " • Push directo prohibido a main y develop.",
        " • Revisión por pares (Peer Review) obligatoria.",
        " • 100% de tests de GitHub Actions en verde."
    ], badge_color=ACCENT_CYAN)

    add_card(s12, 6.8, 1.8, 5.7, 4.8, "🏷️ Convenciones & Versionado Semántico", [
        "Conventional Commits v1.0.0:",
        " • feat(pagos): integrar pasarela de pagos Culqi.",
        " • fix(auth): corregir validación de contraseña Zod.",
        " • test(movimientos): agregar pruebas unitarias de balance.",
        " • docs: actualizar procedimiento formal de despliegue.",
        "",
        "Versionado Semántico (SemVer 2.0.0):",
        " • MAJOR: Cambios con ruptura de compatibilidad.",
        " • MINOR: Nuevas funcionalidades retrocompatibles.",
        " • PATCH: Corrección de bugs y parches de seguridad.",
        " • Versión Oficial: FinanceFlow v1.4.0."
    ], badge_color=ACCENT_BLUE)

    # ==========================================
    # SLIDE 13: SEGURIDAD DE AMBIENTES
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_background(s13)
    add_header(s13, "Parte II: Configuración de Ambientes", "Seguridad en Capas (Defense in Depth)", 13)

    add_card(s13, 0.8, 1.8, 3.7, 4.8, "🔐 Acceso & Red", [
        "1. MFA Obligatorio:",
        " • GitHub, Atlas, Render y Vercel.",
        "2. Gestión de Accesos (IAM):",
        " • Menor privilegio por entorno.",
        "3. Firewall & IP Whitelisting:",
        " • MongoDB Atlas solo acepta IPs de Render.",
        "4. Roles y Permisos (RBAC):",
        " • Protección de rutas /api/admin/*."
    ], badge_color=ACCENT_CYAN)

    add_card(s13, 4.8, 1.8, 3.7, 4.8, "🔒 Criptografía & Hardening", [
        "5. Cifrado en Tránsito:",
        " • TLS 1.3 forzado mediante HSTS.",
        "6. Cifrado en Reposo:",
        " • MongoDB Atlas con AES-256.",
        " • Contraseñas con Bcryptjs (10 salts).",
        "7. Hardening de Cabeceras:",
        " • Helmet CSP, Frameguard y Rate Limit."
    ], badge_color=ACCENT_BLUE)

    add_card(s13, 8.8, 1.8, 3.7, 4.8, "💾 Respaldo & Vulnerabilidades", [
        "8. Respaldo Integral 3-2-1:",
        " • Snapshots continuos cada 6 horas.",
        " • Restauración al minuto (Point-in-Time).",
        " • mongodump diario cifrado en S3.",
        "9. Auditoría de Dependencias:",
        " • npm audit automatizado en CI.",
        " • 0 vulnerabilidades altas o críticas."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 14: PROCEDIMIENTO EN SEIS FASES
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_background(s14)
    add_header(s14, "Parte III: Procedimiento de Despliegue", "Ciclo de Despliegue Estandarizado en Seis Fases", 14)

    add_card(s14, 0.8, 1.8, 3.7, 2.3, "1. Preparación", [
        "Corte de release/v1.4.0.",
        "Generación de Tag Git inmutable.",
        "Backup manual pre-deploy en Atlas."
    ], badge_color=ACCENT_CYAN)

    add_card(s14, 4.8, 1.8, 3.7, 2.3, "2. Pruebas", [
        "12 suites de Jest/Supertest.",
        "Pruebas de contratos con Postman.",
        "npm audit de seguridad sin fallos."
    ], badge_color=ACCENT_BLUE)

    add_card(s14, 8.8, 1.8, 3.7, 2.3, "3. Aprobación", [
        "Revisión técnica del comité CAB.",
        "Evaluación de matriz de riesgos.",
        "Firma digital del acta Go/No-Go."
    ], badge_color=ACCENT_AMBER)

    add_card(s14, 0.8, 4.3, 3.7, 2.3, "4. Despliegue", [
        "Migración idempotente de índices.",
        "Rolling Update del backend Render.",
        "Conmutación atómica SPA en Vercel."
    ], badge_color=ACCENT_GREEN)

    add_card(s14, 4.8, 4.3, 3.7, 2.3, "5. Validación", [
        "Smoke Tests en vivo (HTTP 200).",
        "Verificación de login, balance y OCR.",
        "Inspección de excepciones en Sentry."
    ], badge_color=ACCENT_CYAN)

    add_card(s14, 8.8, 4.3, 3.7, 2.3, "6. Cierre", [
        "Fusión de release a main y develop.",
        "Cierre de tickets y notas de release.",
        "Post-Mortem y lecciones aprendidas."
    ], badge_color=TEXT_WHITE)

    # ==========================================
    # SLIDE 15: ANEXO A - MATRIZ RACI
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_background(s15)
    add_header(s15, "Parte IV: Anexos Obligatorios", "Anexo A: Matriz RACI de Responsabilidades", 15)

    add_card(s15, 0.8, 1.8, 11.733, 4.8, "📋 Distribución de Roles y Responsabilidades", [
        "• Configuración de Variables: Dev (R) | QA (C) | DevOps (A) | DBA (C) | Líder (I)",
        "• Desarrollo y Pruebas Unitarias: Dev (R) | QA (C) | DevOps (I) | Líder (A)",
        "• Pruebas Funcionales y E2E: QA (R) | Dev (C) | DevOps (I) | Líder (A) | Cliente (C)",
        "• Auditoría de Vulnerabilidades: DevOps (R) | Dev (C) | QA (C) | Líder (A)",
        "• Respaldo de Base de Datos: DBA (R / A) | DevOps (C) | Líder (I)",
        "• Aprobación de Ventana (CAB): Líder (R) | DevOps (C) | QA (C) | Product Owner (A)",
        "• Despliegue a Producción: DevOps (R) | Dev (C) | Líder (A) | DBA (C)",
        "• Smoke Tests Post-Deploy: QA (R) | Dev (C) | DevOps (I) | Líder (A) | Cliente (C)",
        "• Ejecución de Rollback: DevOps (R) | DBA (R) | QA (C) | Líder (A)",
        "• Cierre y Aceptación Final: Líder (R) | Product Owner (A) | Todo el equipo (I)"
    ], badge_color=ACCENT_CYAN)

    # ==========================================
    # SLIDE 16: ANEXO B - CHECKLIST
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_background(s16)
    add_header(s16, "Parte IV: Anexos Obligatorios", "Anexo B: Checklist de Despliegue Verificable", 16)

    add_card(s16, 0.8, 1.8, 5.7, 4.8, "✅ Checklist Pre-Despliegue", [
        "[X] Código Aprobado: PR revisado por pares sin cambios sueltos.",
        "[X] Pruebas Completadas: 12 suites Jest pasando (100%).",
        "[X] Cobertura Verificada: Cobertura de código >= 75%.",
        "[X] Auditoría de Dependencias: 0 fallos críticos en npm audit.",
        "[X] Backups Realizados: Snapshot confirmado en MongoDB Atlas.",
        "[X] Documentación: CHANGELOG.md generado para v1.4.0.",
        "[X] Riesgos Identificados: Plan de rollback verificado.",
        "[X] Ventana Notificada: Horario coordinado con interesados."
    ], badge_color=ACCENT_CYAN)

    add_card(s16, 6.8, 1.8, 5.7, 4.8, "🎯 Checklist Post-Despliegue", [
        "[X] Aplicación Disponible: https://financeflow.app HTTP 200.",
        "[X] Backend Operativo: /api/healthcheck respondiendo OK.",
        "[X] Base de Datos Validada: Conexión persistente, índices activos.",
        "[X] Autenticación Verificada: Login JWT y renovación exitosos.",
        "[X] OCR con IA Comprobado: Digitalización de comprobante OK.",
        "[X] Observabilidad Estable: Sentry sin picos de errores 500.",
        "[X] Monitoreo de 15 Minutos: Tráfico normal sin degradación.",
        "[X] Usuario Conforme: Visto bueno formal del Product Owner."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 17: ANEXO C - PLAN DE ROLLBACK
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_background(s17)
    add_header(s17, "Parte IV: Anexos Obligatorios", "Anexo C: Plan de Contingencia y Rollback", 17)

    add_card(s17, 0.8, 1.8, 5.7, 4.8, "⏱️ Objetivos de Recuperación & Gatilladores", [
        "Gatilladores de Rollback Obligatorio:",
        " • Fallo irrecuperable en migración de índices de base de datos.",
        " • Crash continuo del backend tras 3 healthchecks fallidos.",
        " • Pantalla blanca en frontend o fuga de credenciales.",
        "",
        "Métricas de Compromiso Operativo:",
        " • RTO (Recovery Time Objective): < 10 Minutos.",
        " • RPO (Recovery Point Objective): < 15 Minutos.",
        " • Autoriza: Sebastian Arce (Scrum Master).",
        " • Ejecutan: Brant Chata (DevOps / DBA)."
    ], badge_color=ACCENT_AMBER)

    add_card(s17, 6.8, 1.8, 5.7, 4.8, "🔄 Procedimiento de Reversión Paso a Paso", [
        "Paso 1: Reversión Frontend en Vercel (< 30 segundos):",
        " • Reasignar alias de producción a la versión v1.3.0.",
        "",
        "Paso 2: Conmutación Backend en Render (2-3 minutos):",
        " • Rollback al tag inmutable anterior en la consola.",
        "",
        "Paso 3: Restauración en MongoDB Atlas (< 5 minutos):",
        " • Point-in-Time Restore al minuto previo a la ventana.",
        "",
        "Validación Posterior & RCA:",
        " • Pruebas de humo sobre versión restaurada.",
        " • Reunión post-mortem obligatoria en 24 horas."
    ], badge_color=ACCENT_CYAN)

    # ==========================================
    # SLIDE 18: ANEXO D - PIPELINE CI/CD
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_background(s18)
    add_header(s18, "Parte IV: Anexos Obligatorios", "Anexo D: Pipeline CI/CD en GitHub Actions", 18)

    add_card(s18, 0.8, 1.8, 5.7, 4.8, "⚙️ Flujo del Pipeline Automatizado", [
        "Archivo: .github/workflows/deploy-pipeline.yml",
        "",
        "Stage 1: DevSecOps & Linting (npm audit + ESLint).",
        "Stage 2: Pruebas Automáticas (Jest Backend + Build React).",
        "Stage 3: Quality Gate (Cobertura >= 75% + 0 bugs críticos).",
        "Stage 4: Deploy a QA (Automático en rama develop).",
        "Stage 5: Deploy a Staging (Automático en rama main).",
        "Stage 6: Deploy a Producción (Tag de release v*.*.*)."
    ], badge_color=ACCENT_CYAN)

    add_card(s18, 6.8, 1.8, 5.7, 4.8, "🛡️ Beneficios del Pipeline", [
        "• Fail Fast: Detención inmediata ante cualquier prueba rota.",
        "• Secrets Cifrados: Inyección de JWT_SECRET y MONGODB_URI.",
        "• Cache de Dependencias: Tiempos de build reducidos a 90s.",
        "• Multi-Stage Concurrente: Trabajos paralelos backend/frontend.",
        "• Verificación de Snapshot: Backup validado previo a PROD.",
        "• Notificación en Tiempo Real: Estado directo en el PR."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 19: EVIDENCIAS DE PRUEBAS Y GIT
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    set_background(s19)
    add_header(s19, "Entregables 8 & 9", "Evidencias Reales de Git y Pruebas Unitarias", 19)

    add_card(s19, 0.8, 1.8, 5.7, 4.8, "🌿 Repositorio Git Oficial", [
        "Repositorio: https://github.com/KrCrimson/FinanceFlow",
        "Rama Activa: main (sincronizada con origin/main).",
        "Ramas de Módulos: feature/admin-dashboard, mobile, doc.",
        "",
        "Commits de Certificación:",
        " • fix(pagos): consolida pasarela Culqi y corrige plan Pro.",
        " • Create GUIA_EJECUCION_PRUEBAS.md.",
        " • feat(auth): validaciones Zod y proteccion fuerza bruta.",
        "Trazabilidad completa con hashes SHA-1."
    ], badge_color=ACCENT_BLUE)

    add_card(s19, 6.8, 1.8, 5.7, 4.8, "🧪 Certificación de Pruebas (Jest)", [
        "Comando: npm test --prefix backend",
        "",
        "RESULTADO CERTIFICADO:",
        " • Test Suites: 12 passed, 12 total (100%).",
        " • Tests: 29 passed, 29 total (100%).",
        " • Snapshots: 0 total.",
        " • Tiempo: 6.797 segundos.",
        "",
        "Módulos Validados: Movimientos, Recuperación de Claves, E2E, Usuarios Controller, Seguridad e Inyección NoSQL."
    ], badge_color=ACCENT_GREEN)

    # ==========================================
    # SLIDE 20: CONCLUSIONES Y PREGUNTAS
    # ==========================================
    s20 = prs.slides.add_slide(blank_layout)
    set_background(s20)
    add_header(s20, "Cierre de Sustentación", "Conclusiones y Ronda de Preguntas", 20)

    add_card(s20, 0.8, 1.8, 5.7, 4.8, "🎓 Conclusiones Principales", [
        "1. La excelencia en la construcción de software trasciende la codificación: radica en la repetibilidad y el control de ambientes.",
        "2. La estrategia Blue/Green combinada con Vercel y Render garantiza cero tiempo de caída para FinanceFlow.",
        "3. El pipeline automatizado en GitHub Actions elimina el error humano y garantiza compuertas de calidad estrictas.",
        "4. El plan de rollback con RTO < 10m provee resiliencia real.",
        "5. Las 12 suites de prueba certifican la calidad antes de PROD."
    ], badge_color=ACCENT_CYAN)

    add_card(s20, 6.8, 1.8, 5.7, 4.8, "💬 Ronda de Preguntas", [
        "Agradecemos su atención.",
        "",
        "Expositores:",
        " • Sebastian Arce Bracamonte (Código: 2019062886)",
        " • Brant Antony Chata Choque (Código: 2020067577)",
        "",
        "Asignatura: Construcción de Software II",
        "Docente: Mag. Ricardo Eduardo Valcárcel Alvarado",
        "Universidad Privada de Tacna — 2026",
        "",
        "¿Preguntas del jurado docente?"
    ], badge_color=ACCENT_GREEN)

    output_filename = "PRESENTACION_SUSTENTACION_DESPLIEGUE.pptx"
    prs.save(output_filename)
    print(f"Presentación PowerPoint generada exitosamente: {output_filename}")

if __name__ == "__main__":
    create_deck()
