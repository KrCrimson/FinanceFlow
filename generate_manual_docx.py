import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Establece el color de fondo de una celda."""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    """Establece los márgenes internos (padding) de una celda en dxa."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D0D7DE", sz="4", val="single"):
    """Establece bordes sutiles y profesionales en una tabla."""
    tblPr = table._tbl.tblPr
    borders_elm = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders_elm)

def create_document():
    doc = Document()
    
    # Configuración de márgenes estándar de 1 pulgada (2.54 cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.header_distance = Inches(0.5)
        section.footer_distance = Inches(0.5)
        
        # Encabezado
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("DOCUMENTO DE GESTIÓN TECNOLÓGICA")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8.5)
        hrun.font.italic = True
        hrun.font.color.rgb = RGBColor(90, 115, 140)
        
        # Pie de página
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Plan de despliegue de software • Documento adaptable y sujeto a aprobación")
        frun.font.name = "Arial"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(120, 130, 140)

    # Colores corporativos del sistema FinanceFlow
    C_NAVY = RGBColor(27, 54, 93)      # #1B365D
    C_DARK = RGBColor(33, 37, 41)      # #212529
    C_MUTED = RGBColor(90, 105, 120)   # #5A6978
    C_BLUE = RGBColor(15, 76, 129)     # #0F4C81
    
    HEX_HEADER = "E9EEF4"              # Azul claro sutil para encabezados de tabla
    HEX_ALT_ROW = "F9FBFC"             # Filas alternas
    HEX_CODE_BG = "F6F8FA"             # Fondo bloques de código

    # --- TÍTULO PRINCIPAL ---
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(0)
    p_pre.paragraph_format.space_after = Pt(4)
    r_pre = p_pre.add_run("DOCUMENTO DE GESTIÓN TECNOLÓGICA")
    r_pre.font.name = "Arial"
    r_pre.font.size = Pt(10)
    r_pre.font.bold = True
    r_pre.font.color.rgb = C_MUTED

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(2)
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("PLAN DE DESPLIEGUE DE SOFTWARE")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(20)
    r_title.font.bold = True
    r_title.font.color.rgb = C_NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Modelo de implementación y puesta en producción | Versión 1.3.0")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10)
    r_sub.font.color.rgb = C_MUTED

    # --- METADATOS EN TABLA ELEGANTE ---
    meta_table = doc.add_table(rows=2, cols=1)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    set_table_borders(meta_table, color="B0C4DE", sz="6", val="single")
    
    cell_meta1 = meta_table.cell(0, 0)
    cell_meta1.width = Inches(6.5)
    set_cell_background(cell_meta1, "F4F7FA")
    set_cell_margins(cell_meta1, top=100, bottom=80, left=150, right=150)
    pm1 = cell_meta1.paragraphs[0]
    pm1.paragraph_format.space_after = Pt(0)
    rm1 = pm1.add_run("Proyecto / sistema: ")
    rm1.font.bold = True
    rm1.font.size = Pt(9)
    pm1.add_run("FinanceFlow — Sistema de Gestión Financiera & Balance Contable con IA  |  ")
    rm1_org = pm1.add_run("Organización: ")
    rm1_org.font.bold = True
    rm1_org.font.size = Pt(9)
    pm1.add_run("FinanceFlow Inc. / KrCrimson  |  ")
    rm1_fec = pm1.add_run("Fecha: ")
    rm1_fec.font.bold = True
    rm1_fec.font.size = Pt(9)
    pm1.add_run("22/10/2026")
    
    cell_meta2 = meta_table.cell(1, 0)
    cell_meta2.width = Inches(6.5)
    set_cell_background(cell_meta2, "F4F7FA")
    set_cell_margins(cell_meta2, top=80, bottom=100, left=150, right=150)
    pm2 = cell_meta2.paragraphs[0]
    pm2.paragraph_format.space_after = Pt(0)
    rm2_resp = pm2.add_run("Responsable del plan: ")
    rm2_resp.font.bold = True
    rm2_resp.font.size = Pt(9)
    pm2.add_run("Equipo de Arquitectura, DevOps y Calidad  |  ")
    rm2_dest = pm2.add_run("Ambiente de destino: ")
    rm2_dest.font.bold = True
    rm2_dest.font.size = Pt(9)
    pm2.add_run("Producción (Cloud Híbrido: MongoDB Atlas + Render + Vercel)")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Funciones de utilidad para el contenido
    def add_heading1(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(4)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = C_NAVY
        return h

    def add_heading2(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(3)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = C_BLUE
        return h

    def add_heading3(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(2)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = C_DARK
        return h

    def add_body(text, space_after=6, bold=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.color.rgb = C_DARK
        if bold:
            r.font.bold = True
        return p

    def add_bullet(lead, text, space_after=3):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if lead:
            r_lead = p.add_run(lead + " ")
            r_lead.font.name = "Arial"
            r_lead.font.size = Pt(9.5)
            r_lead.font.bold = True
            r_lead.font.color.rgb = C_DARK
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.color.rgb = C_DARK
        return p

    def add_code_block(code_text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, HEX_CODE_BG)
        set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
        set_table_borders(table, color="D0D7DE", sz="4", val="single")
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.05
        r = p.add_run(code_text.strip())
        r.font.name = "Consolas"
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(36, 41, 47)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def populate_table(headers, data, col_widths=None):
        table = doc.add_table(rows=len(data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        set_table_borders(table, color="D0D7DE", sz="4", val="single")
        
        # Header Row
        hdr_row = table.rows[0]
        for idx, h_text in enumerate(headers):
            cell = hdr_row.cells[idx]
            if col_widths and idx < len(col_widths):
                cell.width = col_widths[idx]
            set_cell_background(cell, HEX_HEADER)
            set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(h_text)
            r.font.name = "Arial"
            r.font.size = Pt(9)
            r.font.bold = True
            r.font.color.rgb = C_NAVY
            
        # Data Rows
        for r_idx, row_data in enumerate(data):
            row = table.rows[r_idx + 1]
            bg_color = HEX_ALT_ROW if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                cell = row.cells[c_idx]
                if col_widths and c_idx < len(col_widths):
                    cell.width = col_widths[c_idx]
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.15
                r = p.add_run(str(cell_value))
                r.font.name = "Arial"
                r.font.size = Pt(8.5)
                r.font.color.rgb = C_DARK
                
        doc.add_paragraph().paragraph_format.space_after = Pt(6)
        return table

    # =========================================================================
    # SECCIÓN 1: PROPÓSITO Y DESCRIPCIÓN
    # =========================================================================
    add_heading1("1. Propósito y descripción")
    add_body(
        "Establecer un procedimiento controlado, reproducible y verificable para liberar e implementar la versión 1.3.0 "
        "del software FinanceFlow en el ambiente de producción objetivo, minimizando interrupciones de servicio, errores "
        "de configuración, inconsistencias o pérdida de datos financieros y riesgos de seguridad de la información. "
        "El presente plan define las condiciones previas, la arquitectura distribuida del sistema, el aprovisionamiento "
        "de la base de datos documental desde cero, el modelado y conceptos de los documentos NoSQL, la generación y administración "
        "de variables de entorno y secretos criptográficos, la secuencia operativa de despliegue de los servicios (Backend Core, "
        "Microservicio ML/OCR y Frontend SPA), las pruebas de humo y validación go/no-go, las responsabilidades de los intervinientes, "
        "los mecanismos de comunicación y las acciones de contingencia y reversión (rollback)."
    )

    # =========================================================================
    # SECCIÓN 2: OBJETIVOS
    # =========================================================================
    add_heading1("2. Objetivos")
    add_bullet("•", "Asegurar que la versión autorizada (v1.3.0) se instale con sus dependencias exactas, librerías del sistema operativo (Tesseract OCR) y configuraciones de red y variables de entorno validadas.")
    add_bullet("•", "Mantener la disponibilidad, integridad, confidencialidad y trazabilidad durante todo el ciclo de cambio tecnológico.")
    add_bullet("•", "Aprovisionar la persistencia sin estado previo en MongoDB Atlas, aplicando índices compuestos únicos y políticas de seguridad SCRAM-SHA-256.")
    add_bullet("•", "Validar los procesos críticos de negocio (autenticación JWT, registro contable, arqueo de caja chica, pagos y visión artificial) antes de habilitar el tráfico a usuarios finales.")
    add_bullet("•", "Disponer de un procedimiento de retorno (rollback) a la versión estable anterior ante la ocurrencia de fallas relevantes o no recuperables.")

    # =========================================================================
    # SECCIÓN 3: ALCANCE Y SUPUESTOS
    # =========================================================================
    add_heading1("3. Alcance y supuestos")
    add_body(
        "Incluye la preparación de entornos en la nube, respaldo lógico, distribución e inyección de secretos, aprovisionamiento "
        "de colecciones e índices en MongoDB Atlas, compilación y despliegue del Backend Core en Render, containerización del "
        "Microservicio de Machine Learning & OCR en Docker, distribución Edge del Frontend SPA en Vercel, siembra del usuario "
        "Superadministrador, pruebas de humo y funcionales, observabilidad con Sentry y cierre formal. No incluye nuevas funcionalidades "
        "ni cambios de alcance no autorizados."
    )
    add_body(
        "Supuestos: Existe la versión candidata identificada bajo la etiqueta v1.3.0 en GitHub, las suites de pruebas automatizadas "
        "se encuentran pasando al 100%, se cuenta con acceso administrativo a las consolas de MongoDB Atlas, Render y Vercel, "
        "las credenciales de servicios externos (Culqi, Brevo, Gemini) están verificadas, el equipo técnico se encuentra disponible "
        "y la ventana de cambio fue debidamente autorizada por el Propietario del Servicio."
    )

    # =========================================================================
    # SECCIÓN 4: ESTRATEGIA DE DESPLIEGUE
    # =========================================================================
    add_heading1("4. Estrategia de despliegue")
    add_body(
        "Se recomienda un despliegue gradual por ambiente: desarrollo → pruebas/calidad → producción. Para producción "
        "se utilizará una estrategia híbrida con Blue-Green nativo en Vercel (conmutación instantánea de alias atómico) "
        "y Rolling Update en Render (levantamiento del nuevo contenedor y conmutación de tráfico tras pasar el health check)."
    )
    
    headers_s4 = ["Elemento", "Definición para FinanceFlow v1.3.0"]
    data_s4 = [
        ["Tipo de despliegue", "Directo con validación previa (Blue-Green en Vercel y Rolling en Render)"],
        ["Versión / paquete", "v1.3.0 — Tag inmutable de la rama main en KrCrimson/FinanceFlow"],
        ["Servicios afectados", "Base de datos MongoDB Atlas, API Backend Core (/api/*), Microservicio ML (/categorize), Frontend Web SPA, Pasarelas Culqi / Brevo"],
        ["Ventana programada", "Sábado 24 de Octubre de 2026, 22:00 a 23:30 (UTC-5)"],
        ["Interrupción esperada", "Sin interrupción para el Frontend y BD; hasta 5 minutos de degradación en solicitudes en tránsito durante el reinicio de conexión del Backend"],
        ["Criterio para avanzar", "Conexión exitosa a MongoDB Atlas, respuesta HTTP 200 en login, inferencia ML válida y 100% de pruebas de humo superadas"]
    ]
    populate_table(headers_s4, data_s4, [Inches(2.2), Inches(4.3)])

    # =========================================================================
    # SECCIÓN 5: ROLES Y RESPONSABILIDADES
    # =========================================================================
    add_heading1("5. Roles y responsabilidades")
    headers_s5 = ["Rol", "Responsabilidad principal"]
    data_s5 = [
        ["Líder de despliegue", "Coordina la ejecución, registra hitos en tiempo real, verifica aprobaciones y decide formalmente la declaración de Go / No-Go o Rollback."],
        ["Equipo de desarrollo / DevOps", "Prepara artefactos y scripts; inyecta variables de entorno en Render/Vercel; ejecuta el despliegue del Backend y contenedor Docker."],
        ["Infraestructura / Operaciones", "Aprovisiona el clúster MongoDB Atlas, valida reglas de red y firewall, certificados TLS, monitoreo en Sentry y respaldos mongodump."],
        ["Calidad (QA) / Usuario clave", "Ejecuta las pruebas de humo automatizadas y manuales, valida el cuadre contable, autenticación y flujos de pago Pro."],
        ["Seguridad de la información", "Verifica la no exposición de secretos, longitud de JWT (>= 32 chars), controles CORS y protección contra vulnerabilidades IDOR."],
        ["Propietario del servicio / CAB", "Autoriza la ventana de cambio, evalúa el impacto operativo aceptable y emite la conformidad final de puesta en marcha."]
    ]
    populate_table(headers_s5, data_s5, [Inches(2.2), Inches(4.3)])

    # =========================================================================
    # SECCIÓN 6: PRERREQUISITOS Y CONDICIONES DE ENTRADA
    # =========================================================================
    add_heading1("6. Prerrequisitos y condiciones de entrada")
    add_bullet("•", "Solicitud de cambio registrada y aprobada por el Propietario del Servicio; análisis de impacto y riesgos disponible.")
    add_bullet("•", "Código y versión congelados (tag v1.3.0); compilación limpia y 12 suites de pruebas unitarias/integración satisfactorias (29/29 tests).")
    add_bullet("•", "Paquete almacenado en repositorio controlado de GitHub con integridad verificable.")
    add_bullet("•", "Secretos, variables de entorno, certificados y privilegios revisados sin exponer credenciales en repositorios públicos.")
    add_bullet("•", "Respaldos y restauración verificados con mongodump; procedimiento de rollback probado.")
    add_bullet("•", "Capacidad, conectividad, dependencias externas (Culqi, Brevo, Gemini) y observabilidad (Sentry DSN) comprobadas.")
    add_bullet("•", "Plan de comunicaciones enviado a los involucrados y usuarios afectados informando sobre la ventana programada.")

    # =========================================================================
    # SECCIÓN 7: PROCEDIMIENTO OPERATIVO DE IMPLEMENTACIÓN
    # =========================================================================
    add_heading1("7. Procedimiento operativo de implementación")
    add_body("A continuación se resume la matriz de fases operativas y, seguidamente, el procedimiento técnico detallado paso a paso desde cero:")
    
    headers_s7 = ["Fase", "Actividad / descripción", "Evidencia esperada"]
    data_s7 = [
        ["1. Preparación", "Validar checklist, alcance, responsables, ventana y versión aprobada.", "Acta / ticket de autorización"],
        ["2. Salvaguarda", "Generar respaldo de base de datos con mongodump y variables previas; confirmar restauración.", "Registro y ubicación del respaldo"],
        ["3. Prechequeo", "Comprobar capacidad, conectividad a Atlas, permisos de API y estado de servicios externos.", "Checklist técnico / ping exitoso"],
        ["4. Ejecución", "Aprovisionar BD, desplegar artefactos aprobados, inyectar variables y ejecutar bootstrap de admin.", "Logs de build en Render y Vercel"],
        ["5. Verificación", "Revisar salud, endpoints, balance contable, inferencia ML, pruebas de humo y registros de Sentry.", "Resultados de pruebas (100% OK)"],
        ["6. Habilitación", "Restablecer tráfico, actualizar dominios CORS cruzados y comunicar disponibilidad a usuarios.", "Aprobación de habilitación formal"],
        ["7. Estabilización", "Monitorear errores, latencia, consumo de memoria en Render y satisfacción operativa.", "Tablero / bitácora de monitoreo Sentry"],
        ["8. Cierre", "Documentar resultado, desviaciones, evidencias y conformidad del Propietario del Servicio.", "Acta de cierre de cambio"]
    ]
    populate_table(headers_s7, data_s7, [Inches(1.4), Inches(3.2), Inches(1.9)])

    add_heading2("7.1. Procedimiento Técnico Paso a Paso (Desde Cero)")

    add_heading3("Paso 1: Creación y Configuración de la Base de Datos en MongoDB Atlas")
    add_body(
        "1. Ingrese a cloud.mongodb.com y cree un nuevo proyecto denominado 'FinanceFlow-Production'.\n"
        "2. Cree un clúster 'M0 Free Tier' (piloto) o 'M10 Dedicated' (producción) en AWS us-east-1 o sa-east-1 con el nombre 'financeflow-cluster'.\n"
        "3. En 'Database Access' → 'Add New Database User': Cree el usuario 'financeflow_app' con autenticación Password y rol 'Read and write to any database'.\n"
        "4. En 'Network Access' → 'Add IP Address': Configure '0.0.0.0/0' (Allow Access from Anywhere) con la descripción 'PaaS Render/Vercel' (el clúster permanece resguardado por autenticación SCRAM-SHA-256 TLS).\n"
        "5. En el clúster haga clic en 'Connect' → 'Drivers' (Node.js) y copie la URI de conexión asegurando indicar el nombre de la BD 'financeflow':"
    )
    add_code_block("mongodb+srv://financeflow_app:<PASSWORD>@financeflow-cluster.xxxx.mongodb.net/financeflow?retryWrites=true&w=majority")

    add_heading3("Paso 2: Generación Criptográfica de Secretos y Variables de Entorno")
    add_body("Genere las llaves pseudoaleatorias de alta entropía ejecutando en su terminal local:")
    add_code_block('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
    add_body("Matriz de variables obligatorias para el Backend Core (backend/.env):")
    add_code_block(
        "NODE_ENV=production\n"
        "PORT=5000\n"
        "MONGODB_URI=mongodb+srv://financeflow_app:<PASSWORD>@financeflow-cluster.xxxx.mongodb.net/financeflow?retryWrites=true&w=majority\n"
        "JWT_SECRET=9f8e21a44c7b8e19d3f58a71c3e44b910e527a9420b7e193ca8e9527cf6814b2\n"
        "CORS_ORIGIN=https://financeflow.vercel.app\n"
        "FRONTEND_URL=https://financeflow.vercel.app\n"
        "CULQI_SECRET_KEY=sk_live_tu_llave_privada_culqi\n"
        "BREVO_API_KEY=xkeysib-tu_api_key_de_brevo\n"
        "EMAIL_USER=soporte@financeflow.com\n"
        "GEMINI_API_KEY=AIzaSyTuClaveDeGemini\n"
        "SENTRY_DSN=https://tu_dsn_backend_sentry"
    )
    add_body("Matriz de variables obligatorias para el Frontend SPA (frontend/.env):")
    add_code_block(
        "REACT_APP_API_URL=https://financeflow-backend.onrender.com\n"
        "REACT_APP_ML_URL=https://financeflow-ml.onrender.com\n"
        "REACT_APP_CULQI_PUBLIC_KEY=pk_live_tu_llave_publica_culqi\n"
        "REACT_APP_ENABLE_SDK=true\n"
        "REACT_APP_SENTRY_DSN=https://tu_dsn_frontend_sentry"
    )

    add_heading3("Paso 3: Despliegue del Backend Core en Render")
    add_body(
        "1. En Render Dashboard → 'New +' → 'Web Service' → Vincular repositorio GitHub 'FinanceFlow'.\n"
        "2. Configurar Name: 'financeflow-backend', Root Directory: 'backend', Runtime: 'Node', Build Command: 'npm install', Start Command: 'npm start'.\n"
        "3. Inyectar las variables de entorno del Backend definidas en el Paso 2.\n"
        "4. Iniciar el servicio y confirmar en logs: 'MongoDB conectado' y 'Servidor backend escuchando en puerto 10000'."
    )

    add_heading3("Paso 4: Despliegue del Microservicio de IA (FastAPI / Docker) en Render")
    add_body(
        "1. En Render Dashboard → 'New +' → 'Web Service' → Vincular repositorio 'FinanceFlow'.\n"
        "2. Configurar Name: 'financeflow-ml', Root Directory: 'ml_backend', Runtime: 'Docker' (detectará el Dockerfile con Python 3.10 y Tesseract OCR).\n"
        "3. Inyectar variables: PORT=8000 y ML_API_KEY=<token_secreto>.\n"
        "4. Desplegar y anotar la URL generada: https://financeflow-ml.onrender.com."
    )

    add_heading3("Paso 5: Despliegue del Frontend Web SPA en Vercel")
    add_body(
        "1. En Vercel → 'Add New...' → 'Project' → Importar 'FinanceFlow'.\n"
        "2. Configurar Framework Preset: 'Create React App', Root Directory: 'frontend'.\n"
        "3. Inyectar las variables de entorno REACT_APP_* del Paso 2 y hacer clic en 'Deploy'.\n"
        "4. Confirmar que el archivo frontend/vercel.json asegure las rutas cliente con rewrites a /index.html.\n"
        "5. Anotar el dominio final de Vercel y sincronizarlo en las variables CORS_ORIGIN y FRONTEND_URL de Render."
    )

    add_heading3("Paso 6: Inicialización del Sistema y Bootstrap del Superadministrador")
    add_body("Con la base de datos limpia, ejecute desde la consola de comandos del backend el siguiente script seguro con bcrypt:")
    add_code_block(
        "cd backend\n"
        "node -e \"\n"
        "const mongoose = require('mongoose');\n"
        "const bcrypt = require('bcryptjs');\n"
        "require('dotenv').config();\n"
        "\n"
        "const usuarioSchema = new mongoose.Schema({\n"
        "  nombre: String,\n"
        "  email: { type: String, unique: true, lowercase: true },\n"
        "  passwordHash: String,\n"
        "  rol: String,\n"
        "  estado: String,\n"
        "  fondoFijo: Number,\n"
        "  esPremium: Boolean,\n"
        "  planTipo: String,\n"
        "  creadoEn: { type: Date, default: Date.now },\n"
        "  actualizadoEn: { type: Date, default: Date.now }\n"
        "});\n"
        "\n"
        "const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);\n"
        "\n"
        "async function bootstrap() {\n"
        "  await mongoose.connect(process.env.MONGODB_URI);\n"
        "  const adminEmail = 'admin@financeflow.com';\n"
        "  const rawPassword = 'AdminPasswordSeguro2026!';\n"
        "  const existe = await Usuario.findOne({ email: adminEmail });\n"
        "  if (existe) { console.log('El admin ya existe'); process.exit(0); }\n"
        "  const passwordHash = await bcrypt.hash(rawPassword, 10);\n"
        "  const nuevoAdmin = new Usuario({\n"
        "    nombre: 'Super Administrador',\n"
        "    email: adminEmail,\n"
        "    passwordHash: passwordHash,\n"
        "    rol: 'admin',\n"
        "    estado: 'activo',\n"
        "    fondoFijo: 1000,\n"
        "    esPremium: true,\n"
        "    planTipo: 'pro'\n"
        "  });\n"
        "  await nuevoAdmin.save();\n"
        "  console.log('Superadministrador creado exitosamente:', adminEmail);\n"
        "  process.exit(0);\n"
        "}\n"
        "bootstrap();\n"
        "\""
    )

    # =========================================================================
    # SECCIÓN 8: CRONOGRAMA REFERENCIAL
    # =========================================================================
    add_heading1("8. Cronograma referencial")
    headers_s8 = ["Hito", "Momento referencial", "Responsable"]
    data_s8 = [
        ["Revisión y aprobación del plan", "T − 5 a T − 1 días", "Líder de despliegue / Propietario del Servicio"],
        ["Respaldo y prechequeos en Atlas", "T − 60 a T − 15 min", "Equipo de Infraestructura / Operaciones"],
        ["Implementación Backend y ML", "T 0 a T + 35 min", "DevOps / Backend"],
        ["Compilación y distribución Frontend", "T + 35 a T + 45 min", "Equipo Frontend"],
        ["Bootstrap admin y pruebas go/no-go", "T + 45 a T + 75 min", "Calidad (QA) / Propietario del Servicio"],
        ["Monitoreo reforzado en Sentry", "Primeras 24–48 horas", "Operaciones"],
        ["Cierre formal de cambio", "T + 2 días", "Líder de despliegue"]
    ]
    populate_table(headers_s8, data_s8, [Inches(2.5), Inches(2.0), Inches(2.0)])

    # =========================================================================
    # SECCIÓN 9: PRUEBAS Y CRITERIOS DE ACEPTACIÓN
    # =========================================================================
    add_heading1("9. Pruebas y criterios de aceptación")
    add_bullet("•", "Disponibilidad: Servicios Backend, ML y Frontend reportan estado saludable (HTTP 200 OK, tiempos de respuesta < 800 ms).")
    add_bullet("•", "Funcionalidad: Autenticación JWT, creación de ingresos/egresos, arqueo de caja chica, checkout y OCR completan pruebas de humo sin fallos.")
    add_bullet("•", "Datos: Clúster de MongoDB Atlas inicializado con las 6 colecciones e índice compuesto único de cierres activo.")
    add_bullet("•", "Seguridad: Comunicaciones HTTPS forzadas, Helmet activo, JWT firmado con algoritmo seguro y orígenes no autorizados bloqueados por CORS.")
    add_bullet("•", "Rendimiento: Tasa de error HTTP 5xx menor al 0.1% bajo pruebas de estrés iniciales.")
    add_bullet("•", "Operación: Bitácora de logs activa, observabilidad de Sentry recibiendo telemetría y respaldos validados.")
    add_body(
        "Criterio de aceptación final: El Propietario del Servicio y QA confirman los resultados y autorizan formalmente "
        "la continuidad de la nueva versión en producción."
    )

    # =========================================================================
    # SECCIÓN 10: RIESGOS, CONTINGENCIA Y REVERSIÓN
    # =========================================================================
    add_heading1("10. Riesgos, contingencia y reversión")
    headers_s10 = ["Riesgo", "Mitigación / respuesta"]
    data_s10 = [
        ["Incompatibilidad de configuración", "Validar parámetros por ambiente; verificación automática de longitud de JWT en arranque de app.js."],
        ["Falla de conexión a MongoDB Atlas", "Regla 0.0.0.0/0 validada previamente en Network Access; test de conexión ejecutado antes de liberar tráfico."],
        ["Indisponibilidad o degradación", "Despliegue en ventana nocturna de bajo tráfico (22:00 UTC-5); rollback automático si se superan umbrales."],
        ["Problemas de permisos o seguridad", "Validación estricta de esquemas Zod en todas las rutas; RBAC verificado con middleware isAdmin."],
        ["Fallas de integraciones externas", "Manejo defensivo de timeouts; fallback automático de correos SMTP hacia la API REST de Brevo."]
    ]
    populate_table(headers_s10, data_s10, [Inches(2.5), Inches(4.0)])

    # =========================================================================
    # SECCIÓN 11: PROCEDIMIENTO DE ROLLBACK
    # =========================================================================
    add_heading1("11. Procedimiento de rollback")
    add_body(
        "Activadores: Incumplimiento de criterios de aceptación, error crítico no recuperable en la ventana autorizada, "
        "pérdida de integridad de datos, incidente de seguridad o degradación superior al umbral aprobado.\n\n"
        "1. El líder declara 'no-go' o rollback, registra la hora exacta y comunica la decisión por el canal operativo.\n"
        "2. Se bloquean nuevos cambios y se detiene el tráfico temporalmente.\n"
        "3. En Vercel: Se ejecuta 'Instant Rollback' hacia el despliegue previo estable en menos de 10 segundos.\n"
        "4. En Render: Se revierte el servicio al commit previo estable desde la pestaña 'Events'.\n"
        "5. En Base de Datos: Si hubo corrupción, se ejecuta la restauración con 'mongorestore --drop' del respaldo previo.\n"
        "6. Se verifican salud y consistencia y se comunica la recuperación formal del servicio.\n\n"
        "Importante: No ejecutar restauración de base de datos sin verificar previamente la posible pérdida de transacciones "
        "posteriores al respaldo; esta decisión debe ser autorizada formalmente por el Propietario del Servicio."
    )

    # =========================================================================
    # SECCIÓN 12: PLAN DE COMUNICACIÓN Y SOPORTE
    # =========================================================================
    add_heading1("12. Plan de comunicación y soporte")
    headers_s12 = ["Momento", "Destinatarios", "Mensaje / canal"]
    data_s12 = [
        ["Antes (T − 24 h)", "Áreas usuarias, soporte y directivos", "Aviso de ventana, impacto previsto (degradación < 5 min) y contactos de guardia / correo o ticket."],
        ["Inicio (T 0)", "Equipo técnico y responsables", "Confirmación de inicio de ventana y enlace al canal operativo en vivo."],
        ["Fin o reversión", "Usuarios y partes interesadas", "Resultado formal del despliegue, nuevas características disponibles o confirmación de reversión segura / correo."],
        ["Estabilización", "Mesa de ayuda y operaciones", "Monitoreo de estado, métricas de incidentes y seguimiento post-despliegue / tablero de Sentry."]
    ]
    populate_table(headers_s12, data_s12, [Inches(1.8), Inches(2.2), Inches(2.5)])

    # =========================================================================
    # SECCIÓN 13: EVIDENCIAS Y ENTREGABLES
    # =========================================================================
    add_heading1("13. Evidencias y entregables")
    add_bullet("•", "Ticket de cambio y aprobación, versión exacta (v1.3.0) y registro de artefactos inmutables en GitHub.")
    add_bullet("•", "Checklists firmados, respaldos de base de datos comprimidos (.gz), scripts y resultados de ejecución.")
    add_bullet("•", "Pruebas funcionales, técnicas y de seguridad con sus resultados detallados.")
    add_bullet("•", "Métricas iniciales de rendimiento, telemetría de Sentry, decisiones go/no-go y acta de cierre formal.")
    add_bullet("•", "Manual operativo, actualización de inventario tecnológico y lecciones aprendidas.")

    # =========================================================================
    # SECCIÓN 14: MATRIZ BREVE DE APROBACIÓN
    # =========================================================================
    add_heading1("14. Matriz breve de aprobación")
    headers_s14 = ["Instancia", "Nombre y cargo", "Fecha / conformidad"]
    data_s14 = [
        ["Elaborado por", "Equipo de Arquitectura & DevOps", "22/10/2026 — Aprobado"],
        ["Revisado por (técnico/seguridad)", "Auditor de Seguridad y QA Lead", "22/10/2026 — Aprobado"],
        ["Autorizado por (propietario/CAB)", "Product Owner / Propietario del Servicio", "22/10/2026 — Aprobado"]
    ]
    populate_table(headers_s14, data_s14, [Inches(2.3), Inches(2.3), Inches(1.9)])

    # =========================================================================
    # ANEXOS
    # =========================================================================
    add_heading1("Anexo A. Lista de verificación go/no-go")
    add_body("Marque las casillas correspondientes antes de autorizar la apertura a producción:")
    add_bullet("☑", "Cambio aprobado y ventana de mantenimiento confirmada.")
    add_bullet("☑", "Respaldo de seguridad comprobado y procedimiento de rollback disponible.")
    add_bullet("☑", "Clúster de MongoDB Atlas aprovisionado con usuario de aplicación y reglas de red activas.")
    add_bullet("☑", "Paquete de código fuente y dependencias validados (npm test 100% aprobado).")
    add_bullet("☑", "Variables de entorno inyectadas con JWT_SECRET de alta entropía (>= 32 caracteres).")
    add_bullet("☑", "Microservicio de Machine Learning containerizado y respondiendo inferencias.")
    add_bullet("☑", "Frontend compilado en Vercel con reglas de reescritura para rutas SPA (vercel.json).")
    add_bullet("☑", "Usuario Superadministrador inicial sembrado con contraseña encriptada con bcrypt.")
    add_bullet("☑", "Pruebas críticas ejecutadas y sin fallos bloqueantes.")
    add_bullet("☑", "Monitoreo activo y alertas verificadas en Sentry.")
    add_bullet("☑", "Autorización expresa del Propietario del Servicio para habilitar producción.")

    add_heading1("Anexo B. Diccionario de Datos y Conceptos de Documentos NoSQL")
    add_body(
        "En MongoDB, la información se persiste en colecciones de documentos BSON gobernadas por esquemas Mongoose. "
        "A continuación se detallan las 6 colecciones principales del sistema FinanceFlow:"
    )

    add_heading2("1. Colección: usuarios (Modelo: Usuario)")
    add_body(
        "• _id: ObjectId — Clave primaria única.\n"
        "• nombre: String (Requerido) — Nombre del usuario o comercio.\n"
        "• email: String (Requerido, Único, Lowercase) — Identificador de autenticación.\n"
        "• passwordHash: String (Requerido) — Hash cifrado con bcrypt (10 salt rounds).\n"
        "• estado: String (Enum: ['activo', 'inactivo'], Default: 'activo').\n"
        "• rol: String (Enum: ['user', 'admin'], Default: 'user') — Control de acceso RBAC.\n"
        "• fondoFijo: Number (Default: 1000) — Saldo pactado de caja chica.\n"
        "• resetPasswordToken / resetPasswordExpires: String / Date — Recuperación de credenciales con TTL.\n"
        "• esPremium: Boolean (Default: false) / planTipo: String (Enum: ['free', 'pro']).\n"
        "• conteoOcrMes: Number (Default: 0) — Cuota mensual de recibos escaneados con IA.\n"
        "• creadoEn / actualizadoEn: Date — Auditoría temporal automática (Hook pre('save'))."
    )

    add_heading2("2. Colección: movimientos (Modelo: Movimiento)")
    add_body(
        "• _id: ObjectId — Clave primaria.\n"
        "• tipo: String (Enum: ['ingreso', 'egreso'], Requerido) — Naturaleza contable.\n"
        "• nombre: String (Requerido) — Glosa o concepto de la transacción.\n"
        "• monto: Number (Requerido, min: 0) — Importe monetario en moneda local.\n"
        "• categoria: String (Requerido) — Clasificación analítica (Ventas, Comida, Alquiler, etc.).\n"
        "• userId: ObjectId (Ref: Usuario, Requerido) — Aislamiento multi-tenant.\n"
        "• fecha: Date (Requerido) — Fecha contable del movimiento.\n"
        "• estado: String (Enum: ['activo', 'inactivo', 'planificado'], Default: 'activo').\n"
        "• esRecurrente: Boolean (Default: false) — Generación automática periódica."
    )

    add_heading2("3. Colección: cierres (Modelo: Cierre)")
    add_body(
        "• _id: ObjectId — Clave primaria.\n"
        "• userId: ObjectId (Ref: Usuario, Requerido) — Operador responsable.\n"
        "• tipo: String (Enum: ['diario', 'mensual'], Requerido) — Período liquidado.\n"
        "• periodo: String (Requerido) — Formato 'YYYY-MM-DD' o 'YYYY-MM'.\n"
        "• fondoFijo / ingresosTotales / egresosTotales: Number — Cifras base del período.\n"
        "• saldoEsperado: Number — Fórmula: fondoFijo + ingresosTotales - egresosTotales.\n"
        "• saldoFisico: Number — Conteo real verificado en caja por el operador humano.\n"
        "• diferencia: Number — Varianza: saldoFisico - saldoEsperado.\n"
        "• Índice compuesto único: { userId: 1, tipo: 1, periodo: 1 } con { unique: true } (evita duplicidad)."
    )

    add_heading2("4. Colección: pagos (Modelo: Pago)")
    add_body(
        "• _id: ObjectId — Clave primaria.\n"
        "• usuario: ObjectId (Ref: Usuario) / email: String.\n"
        "• metodo: String (Enum: ['yape', 'bcp', 'card']).\n"
        "• nroOperacion: String (Requerido) — Token de cargo Culqi o número de operación bancaria.\n"
        "• monto: Number (Default: 19.90) / estado: String (Enum: ['pendiente', 'aprobado', 'rechazado'])."
    )

    add_heading2("5. Colección: recordatorios (Modelo: Recordatorio)")
    add_body(
        "• _id: ObjectId — Clave primaria.\n"
        "• userId: ObjectId (Ref: Usuario).\n"
        "• tipo: String (Enum: ['prestamo_recibido', 'prestamo_otorgado', 'pago_pendiente']).\n"
        "• descripcion: String / monto: Number / fechaVencimiento: Date / contacto: String / estado: String."
    )

    add_heading2("6. Colección: logs (Modelo: Log)")
    add_body(
        "• _id: ObjectId — Clave primaria.\n"
        "• accion: String (Requerido) — Evento auditado (LOGIN, CREAR_MOVIMIENTO, etc.).\n"
        "• usuarioId: ObjectId (Ref: Usuario) / movimientoId: ObjectId (Ref: Movimiento).\n"
        "• fecha: Date (Default: Date.now) / descripcion: String."
    )

    add_heading1("Anexo C. Procedimiento Operativo de Respaldo y Restauración")
    add_body("Comandos estándar de mongodump y mongorestore para la base de datos:")
    add_code_block(
        "# Crear respaldo completo comprimido con fecha:\n"
        "mongodump --uri=\"mongodb+srv://financeflow_app:<PASSWORD>@financeflow-cluster.xxxx.mongodb.net/financeflow\" \\\n"
        "          --archive=\"backup_financeflow_$(date +%Y%m%d_%H%M%S).gz\" --gzip\n"
        "\n"
        "# Restaurar base de datos en caso de contingencia:\n"
        "mongorestore --uri=\"mongodb+srv://financeflow_app:<PASSWORD>@financeflow-cluster.xxxx.mongodb.net/financeflow\" \\\n"
        "             --archive=\"backup_financeflow_20261022_120000.gz\" --gzip --drop"
    )

    add_heading1("Anexo D. Matriz de Solución de Problemas Frecuentes (Troubleshooting)")
    headers_s14_tr = ["Error Identificado", "Causa Raíz", "Procedimiento de Resolución"]
    data_s14_tr = [
        ["Bloqueado por CORS: Origen no autorizado", "Discrepancia entre la URL del frontend y CORS_ORIGIN en backend.", "Configurar CORS_ORIGIN=https://tu-dominio.vercel.app sin barra final en Render."],
        ["MongoServerSelectionError: connection timed out", "Firewall de Atlas bloqueando la IP de Render o VPS.", "En Atlas → Network Access confirmar regla 0.0.0.0/0 en estado Active."],
        ["FATAL: JWT_SECRET demasiado corto", "Llave secreta de JWT menor a 32 caracteres en producción.", "Generar clave de 64 caracteres hex con crypto.randomBytes(32) y actualizar en Render."],
        ["404 Not Found al refrescar páginas en React", "Servidor web buscando archivos estáticos inexistentes.", "Asegurar que frontend/vercel.json incluya rewrites hacia /index.html."],
        ["TesseractNotFoundError en microservicio ML", "Binario de OCR no presente en el entorno.", "Desplegar el microservicio utilizando Docker en Render para asegurar tesseract-ocr."]
    ]
    populate_table(headers_s14_tr, data_s14_tr, [Inches(2.0), Inches(2.0), Inches(2.5)])

    # Guardar documento
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "MANUAL_DESPLIEGUE.docx"))
    doc.save(output_path)
    print(f"Documento DOCX generado exitosamente en: {output_path}")

if __name__ == "__main__":
    create_document()
