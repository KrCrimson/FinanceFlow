import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Corporate Theme Palette (FinanceFlow Dark Luxury)
    BG_DARK = RGBColor(11, 19, 43)        # Deep Navy Slate
    PANEL_BG = RGBColor(22, 33, 62)       # Elevated Navy Panel
    PANEL_BORDER = RGBColor(46, 64, 100)  # Subtle border
    ACCENT_GREEN = RGBColor(16, 185, 129) # Emerald #10B981
    ACCENT_CYAN = RGBColor(6, 182, 212)   # Cyan #06B6D4
    ACCENT_AMBER = RGBColor(245, 158, 11) # Amber #F59E0B
    ACCENT_RED = RGBColor(239, 68, 68)    # Red #EF4444
    TEXT_WHITE = RGBColor(255, 255, 255)  # White
    TEXT_MUTED = RGBColor(148, 163, 184)  # Slate Muted #94A3B8
    TEXT_LIGHT = RGBColor(226, 232, 240)  # Light Slate

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, category, title, page_num, total_pages=8):
        # Category tag / section number
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8), Inches(0.4))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category.upper()
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = ACCENT_GREEN

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(10), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE

        # Top decorative line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = PANEL_BORDER
        line.line.fill.background()

        # Page number
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(0.5), Inches(1.0), Inches(0.4))
        tf_n = num_box.text_frame
        p_n = tf_n.paragraphs[0]
        p_n.alignment = PP_ALIGN.RIGHT
        p_n.text = f"{page_num} / {total_pages}"
        p_n.font.size = Pt(11)
        p_n.font.bold = True
        p_n.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 1: PORTADA EJECUTIVA
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Decorative ambient glow panel
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), )
    glow.fill.solid()
    glow.fill.fore_color.rgb = PANEL_BG
    glow.line.color.rgb = PANEL_BORDER
    glow.line.width = Pt(1.5)

    # Institution & Course
    inst_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(10.9), Inches(0.5))
    tf1 = inst_box.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "UNIVERSIDAD PRIVADA DE TACNA • ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS"
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = ACCENT_CYAN

    # Main Title
    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(1.1))
    tf_t = t_box.text_frame
    p_t = tf_t.paragraphs[0]
    p_t.text = "FinanceFlow — Sistema de Gestión Financiera"
    p_t.font.size = Pt(32)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

    # Subtitle
    sub_box = s1.shapes.add_textbox(Inches(1.2), Inches(2.9), Inches(10.9), Inches(0.6))
    tf_s = sub_box.text_frame
    p_s = tf_s.paragraphs[0]
    p_s.text = "Informe Ejecutivo de Estado & Arquitectura de Abstracción (v1.3.0)"
    p_s.font.size = Pt(18)
    p_s.font.color.rgb = ACCENT_GREEN

    # Description Paragraph
    desc_box = s1.shapes.add_textbox(Inches(1.2), Inches(3.6), Inches(10.9), Inches(0.8))
    tf_d = desc_box.text_frame
    tf_d.word_wrap = True
    p_d = tf_d.paragraphs[0]
    p_d.text = "Plataforma integral de balance económico potenciada con Inteligencia Artificial (Gemini Vision OCR), clasificación probabilística (Naive Bayes) y desacoplamiento enterprise mediante SDK propio."
    p_d.font.size = Pt(13)
    p_d.font.color.rgb = TEXT_LIGHT

    # Metadata Grid (3 cards)
    meta_cards = [
        ("EQUIPO DE DESARROLLO", "Sebastian Arce Bracamonte\nBrant Antony Chata Choque", ACCENT_GREEN),
        ("SUPERVISIÓN ACADÉMICA", "Mag. Ricardo Valcárcel Alvarado\nConstrucción de Software I", ACCENT_CYAN),
        ("PARÁMETROS DE EXPOSICIÓN", "Tiempo Objetivo: < 5 Minutos\nEstado del Sistema: v1.3.0", ACCENT_AMBER)
    ]
    for i, (title, content, col) in enumerate(meta_cards):
        c_left = Inches(1.2 + i * 3.75)
        c_top = Inches(4.7)
        c_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, Inches(3.4), Inches(1.4))
        c_card.fill.solid()
        c_card.fill.fore_color.rgb = BG_DARK
        c_card.line.color.rgb = col
        c_card.line.width = Pt(1)

        c_tb = s1.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.15), Inches(3.0), Inches(1.1))
        tf_c = c_tb.text_frame
        tf_c.word_wrap = True
        p_h = tf_c.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(10)
        p_h.font.bold = True
        p_h.font.color.rgb = col

        p_b = tf_c.add_paragraph()
        p_b.text = content
        p_b.font.size = Pt(11)
        p_b.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 2: RESUMEN EJECUTIVO & AVANCE GENERAL (92%)
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "01. Resumen Ejecutivo & Estado Operativo", "Avance Global del Sistema: 92% Consolidado", 2)

    # 3 High-Impact KPI Blocks
    kpis = [
        ("92%", "AVANCE GENERAL", "Sistema implementado y operativo; en fase de hardening y estabilización (Sprint 7)", ACCENT_GREEN),
        ("15 / 15", "REQUERIMIENTOS SRS", "100% de funcionalidades core desarrolladas (Auth, Movimientos, OCR, Reportes)", ACCENT_CYAN),
        ("66 / 66", "TESTS SDK PARALELOS", "100% éxito en pruebas de carga y estrés; latencia media ultraestable de 172 ms", ACCENT_AMBER)
    ]
    for i, (val, label, sub, col) in enumerate(kpis):
        k_left = Inches(0.8 + i * 4.0)
        k_top = Inches(1.65)
        k_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, k_left, k_top, Inches(3.733), Inches(1.7))
        k_box.fill.solid()
        k_box.fill.fore_color.rgb = PANEL_BG
        k_box.line.color.rgb = col
        k_box.line.width = Pt(1.5)

        tb = s2.shapes.add_textbox(k_left + Inches(0.2), k_top + Inches(0.1), Inches(3.333), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p_val = tf.paragraphs[0]
        p_val.text = val
        p_val.font.size = Pt(34)
        p_val.font.bold = True
        p_val.font.color.rgb = col

        p_lbl = tf.add_paragraph()
        p_lbl.text = label
        p_lbl.font.size = Pt(11)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = TEXT_WHITE

        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(9.5)
        p_sub.font.color.rgb = TEXT_MUTED

    # Bottom 2 Split Panels
    # Panel 1: Problema y Solución
    p1_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.6), Inches(5.7), Inches(3.3))
    p1_card.fill.solid()
    p1_card.fill.fore_color.rgb = PANEL_BG
    p1_card.line.color.rgb = PANEL_BORDER

    p1_tb = s2.shapes.add_textbox(Inches(1.0), Inches(3.8), Inches(5.3), Inches(2.9))
    tf1 = p1_tb.text_frame
    tf1.word_wrap = True
    p1_t = tf1.paragraphs[0]
    p1_t.text = "🎯 PROBLEMA & VALOR RESUELTO"
    p1_t.font.size = Pt(13)
    p1_t.font.bold = True
    p1_t.font.color.rgb = ACCENT_GREEN

    points1 = [
        ("Fricción Cero en Registro:", " Erradica el llenado manual de gastos mediante escaneo inteligente de comprobantes (Yape, Plin, BCP)."),
        ("Toma de Decisiones en Tiempo Real:", " Planificador matemático que proyecta compras según capacidad real de ahorro mensual."),
        ("Integridad Contable Impecable:", " Cierre y reposición de caja chica, bloqueo físico de periodos mensuales y autoarchivado M-2.")
    ]
    for b_title, b_desc in points1:
        p = tf1.add_paragraph()
        p.text = f"• {b_title}" + b_desc
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT

    # Panel 2: Eficiencia Presupuestal & Entregables
    p2_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(3.6), Inches(5.7), Inches(3.3))
    p2_card.fill.solid()
    p2_card.fill.fore_color.rgb = PANEL_BG
    p2_card.line.color.rgb = PANEL_BORDER

    p2_tb = s2.shapes.add_textbox(Inches(7.0), Inches(3.8), Inches(5.3), Inches(2.9))
    tf2 = p2_tb.text_frame
    tf2.word_wrap = True
    p2_t = tf2.paragraphs[0]
    p2_t.text = "💰 EFICIENCIA DE RECURSOS & PREPARACIÓN"
    p2_t.font.size = Pt(13)
    p2_t.font.bold = True
    p2_t.font.color.rgb = ACCENT_CYAN

    points2 = [
        ("Costo Cloud Cero (S/. 0.00):", " Infraestructura optimizada para niveles gratuitos en MongoDB Atlas, Vercel y Render sin costos ocultos."),
        ("Presupuesto de Desarrollo:", " S/. 12,000 ejecutados (2 desarrolladores a 3 meses) con 93.75% de eficiencia financiera total."),
        ("Auditoría de Seguridad Remediada:", " 12/12 hallazgos de seguridad certificados (CVSS 9.8 a 3.1) en modo Fail-Closed criptográfico.")
    ]
    for b_title, b_desc in points2:
        p = tf2.add_paragraph()
        p.text = f"• {b_title}" + b_desc
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 3: CRONOGRAMA EJECUTIVO & LÍNEA DE TIEMPO (GANTT)
    # -------------------------------------------------------------
    s_gantt = prs.slides.add_slide(blank_layout)
    set_slide_background(s_gantt)
    add_header(s_gantt, "02. Cronograma de Desarrollo", "Línea de Tiempo Oficial por Sprints e Hitos de Entrega (Gantt)", 3, 8)

    gantt_img_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cronograma_financeflow.png")
    if os.path.exists(gantt_img_path):
        s_gantt.shapes.add_picture(gantt_img_path, Inches(0.8), Inches(1.55), Inches(11.733), Inches(5.35))

    # -------------------------------------------------------------
    # SLIDE 4: ARQUITECTURA TECNOLÓGICA & STACK
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "03. Arquitectura de Sistemas", "Ecosistema Full-Stack Distribuido & Inteligencia Artificial", 4, 8)

    cols = [
        ("FRONTEND & MÓVIL", ACCENT_CYAN, [
            "React 18 SPA (React Router v7)",
            "Tailwind CSS + Recharts dinámicos",
            "React Hook Form con Zod 4",
            "Cliente Móvil React Native (Expo)",
            "Admin Dashboard HTML5 independiente"
        ]),
        ("BACKEND REST API", ACCENT_GREEN, [
            "Node.js 18 + Express v5.2",
            "Patrón 3 Capas (Routes-Controllers-Services)",
            "JWT estricto sin fallbacks (TTL 7d)",
            "Helmet, CORS estricto & Rate Limit",
            "Observabilidad Sentry Live en Node"
        ]),
        ("MOTOR DE INTELIGENCIA", ACCENT_AMBER, [
            "Google Gemini Pro Vision API",
            "Microservicio Python 3.10 FastAPI",
            "OpenCV (Binarización & Filtros Gauss)",
            "Pytesseract OCR + Regex extractor",
            "Multinomial Naive Bayes + TF-IDF"
        ]),
        ("MONETIZACIÓN & BD", RGBColor(168, 85, 247), [
            "MongoDB Atlas (Replica Set Mongoose)",
            "Multi-Pasarela: Stripe (USD) & Flow.cl",
            "Mercado Pago (PEN) & Yape Manual",
            "Webhooks seguros HMAC Fail-Closed",
            "Cierres de Caja Chica & Historial M-2"
        ])
    ]
    for i, (c_title, c_color, items) in enumerate(cols):
        c_left = Inches(0.8 + i * 3.0)
        c_top = Inches(1.65)
        c_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, Inches(2.733), Inches(5.2))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = PANEL_BG
        c_box.line.color.rgb = c_color
        c_box.line.width = Pt(1.5)

        tb = s3.shapes.add_textbox(c_left + Inches(0.15), c_top + Inches(0.2), Inches(2.433), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = c_title
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = c_color

        for itm in items:
            p = tf.add_paragraph()
            p.text = f"✓ {itm}"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 5: ESTADO DE ABSTRACCIÓN: JERARQUÍA & PATRONES
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "04. Estado de Abstracción", "Jerarquía de 6 Niveles y Patrones de Diseño Implementados", 5, 8)

    # Left: Layer Hierarchy
    lh_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.2))
    lh_card.fill.solid()
    lh_card.fill.fore_color.rgb = PANEL_BG
    lh_card.line.color.rgb = ACCENT_CYAN

    lh_tb = s4.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.3), Inches(4.8))
    tf_lh = lh_tb.text_frame
    tf_lh.word_wrap = True
    p_lh_t = tf_lh.paragraphs[0]
    p_lh_t.text = "🏛️ JERARQUÍA DE CAPAS DE ABSTRACCIÓN"
    p_lh_t.font.size = Pt(13)
    p_lh_t.font.bold = True
    p_lh_t.font.color.rgb = ACCENT_CYAN

    layers = [
        ("Nivel 5: Presentación (UI)", "React 18 SPA, Mobile Expo y Admin Portal totalmente desacoplados de consultas SQL/NoSQL."),
        ("Nivel 4: Estado & Hooks", "useAnalisisGastos, useAuth y useImageToMovimiento aíslan cálculos matemáticos y reactividad."),
        ("Nivel 3: Consumo & SDK", "Paquete @sistema-balance/sdk y adaptadores aíslan el protocolo HTTP y la gestión de tokens."),
        ("Nivel 2: Aplicación & Router", "Express Routers, validadores Zod y middlewares de seguridad aíslan el transporte."),
        ("Nivel 1: Dominio & Negocio", "Servicios puros (movimientos, cierres, ocr, usuarios) retornan datos puros sin tocar HTTP."),
        ("Nivel 0: Persistencia", "Esquemas Mongoose y clúster NoSQL de MongoDB Atlas abstraen el disco físico.")
    ]
    for l_title, l_desc in layers:
        p = tf_lh.add_paragraph()
        p.text = f"• {l_title}: {l_desc}"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_LIGHT

    # Right: 4 Applied Patterns
    pat_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.2))
    pat_card.fill.solid()
    pat_card.fill.fore_color.rgb = PANEL_BG
    pat_card.line.color.rgb = ACCENT_GREEN

    pat_tb = s4.shapes.add_textbox(Inches(7.0), Inches(1.85), Inches(5.3), Inches(4.8))
    tf_pat = pat_tb.text_frame
    tf_pat.word_wrap = True
    p_pat_t = tf_pat.paragraphs[0]
    p_pat_t.text = "⚙️ PATRONES DE DISEÑO CLAVE"
    p_pat_t.font.size = Pt(13)
    p_pat_t.font.bold = True
    p_pat_t.font.color.rgb = ACCENT_GREEN

    patterns = [
        ("Fachada (Facade Pattern):", " BalanceSDK unifica y encapsula HttpClient, interceptores, estadísticas y 4 módulos de API en una sola clase."),
        ("Adaptador (Adapter Pattern):", " Capa *-adapter.js permite transición gradual entre servicios tradicionales y el nuevo SDK mediante Feature Flags."),
        ("Gateway / Strategy Pattern:", " Enrutador de pagos unifica Stripe, Flow.cl y Mercado Pago en contratos de transacción consistentes."),
        ("Pipeline Pattern (Visión/ML):", " Cadena secuencial de binarización Otsu, filtros OpenCV, extracción OCR y clasificación Bayesiana.")
    ]
    for p_name, p_desc in patterns:
        p = tf_pat.add_paragraph()
        p.text = f"✓ {p_name}" + p_desc
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 6: AUDITORÍA DE ABSTRACCIÓN: FUGAS & DEUDA TÉCNICA
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "05. Diagnóstico de Calidad", "Auditoría de Abstracción: 5 Fugas y Deudas Identificadas", 6, 8)

    leaks = [
        ("Fuga #1: Dualidad de Consumo de Red", "ALTO", ACCENT_RED,
         "En movimientosService.js y reportesService.js coexiste un fallback de emergencia con fetch directo (apiCall), saltándose los adaptadores y estadísticas del SDK Balance."),
        ("Fuga #2: Acoplamiento a localStorage", "MEDIO", ACCENT_AMBER,
         "Llamadas dispersas directas a localStorage.getItem('token') en servicios en lugar de utilizar un TokenStorageProvider desacoplado para web y móvil."),
        ("Fuga #3: Validación Duplicada Asimétrica", "MEDIO", ACCENT_AMBER,
         "Reglas de negocio validadas por duplicado en los esquemas declarativos Zod (middleware) e imperativamente dentro de movimientos.service.js."),
        ("Fuga #4: Violación DRY en Verificación de Claves", "MEDIO", ACCENT_AMBER,
         "Lógica bcrypt.compare repetida textualmente en 3 servicios distintos en lugar de delegarla al método de instancia usuario.verificarPassword()."),
        ("Fuga #5: Presencia de Números Mágicos", "BAJO", ACCENT_CYAN,
         "Valores literales sin nombrar dispersos en el código: 1000 (caja chica), 2 (meses M-2), 5 (cuota free OCR) y '7d' (expiración JWT).")
    ]
    for i, (l_title, l_sev, l_col, l_desc) in enumerate(leaks):
        y_top = Inches(1.65 + i * 1.05)
        l_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y_top, Inches(11.733), Inches(0.95))
        l_card.fill.solid()
        l_card.fill.fore_color.rgb = PANEL_BG
        l_card.line.color.rgb = l_col
        l_card.line.width = Pt(1)

        # Severity Badge
        badge = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), y_top + Inches(0.18), Inches(1.1), Inches(0.55))
        badge.fill.solid()
        badge.fill.fore_color.rgb = l_col
        badge.line.fill.background()
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = l_sev
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = TEXT_WHITE

        # Text Content
        l_tb = s5.shapes.add_textbox(Inches(2.3), y_top + Inches(0.08), Inches(10.0), Inches(0.8))
        tf_l = l_tb.text_frame
        tf_l.word_wrap = True
        p_t = tf_l.paragraphs[0]
        p_t.text = l_title
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE

        p_d = tf_l.add_paragraph()
        p_d.text = l_desc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 7: GESTIÓN DE CALIDAD, PRUEBAS & SPRINT 7
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "06. Aseguramiento de Calidad", "Cobertura de Pruebas & Plan de Hardening (Sprint 7)", 7, 8)

    # Left: Testing Coverage
    tc_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.2))
    tc_card.fill.solid()
    tc_card.fill.fore_color.rgb = PANEL_BG
    tc_card.line.color.rgb = ACCENT_CYAN

    tc_tb = s6.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(5.3), Inches(4.8))
    tf_tc = tc_tb.text_frame
    tf_tc.word_wrap = True
    p_tc_t = tf_tc.paragraphs[0]
    p_tc_t.text = "🧪 COBERTURA Y VALIDACIÓN ACTUAL"
    p_tc_t.font.size = Pt(13)
    p_tc_t.font.bold = True
    p_tc_t.font.color.rgb = ACCENT_CYAN

    test_items = [
        ("Backend Suites Jest:", " 12 suites de prueba y 29 tests automatizados cubriendo auth, movimientos, cierres, pagos y seguridad."),
        ("SDK Testing Paralelo:", " 66 pruebas de integración y estrés ejecutadas (6/6 rápido, 10/10 completo, 50/50 estrés) con 100% éxito."),
        ("Auditoría de Seguridad:", " Source-to-Sink exhaustivo con remediación de 12 vulnerabilidades (IDOR, Secretos JWT, NoSQL Injection, HMAC)."),
        ("Observabilidad Activa:", " Sentry en tiempo real capturando trazas y Session Replays sin degradación de rendimiento.")
    ]
    for t_title, t_desc in test_items:
        p = tf_tc.add_paragraph()
        p.text = f"✓ {t_title}" + t_desc
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT

    # Right: Sprint 7 Actions
    sp7_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.2))
    sp7_card.fill.solid()
    sp7_card.fill.fore_color.rgb = PANEL_BG
    sp7_card.line.color.rgb = ACCENT_AMBER

    sp7_tb = s6.shapes.add_textbox(Inches(7.0), Inches(1.85), Inches(5.3), Inches(4.8))
    tf_sp = sp7_tb.text_frame
    tf_sp.word_wrap = True
    p_sp_t = tf_sp.paragraphs[0]
    p_sp_t.text = "🎯 ACTIVIDADES SPRINT 7 (HARDENING v1.4.0)"
    p_sp_t.font.size = Pt(13)
    p_sp_t.font.bold = True
    p_sp_t.font.color.rgb = ACCENT_AMBER

    sp7_actions = [
        ("1. Tests Jest de Frontend (CP-38 a CP-42):", " Automatizar pruebas del Planificador de Compras y exclusión estricta de passwordHash en Perfil."),
        ("2. Ruta Independiente /planificador:", " Extraer el componente a PlanificadorPage.jsx con URL canónica protegida."),
        ("3. Eliminación Real de Cuenta:", " Conectar DELETE /api/usuarios/me con persistencia y purga controlada en base de datos."),
        ("4. Consolidar Consumo de SDK:", " Retirar el fallback de emergencia apiCall y unificar el cliente HTTP."),
        ("5. URLs de Producción:", " Actualizar dominios reales en DEPLOY_FRONTEND.md y DEPLOY_BACKEND.md.")
    ]
    for a_title, a_desc in sp7_actions:
        p = tf_sp.add_paragraph()
        p.text = f"• {a_title}" + a_desc
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 8: CONCLUSIÓN EJECUTIVA & PRÓXIMO HITO
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "07. Conclusión & Cierre", "Dictamen Técnico Ejecutivo & Siguiente Hito", 8, 8)

    concl_cards = [
        ("MADUREZ TÉCNICA (8.6 / 10)", ACCENT_GREEN,
         "FinanceFlow cuenta con un núcleo transaccional robusto, una arquitectura en 3 capas limpia y módulos de vanguardia (Gemini Vision + Naive Bayes) plenamente funcionales y auditados."),
        ("SEGURIDAD & INTEGRIDAD", ACCENT_CYAN,
         "El sistema erradicó el 100% de vulnerabilidades críticas. La integridad contable está blindada mediante cierres de caja chica inmutables y autoarchivado M-2."),
        ("SIGUIENTE HITO: PASE A PRODUCCIÓN (v1.4.0)", ACCENT_AMBER,
         "La ejecución del Sprint 7 cerrará las 4 deudas técnicas de hardening, formalizando la cobertura de pruebas al 100% y entregando una plataforma lista para el despliegue final.")
    ]
    for i, (c_t, c_col, c_desc) in enumerate(concl_cards):
        c_top = Inches(1.65 + i * 1.55)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), c_top, Inches(11.733), Inches(1.35))
        card.fill.solid()
        card.fill.fore_color.rgb = PANEL_BG
        card.line.color.rgb = c_col
        card.line.width = Pt(1.5)

        tb = s7.shapes.add_textbox(Inches(1.1), c_top + Inches(0.15), Inches(11.1), Inches(1.05))
        tf = tb.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = c_t
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = c_col

        p_d = tf.add_paragraph()
        p_d.text = c_desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_LIGHT

    # Footer note
    f_box = s7.shapes.add_textbox(Inches(0.8), Inches(6.5), Inches(11.733), Inches(0.4))
    tf_f = f_box.text_frame
    p_f = tf_f.paragraphs[0]
    p_f.alignment = PP_ALIGN.CENTER
    p_f.text = "FinanceFlow v1.3.0 • Escuela Profesional de Ingeniería de Sistemas • Universidad Privada de Tacna • 2026"
    p_f.font.size = Pt(10)
    p_f.font.color.rgb = TEXT_MUTED

    # Output path
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "PRESENTACION_EJECUTIVA_FINANCEFLOW.pptx")
    prs.save(out_path)
    print(f"Presentation saved successfully at: {out_path}")

if __name__ == "__main__":
    create_presentation()
