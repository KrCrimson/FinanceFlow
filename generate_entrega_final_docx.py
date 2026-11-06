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

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Establece los márgenes internos (padding) de una celda en dxa."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CCCCCC", sz="4", val="single"):
    """Establece bordes profesionales en una tabla."""
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

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(10, 37, 64) # #0A2540 Dark Navy
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 120, 160)
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = RGBColor(50, 50, 50)
    return p

def add_body_p(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(30, 30, 30)
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10.5)
    run.font.italic = italic
    run.font.color.rgb = RGBColor(40, 40, 40)
    return p

def add_bullet_p(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10)
    run.font.color.rgb = RGBColor(40, 40, 40)
    return p

def add_callout(doc, title, text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F0F4F8")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    # Left border only (accent line)
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="0A2540"/>'
        f'  <w:top w:val="none"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(3)
    rt = p.add_run(f"📌 {title}: ")
    rt.font.name = "Calibri"
    rt.font.size = Pt(10)
    rt.font.bold = True
    rt.font.color.rgb = RGBColor(10, 37, 64)
    
    rb = p.add_run(text)
    rb.font.name = "Calibri"
    rb.font.size = Pt(9.5)
    rb.font.color.rgb = RGBColor(50, 50, 50)
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(2)
    p_after.paragraph_format.space_after = Pt(4)

def add_styled_table(doc, headers, data, col_widths=None):
    tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl, color="CBD5E1")
    
    # Header row
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "0A2540")
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)
            
    # Data rows
    for r_idx, row in enumerate(data):
        row_cells = tbl.rows[r_idx + 1].cells
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_col)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
            p = row_cells[c_idx].paragraphs[0]
            for r in p.runs:
                r.font.name = "Calibri"
                r.font.size = Pt(9)
                r.font.color.rgb = RGBColor(40, 40, 40)
                
    if col_widths:
        for row in tbl.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)
                
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(4)

def build_word_document():
    doc = Document()
    
    # Margins
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)
        s.header.paragraphs[0].text = "Universidad Privada de Tacna — Construcción de Software II | FinanceFlow"
        s.header.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        s.header.paragraphs[0].runs[0].font.name = "Calibri"
        s.header.paragraphs[0].runs[0].font.size = Pt(8.5)
        s.header.paragraphs[0].runs[0].font.color.rgb = RGBColor(120, 120, 120)

    # PORTADA ACADÉMICA
    p_uni = doc.add_paragraph()
    p_uni.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_uni = p_uni.add_run("UNIVERSIDAD PRIVADA DE TACNA\n")
    r_uni.font.name = "Calibri"
    r_uni.font.size = Pt(16)
    r_uni.font.bold = True
    r_uni.font.color.rgb = RGBColor(10, 37, 64)
    
    r_fac = p_uni.add_run("FACULTAD DE INGENIERÍA\nESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS\n")
    r_fac.font.name = "Calibri"
    r_fac.font.size = Pt(12)
    r_fac.font.color.rgb = RGBColor(70, 70, 70)
    
    p_sp1 = doc.add_paragraph()
    p_sp1.paragraph_format.space_before = Pt(20)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tit = p_title.add_run("DOCUMENTO DE CONFIGURACIÓN DE AMBIENTES Y PROCEDIMIENTO DE DESPLIEGUE\n")
    r_tit.font.name = "Calibri"
    r_tit.font.size = Pt(18)
    r_tit.font.bold = True
    r_tit.font.color.rgb = RGBColor(10, 37, 64)

    r_sub = p_title.add_run("Diseño y Elaboración del Documento de Configuración de Ambientes y Procedimiento de Despliegue para una Solución de Software utilizando prácticas de CI, CD y DevOps\n")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(12)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(0, 120, 160)

    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_before = Pt(30)

    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.line_spacing = 1.3
    p_meta.add_run("ASIGNATURA: ").bold = True
    p_meta.add_run("Construcción de Software II\n")
    p_meta.add_run("DOCENTE: ").bold = True
    p_meta.add_run("Mag. Ricardo Eduardo Valcárcel Alvarado\n")
    p_meta.add_run("PROYECTO: ").bold = True
    p_meta.add_run("FinanceFlow — Sistema de Gestión Financiera & Inteligencia con IA\n")
    p_meta.add_run("VERSIÓN: ").bold = True
    p_meta.add_run("v1.4.0 (Línea Base Post-Sprint 7)\n")
    p_meta.add_run("INTEGRANTES:\n").bold = True
    p_meta.add_run("• Sebastian Arce Bracamonte (Código: 2019062886)\n")
    p_meta.add_run("• Brant Antony Chata Choque (Código: 2020067577)\n")

    p_sp3 = doc.add_paragraph()
    p_sp3.paragraph_format.space_before = Pt(40)

    p_loc = doc.add_paragraph()
    p_loc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_loc = p_loc.add_run("Tacna, Perú\nAño Académico 2026")
    r_loc.font.bold = True
    r_loc.font.color.rgb = RGBColor(100, 100, 100)

    doc.add_page_break()

    # ÍNDICE GENERAL
    add_heading_1(doc, "ÍNDICE GENERAL DEL DOCUMENTO")
    indice_items = [
        "PARTE I: INVESTIGACIÓN TEÓRICA",
        "  - Tema 1: Despliegue de Software (Concepto, Importancia, Estrategias, Beneficios/Riesgos, Manual vs Automatizado)",
        "  - Tema 2: Ambientes de Software (DEV, INT, QA, STAGING, PROD)",
        "  - Tema 3: Gestión de Configuración del Software (SCM, Baselines, Trazabilidad, Artefactos)",
        "  - Tema 4: DevOps e Integración Continua (CAMS, CI, CD, Continuous Deployment, Pipelines)",
        "  - Tema 5: Análisis Comparativo de Herramientas Modernas de Despliegue",
        "PARTE II: DOCUMENTO DE CONFIGURACIÓN DE AMBIENTES (FINANCEFLOW)",
        "  - 1. Información General del Proyecto",
        "  - 2. Descripción Integral del Sistema y Alcance",
        "  - 3. Arquitectura de la Solución (3 Capas Distribuida)",
        "  - 4. Configuración Técnica de Ambientes (DEV, QA, STAGING, PROD)",
        "  - 5. Gestión de Versiones (GitFlow, Conventional Commits, SemVer)",
        "  - 6. Seguridad de Ambientes (MFA, RBAC, Firewall, TLS 1.3, Backups 3-2-1, SAST)",
        "PARTE III: PROCEDIMIENTO DE DESPLIEGUE FORMAL",
        "  - Objetivo y Alcance",
        "  - Roles y Responsabilidades",
        "  - Procedimiento en Seis Fases (Preparación, Pruebas, Aprobación, Despliegue, Validación, Cierre)",
        "PARTE IV: ANEXOS OBLIGATORIOS",
        "  - Anexo A: Matriz RACI",
        "  - Anexo B: Checklist de Despliegue (Pre y Post)",
        "  - Anexo C: Plan de Rollback (RTO < 10m, RPO < 15m)",
        "  - Anexo D: Pipeline CI/CD Automatizado en GitHub Actions",
        "ENTREGABLES 8 Y 9: EVIDENCIAS DEL REPOSITORIO GIT Y PRUEBAS AUTOMATIZADAS",
        "ENTREGABLE 10: ESTRUCTURA DE SUSTENTACIÓN DE 15 MINUTOS"
    ]
    for item in indice_items:
        add_body_p(doc, item)

    doc.add_page_break()

    # PARTE I
    add_heading_1(doc, "PARTE I: INVESTIGACIÓN TEÓRICA")

    add_heading_2(doc, "Tema 1: Despliegue de Software")
    add_body_p(doc, "El despliegue de software (Software Deployment) comprende el conjunto integral de actividades, procesos y transiciones tecnológicas requeridas para trasladar una solución de software desde su estado de desarrollo y empaquetamiento hacia un entorno ejecutable en el que los usuarios finales o sistemas consumidores puedan interactuar con ella. En la ingeniería de software contemporánea, el despliegue representa un proceso continuo, determinista y auditable, regido por principios de Site Reliability Engineering (SRE) y DevOps.", bold_prefix="Concepto de Despliegue: ")
    add_body_p(doc, "Dentro del ciclo de vida del software (SDLC), el despliegue es el puente crítico entre la inversión en ingeniería y la captura de valor en el negocio. Por riguroso que sea el proceso de análisis, diseño y codificación, el software solo genera retorno de inversión (ROI) cuando opera de manera estable en producción. Además, permite obtener ciclos de retroalimentación ultrarrápidos sobre el comportamiento real de los usuarios.", bold_prefix="Importancia en el SDLC: ")

    add_heading_3(doc, "Estrategias de Despliegue Modernas")
    add_body_p(doc, "A continuación se analiza la comparativa formal de las estrategias de despliegue más extendidas en la industria:")

    estrategias_headers = ["Estrategia", "Mecanismo", "Ventajas", "Riesgos / Desventajas", "Recomendación"]
    estrategias_data = [
        ["Recreate", "Apagar v1 completamente y encender v2.", "Simplicidad total; sin mezcla de versiones ni esquemas.", "Downtime obligatorio para usuarios.", "Entornos DEV y batch nocturnos."],
        ["Rolling Update", "Actualizar instancias progresivamente tras un balanceador.", "Cero downtime; uso eficiente de hardware.", "Coexistencia de v1 y v2; requiere retrocompatibilidad.", "Kubernetes, microservicios escalados."],
        ["Blue/Green", "Dos entornos idénticos: Azul activo y Verde en reposo; switch DNS.", "Rollback instantáneo; validación total previa en Verde.", "Doble costo temporal de infraestructura.", "Sistemas bancarios y financieros (FinanceFlow)."],
        ["Canary", "Desviar 2-5% del tráfico real a la nueva versión y evaluar métricas.", "Aislamiento de fallos con impacto mínimo en usuarios.", "Alta complejidad de configuración y enrutamiento.", "Plataformas masivas con millones de peticiones."],
        ["A/B Testing", "Enrutar segmentos de usuarios a variantes para medir KPIs comerciales.", "Valida hipótesis basadas en datos empíricos de negocio.", "Requiere telemetría avanzada y segmentación.", "Pruebas de conversión y flujos de pago."],
        ["Shadow Launch", "Duplicar tráfico real a v2 en segundo plano sin responder al usuario.", "Prueba de carga y precisión sin riesgo para usuarios.", "Doble consumo computacional; riesgo de mutación duplicada.", "Motores de IA/OCR y cores de pago."]
    ]
    add_styled_table(doc, estrategias_headers, estrategias_data, [1.1, 1.4, 1.4, 1.3, 1.3])

    add_callout(doc, "Estrategia de FinanceFlow", "FinanceFlow adopta una arquitectura combinada Blue/Green nativa en Vercel (Edge DNS switch instantáneo) y Rolling Update en Render, garantizando conmutación atómica sin interrupción transaccional.")

    add_heading_3(doc, "Despliegue Manual vs. Automatizado")
    man_vs_auto_headers = ["Criterio", "Despliegue Manual Tradicional", "Despliegue Automatizado (CI/CD)"]
    man_vs_auto_data = [
        ["Velocidad de Ejecución", "Horas o días; requiere intervención humana constante.", "Minutos; orquestado por runners en la nube."],
        ["Tasa de Error Humano", "Muy alta (olvido de comandos, tipeo erróneo de variables).", "Prácticamente nula; codificado de forma determinista."],
        ["Consistencia y Repetibilidad", "Baja; 'funciona en mi máquina pero falla en el servidor'.", "Total; empaquetado en contenedores Docker e IaC."],
        ["Capacidad de Rollback", "Lenta, artesanal y con alto estrés operativo ante fallos.", "Automatizada en segundos mediante punteros de release."],
        ["Trazabilidad y Auditoría", "Informal; basada en bitácoras manuales o correos.", "Auditoría integral por commits Git y firmas SHA."]
    ]
    add_styled_table(doc, man_vs_auto_headers, man_vs_auto_data, [1.5, 2.5, 2.5])

    # Tema 2: Ambientes
    add_heading_2(doc, "Tema 2: Ambientes de Software")
    add_body_p(doc, "Un ciclo de desarrollo profesional exige la segregación de responsabilidades a través de ambientes tecnológicos independientes:")
    add_bullet_p(doc, "Ambiente local donde los desarrolladores escriben código y ejecutan hot-reloading. Se prioriza la agilidad y depuración con base de datos local y logging detallado.", bold_prefix="Ambiente de Desarrollo (DEV): ")
    add_bullet_p(doc, "Entorno de ejecución de runners de CI donde convergen ramas feature hacia develop. Valida contratos de API, linting y pruebas unitarias de integración temprana.", bold_prefix="Ambiente de Integración (INT): ")
    add_bullet_p(doc, "Servidor dedicado al equipo de QA para pruebas funcionales de caja negra, pruebas de regresión, integración con pasarelas de pago sandbox y pruebas de aceptación (UAT).", bold_prefix="Ambiente de Calidad (QA): ")
    add_bullet_p(doc, "Réplica exacta de producción con cuotas de red y hardware idénticas. Permite realizar pruebas de carga con k6, validación de certificados SSL reales y simulacro de rollback.", bold_prefix="Ambiente de Preproducción (STAGING): ")
    add_bullet_p(doc, "Entorno en vivo donde interactúan usuarios reales. Exige disponibilidad SLA > 99.9%, hardening de seguridad extremo, rate limiting y observabilidad continua con Sentry.", bold_prefix="Ambiente de Producción (PROD): ")

    # Tema 3: SCM
    add_heading_2(doc, "Tema 3: Gestión de Configuración del Software (SCM)")
    add_body_p(doc, "La Gestión de Configuración del Software asegura el control unificado y auditable de todos los artefactos del sistema:")
    add_bullet_p(doc, "Control determinista de cada cambio en código, infraestructura y configuraciones mediante Git y hashing criptográfico.", bold_prefix="Gestión de Versiones: ")
    add_bullet_p(doc, "Proceso formal que prohíbe el push directo a ramas protegidas, exigiendo Pull Requests con revisión por pares obligatoria.", bold_prefix="Control de Cambios: ")
    add_bullet_p(doc, "Punto de referencia inmutable formalmente certificado (etiquetas Git tags como v1.3.0 o v1.4.0) que fija el estado de una entrega autorizada.", bold_prefix="Líneas Base (Baselines): ")
    add_bullet_p(doc, "Capacidad de rastrear un requerimiento funcional desde su ticket Jira hasta el commit SHA, pull request y binario desplegado.", bold_prefix="Trazabilidad: ")
    add_bullet_p(doc, "Almacenamiento de bundles e imágenes de contenedores en registros seguros bajo el principio 'Build Once, Deploy Anywhere'.", bold_prefix="Gestión de Artefactos: ")

    # Tema 4: DevOps
    add_heading_2(doc, "Tema 4: DevOps e Integración Continua")
    add_body_p(doc, "DevOps integra personas, procesos y herramientas bajo el paradigma CAMS (Cultura, Automatización, Medición y Compartir):")
    add_bullet_p(doc, "Integración continua de código varias veces al día con build automático y ejecución de pruebas para detectar fallos tempranos (Fail Fast).", bold_prefix="Continuous Integration (CI): ")
    add_bullet_p(doc, "Mantenimiento del software en un estado perpetuamente desplegable mediante pipelines que llegan hasta Staging, requiriendo un clic para Producción.", bold_prefix="Continuous Delivery (CD): ")
    add_bullet_p(doc, "Automatización total de la puesta en producción sin intervención humana una vez aprobadas las compuertas de calidad.", bold_prefix="Continuous Deployment: ")
    add_bullet_p(doc, "Flujo automatizado de validaciones y pasos ordenados en Quality Gates (Lint -> Test -> SonarQube -> Deploy).", bold_prefix="Pipeline de Despliegue: ")
    add_bullet_p(doc, "Aprovisionamiento repetible de servidores y servicios mediante código versionable (IaC).", bold_prefix="Automatización: ")

    # Tema 5: Herramientas
    add_heading_2(doc, "Tema 5: Análisis de Herramientas Modernas de Despliegue")
    tools_headers = ["Herramienta", "Categoría", "Funcionalidades Clave", "Rol en el Pipeline"]
    tools_data = [
        ["Git", "VCS Distribuido", "Control no lineal de ramas, hashing SHA de commits, merges seguros.", "Gestión de código fuente base."],
        ["GitHub", "DevOps & CI/CD Cloud", "Pull Requests protegidos, GitHub Actions YAML, Dependabot.", "Orquestador central del pipeline."],
        ["GitLab", "DevOps All-in-One", "CI/CD integrado en .gitlab-ci.yml, registro OCI nativo, DAST/SAST.", "Plataforma DevOps unificada."],
        ["Azure DevOps", "Suite Cloud Enterprise", "Azure Pipelines, Repos, Boards, aprobaciones formales CAB.", "Pipelines corporativos multicloud."],
        ["Jenkins", "Automatización Open Source", "Plugins extensibles, Jenkinsfile declarativo y scripted.", "Servidor CI/CD On-Premises."],
        ["Docker", "Contenedores Ligeros", "Empaquetado de apps con namespaces y cgroups inmutables.", "Artefacto estándar de transporte."],
        ["Kubernetes", "Orquestación a Escala", "Autoescalado (HPA), autorreparación, balanceo de carga.", "Plataforma de ejecución productiva."],
        ["SonarQube", "Inspección de Código", "Análisis estático (SAST), detección de bugs, vulnerabilidades OWASP.", "Compuerta de calidad (Quality Gate)."],
        ["Postman / Newman", "Testing de APIs", "Colecciones OpenAPI, pruebas automáticas de contratos y CLI runner.", "Pruebas de integración y smoke tests."]
    ]
    add_styled_table(doc, tools_headers, tools_data, [1.2, 1.4, 2.4, 1.5])

    doc.add_page_break()

    # PARTE II
    add_heading_1(doc, "PARTE II: DOCUMENTO DE CONFIGURACIÓN DE AMBIENTES (FINANCEFLOW)")

    add_heading_2(doc, "1. Información General del Proyecto")
    info_headers = ["Campo", "Descripción Técnica"]
    info_data = [
        ["Nombre del Proyecto", "FinanceFlow — Sistema de Gestión Financiera & Inteligencia con IA"],
        ["Asignatura", "Construcción de Software II"],
        ["Institución", "Universidad Privada de Tacna — Facultad de Ingeniería (EPIS)"],
        ["Versión del Software", "v1.4.0 (Línea Base Post-Sprint 7)"],
        ["Fecha de Documento", "24 de Octubre de 2026"],
        ["Integrantes", "• Sebastian Arce Bracamonte (Código: 2019062886)\n• Brant Antony Chata Choque (Código: 2020067577)"],
        ["Docente Evaluador", "Mag. Ricardo Eduardo Valcárcel Alvarado"]
    ]
    add_styled_table(doc, info_headers, info_data, [2.2, 4.3])

    add_heading_2(doc, "2. Descripción del Proyecto")
    add_body_p(doc, "El descontrol financiero personal y familiar producto de la alta fricción operativa en el registro manual de gastos cotidianos (Yape, Plin, boletas). La carencia de herramientas automatizadas provoca abandono del control presupuestario y endeudamiento.", bold_prefix="Problema a Resolver: ")
    add_body_p(doc, "Desarrollar y desplegar una plataforma web inteligente de balance financiero personal que automatice la captura de transacciones mediante Visión por IA (OCR con Gemini Pro), clasifique gastos y proporcione analítica en tiempo real.", bold_prefix="Objetivo del Sistema: ")
    add_body_p(doc, "Frontend React 18 SPA interactivo, Backend REST Express en Node.js, Microservicio de IA y base de datos MongoDB Atlas en la nube con módulo de pagos Culqi y observabilidad Sentry.", bold_prefix="Alcance Tecnológico: ")
    add_body_p(doc, "Usuarios Gratuitos (Free), Usuarios Pro (suscripción con escaneo ilimitado) y Administradores / Contadores.", bold_prefix="Usuarios Involucrados: ")
    add_body_p(doc, "React 18, Tailwind CSS, Node.js 20 LTS, Express 5, Mongoose ODM, MongoDB Atlas, Zod, Bcrypt, Helmet, Gemini Vision API, Culqi, Vercel, Render, GitHub Actions.", bold_prefix="Tecnologías Utilizadas: ")

    add_heading_2(doc, "3. Arquitectura de la Solución")
    add_body_p(doc, "La solución adopta una arquitectura de Tres Capas Distribuida en la Nube con alta resiliencia y desacoplamiento:")
    add_bullet_p(doc, "Single Page Application en React 18 desplegada en la red Edge CDN global de Vercel con reescritura de rutas y protección HTTPS automática.", bold_prefix="Capa de Presentación (Frontend): ")
    add_bullet_p(doc, "API REST modular en Node.js/Express 5 alojada en Render Web Services con middlewares de seguridad (Helmet, Rate Limit, Zod) y conexión a Gemini Vision API.", bold_prefix="Capa de Lógica de Negocio (Backend): ")
    add_bullet_p(doc, "Clúster dedicado MongoDB Atlas M10 con réplicas distribuidas Multi-AZ, índices compuestos y cifrado transparente en reposo AES-256.", bold_prefix="Capa de Persistencia (Base de Datos): ")
    add_bullet_p(doc, "Google Gemini Pro Vision API para OCR, pasarela de pago Culqi para suscripciones Pro y Sentry para monitoreo de excepciones en vivo.", bold_prefix="Servicios e Integraciones Externas: ")

    add_heading_2(doc, "4. Configuración Técnica de Ambientes")

    add_heading_3(doc, "Ambiente DEV (Desarrollo Local)")
    dev_headers = ["Recurso", "Configuración Aplicada en FinanceFlow"]
    dev_data = [
        ["Sistema Operativo", "Windows 11 Pro (64 bits) / Ubuntu 22.04 LTS (WSL2)"],
        ["IDE & Extensiones", "VS Code v1.94+ (ESLint, Prettier, Tailwind IntelliSense, GitLens)"],
        ["Frameworks & Runtimes", "Node.js v20.18.0 LTS, React 18, Express 5"],
        ["Base de Datos", "MongoDB Community Server v7.0 local (mongodb://localhost:27017/financeflow_dev)"],
        ["Contenedores", "Docker Desktop para base de datos y mocks auxiliares"]
    ]
    add_styled_table(doc, dev_headers, dev_data, [2.2, 4.3])

    add_heading_3(doc, "Ambiente QA (Aseguramiento de Calidad)")
    qa_headers = ["Recurso", "Configuración Aplicada en FinanceFlow"]
    qa_data = [
        ["Servidor de Aplicación", "Render Cloud Starter Container en Linux Ubuntu dedicado a QA"],
        ["Herramientas QA", "Postman / Newman para contratos API, Jest v29.7, Supertest"],
        ["Automatización CI", "GitHub Actions Workflow ejecutando 12 suites de prueba automáticas"],
        ["Base de Datos", "MongoDB Atlas clúster QA (financeflow_qa) con datos sintéticos sembrados"]
    ]
    add_styled_table(doc, qa_headers, qa_data, [2.2, 4.3])

    add_heading_3(doc, "Ambiente STAGING (Preproducción)")
    stg_headers = ["Recurso", "Configuración Aplicada en FinanceFlow"]
    stg_data = [
        ["Infraestructura Cloud", "Render Standard Service + Vercel Preview Deployment sobre red Edge"],
        ["Seguridad SSL / TLS", "TLS 1.3 con certificados gestionados por Cloudflare / Let's Encrypt"],
        ["Monitoreo & Telemetría", "Sentry SDK con tag environment='staging' y captura de excepciones"],
        ["Pruebas Ejecutadas", "Pruebas de carga con k6, verificación de migración de índices y prueba de rollback"]
    ]
    add_styled_table(doc, stg_headers, stg_data, [2.2, 4.3])

    add_heading_3(doc, "Ambiente PROD (Producción)")
    prod_headers = ["Recurso", "Configuración Aplicada en FinanceFlow"]
    prod_data = [
        ["Hosting Frontend / Backend", "Vercel Edge Network (Frontend) + Render High Availability (Backend)"],
        ["Base de Datos Principal", "MongoDB Atlas M10 (Dedicated 3-Node Replica Set en AWS us-east-1)"],
        ["Escalabilidad", "Auto-scaling horizontal en Edge CDN y escalado vertical en Render"],
        ["Estrategia de Backups", "Snapshots continuos cada 6h (Point-in-Time Recovery) + mongodump diario en S3"],
        ["Hardening de Seguridad", "Helmet HTTP Headers, Rate Limit (100 req/15min), Zod sanitization, CORS estricto"]
    ]
    add_styled_table(doc, prod_headers, prod_data, [2.2, 4.3])

    add_heading_2(doc, "5. Gestión de Versiones")
    add_body_p(doc, "Se adopta un modelo GitFlow adaptado con ramas main (producción inmutable), develop (integración continua), feature/* (desarrollo de historias), release/* (congelamiento de versión) y hotfix/* (correcciones de emergencia en producción).", bold_prefix="Modelo de Ramas: ")
    add_body_p(doc, "Se rige bajo la especificación Conventional Commits v1.0.0 (feat, fix, docs, refactor, test, chore) garantizando mensajes descriptivos y generación automática de changelogs.", bold_prefix="Convenciones de Commits: ")
    add_body_p(doc, "Formato MAJOR.MINOR.PATCH (SemVer 2.0.0). Versión oficial liberada: v1.4.0.", bold_prefix="Versionado Semántico: ")
    add_body_p(doc, "Protección de ramas en GitHub exigiendo Pull Request, mínimo 1 aprobación de peer review y 100% de tests en verde en GitHub Actions antes del merge.", bold_prefix="Flujo de Aprobación: ")

    add_heading_2(doc, "6. Seguridad de Ambientes (Defense in Depth)")
    add_bullet_p(doc, "MFA obligatorio en GitHub, Atlas, Render y Vercel mediante TOTP.", bold_prefix="1. MFA: ")
    add_bullet_p(doc, "Principio de menor privilegio con credenciales diferenciadas por entorno y roles de aplicación (RBAC).", bold_prefix="2. Gestión de Accesos: ")
    add_bullet_p(doc, "IP Whitelisting en MongoDB Atlas restringiendo el acceso exclusivamente a los servidores de Render.", bold_prefix="3. Firewall: ")
    add_bullet_p(doc, "Validación de roles a nivel de middleware rechazando accesos no autorizados a rutas /api/admin/*.", bold_prefix="4. Roles y Permisos: ")
    add_bullet_p(doc, "Cifrado en tránsito TLS 1.3 con forzado HTTPS y cifrado en reposo AES-256 en MongoDB Atlas.", bold_prefix="5. Cifrado: ")
    add_bullet_p(doc, "Estrategia 3-2-1 con snapshots continuos cada 6 horas y restauración Point-in-Time.", bold_prefix="6. Respaldo de Información: ")
    add_bullet_p(doc, "Escaneo continuo con npm audit en cada push para bloquear dependencias vulnerables.", bold_prefix="7. Gestión de Vulnerabilidades: ")

    doc.add_page_break()

    # PARTE III
    add_heading_1(doc, "PARTE III: PROCEDIMIENTO FORMAL DE DESPLIEGUE")
    add_body_p(doc, "Establecer la metodología formal y auditable para ejecutar la puesta en producción de FinanceFlow v1.4.0 garantizando cero tiempo de inactividad visible, integridad absoluta de datos contables y capacidad de rollback ante emergencias.", bold_prefix="Objetivo: ")
    add_body_p(doc, "Aplica transversalmente a los entornos DEV, QA, STAGING y PRODUCCIÓN cubriendo frontend, backend y base de datos.", bold_prefix="Alcance: ")

    add_heading_2(doc, "Roles y Responsabilidades en el Despliegue")
    roles_headers = ["Rol", "Responsable Titular", "Responsabilidad Principal"]
    roles_data = [
        ["Scrum Master / Líder", "Sebastian Arce", "Autorizar despliegues, coordinar ventanas de cambio y convocar reunión Go/No-Go."],
        ["Desarrollador", "Brant Chata", "Preparar la versión, compilar artefactos y resolver bugs de release."],
        ["Tester / QA", "Sebastian Arce", "Ejecutar suites de pruebas funcionales, regression testing y certificar smoke tests."],
        ["DevOps & Cloud", "Brant Chata", "Orquestar pipeline CI/CD, inyectar variables de entorno y ejecutar despliegue en nube."],
        ["Administrador BD (DBA)", "Brant Chata", "Gestionar réplicas, aplicar índices de forma idempotente y ejecutar backups."],
        ["Cliente / Product Owner", "Docente / Evaluador", "Aceptación final de la versión candidata en entorno de Staging."]
    ]
    add_styled_table(doc, roles_headers, roles_data, [1.5, 1.5, 3.5])

    add_heading_2(doc, "Procedimiento General en Seis Fases")
    add_body_p(doc, "Corte de rama release/v1.4.0, actualización de package.json, creación de tag Git inmutable y respaldo completo de MongoDB Atlas con mongodump.", bold_prefix="Fase 1: Preparación: ")
    add_body_p(doc, "Ejecución de las 12 suites de prueba automatizadas (Jest/Supertest), auditoría npm audit y verificación de pruebas de integración con Postman.", bold_prefix="Fase 2: Pruebas: ")
    add_body_p(doc, "Revisión técnica de métricas de calidad, evaluación de riesgos de la ventana y suscripción del acta Go/No-Go por el Scrum Master y Product Owner.", bold_prefix="Fase 3: Aprobación: ")
    add_body_p(doc, "Aplicación de índices en MongoDB Atlas, despliegue rolling update del backend en Render y despliegue del frontend en Vercel con conmutación atómica.", bold_prefix="Fase 4: Despliegue: ")
    add_body_p(doc, "Ejecución de Smoke Tests en vivo (acceso web HTTP 200, login JWT, registro de movimiento y escaneo OCR) e inspección de logs en Sentry.", bold_prefix="Fase 5: Validación: ")
    add_body_p(doc, "Fusión de release a main y develop, cierre de tickets en Jira/GitHub Projects, registro de evidencias y sesión post-mortem de lecciones aprendidas.", bold_prefix="Fase 6: Cierre: ")

    doc.add_page_break()

    # PARTE IV: ANEXOS
    add_heading_1(doc, "PARTE IV: ANEXOS OBLIGATORIOS")

    add_heading_2(doc, "Anexo A: Matriz RACI Integral de Despliegue")
    raci_headers = ["Actividad Operativa", "Desarrollador", "QA", "DevOps", "Líder", "DBA", "Cliente"]
    raci_data = [
        ["Configuración de Variables y Entornos", "R", "C", "A", "I", "C", "I"],
        ["Desarrollo y Pruebas Unitarias", "R", "C", "I", "A", "I", "I"],
        ["Pruebas Funcionales y E2E", "C", "R", "I", "A", "I", "C"],
        ["Auditoría de Seguridad y Vulnerabilidades", "C", "C", "R", "A", "I", "I"],
        ["Respaldo de Base de Datos Pre-Deploy", "I", "I", "C", "I", "R / A", "I"],
        ["Aprobación de la Ventana (CAB)", "C", "C", "C", "R", "C", "A"],
        ["Despliegue a QA / Staging", "C", "I", "R", "A", "C", "I"],
        ["Despliegue a Producción", "C", "I", "R", "A", "C", "I"],
        ["Smoke Tests Post-Despliegue", "C", "R", "I", "A", "I", "C"],
        ["Ejecución de Rollback (ante fallos)", "C", "C", "R", "A", "R", "I"],
        ["Cierre y Acta de Conformidad", "I", "I", "I", "R", "I", "A"]
    ]
    add_styled_table(doc, raci_headers, raci_data, [2.2, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8])

    add_heading_2(doc, "Anexo B: Checklist de Despliegue")
    add_body_p(doc, "Verificaciones mandatorias previas al inicio de la ventana de cambio:", bold_prefix="Pre-Despliegue: ")
    add_bullet_p(doc, "Pull Request aprobado con revisión por pares; sin cambios no rastreados.", bold_prefix="[X] Código Aprobado: ")
    add_bullet_p(doc, "12 suites de pruebas aprobadas al 100% (29 tests superados).", bold_prefix="[X] Pruebas Completadas: ")
    add_bullet_p(doc, "Snapshot inmutable de MongoDB Atlas confirmado y descargado.", bold_prefix="[X] Backups Realizados: ")
    add_bullet_p(doc, "Release notes y CHANGELOG.md actualizados con la versión v1.4.0.", bold_prefix="[X] Documentación Actualizada: ")
    add_bullet_p(doc, "Plan de rollback listo y canales de comunicación abiertos.", bold_prefix="[X] Riesgos Identificados: ")

    add_body_p(doc, "Criterios obligatorios de aceptación tras el despliegue:", bold_prefix="Post-Despliegue: ")
    add_bullet_p(doc, "Frontend web en https://financeflow.app respondiendo HTTP 200 OK.", bold_prefix="[X] Aplicación Disponible: ")
    add_bullet_p(doc, "Backend en Render respondiendo con éxito a /api/healthcheck.", bold_prefix="[X] Servicios Operativos: ")
    add_bullet_p(doc, "Conexión a MongoDB Atlas validada con latencia < 50ms e índices activos.", bold_prefix="[X] Base de Datos Validada: ")
    add_bullet_p(doc, "Cero excepciones HTTP 500 registradas en Sentry durante los primeros 15 minutos.", bold_prefix="[X] Observabilidad Estable: ")
    add_bullet_p(doc, "Product Owner y equipo conformes con la versión puesta en marcha.", bold_prefix="[X] Usuario Conforme: ")

    add_heading_2(doc, "Anexo C: Plan de Rollback")
    add_body_p(doc, "Fallo irrecuperable en base de datos, crash continuo del backend en Render, colapso de renderizado frontend (pantalla blanca) o fuga crítica de claves de seguridad.", bold_prefix="Escenarios de Falla: ")
    add_body_p(doc, "Autoriza: Sebastian Arce (Líder). Ejecutan: Brant Chata (DevOps / DBA).", bold_prefix="Responsables: ")
    add_body_p(doc, "RTO (Recovery Time Objective) menor a 10 minutos. RPO (Recovery Point Objective) menor a 15 minutos.", bold_prefix="Métricas de Recuperación: ")
    add_body_p(doc, "1) Reversión de alias en Vercel a la versión v1.3.0 (< 30s). 2) Conmutación de imagen en Render al tag anterior (2-3 min). 3) Restauración Point-in-Time en MongoDB Atlas mediante mongorestore (< 5 min).", bold_prefix="Procedimiento de Reversión: ")
    add_body_p(doc, "Ejecución inmediata de smoke tests sobre la versión previa y reunión post-mortem de análisis de causa raíz (RCA) dentro de las 24 horas siguientes.", bold_prefix="Validación Posterior: ")

    add_heading_2(doc, "Anexo D: Pipeline CI/CD")
    add_body_p(doc, "El pipeline automatizado de FinanceFlow está implementado mediante GitHub Actions en el archivo .github/workflows/deploy-pipeline.yml e integra 6 etapas continuas:")
    add_bullet_p(doc, "npm audit en dependencias de backend y frontend con reporte de seguridad.", bold_prefix="Stage 1: DevSecOps & Linting: ")
    add_bullet_p(doc, "Ejecución de las 12 suites de pruebas unitarias y de integración de Jest y Supertest.", bold_prefix="Stage 2: Pruebas Automáticas: ")
    add_bullet_p(doc, "Verificación estricta de cobertura mínima del 75% y cero vulnerabilidades críticas.", bold_prefix="Stage 3: Quality Gate: ")
    add_bullet_p(doc, "Despliegue automático en el entorno Sandbox de Render ante cambios en develop.", bold_prefix="Stage 4: Deploy a QA: ")
    add_bullet_p(doc, "Despliegue de la versión candidata ante merges en la rama main con pruebas de carga.", bold_prefix="Stage 5: Deploy a Staging: ")
    add_bullet_p(doc, "Despliegue a producción con verificación previa de snapshot de Atlas y conmutación atómica al detectar un tag de release v*.*.*.", bold_prefix="Stage 6: Deploy a Producción: ")

    doc.add_page_break()

    # ENTREGABLES 8, 9 Y 10
    add_heading_1(doc, "EVIDENCIAS TÉCNICAS Y SUSTENTACIÓN")

    add_heading_2(doc, "Entregable 8: Evidencias del Repositorio Git")
    add_body_p(doc, "Repositorio GitHub: https://github.com/KrCrimson/FinanceFlow\nRama Activa: main (sincronizada con origin/main)\nRamas de Módulos: feature/admin-dashboard, documentacion, mobile, copilot/improve-use-case-narratives.\nÚltimos Commits Clave: fix(pagos): consolida pasarela a Culqi y corrige bugs de plan Pro y metas planificadas; Create GUIA_EJECUCION_PRUEBAS.md.")

    add_heading_2(doc, "Entregable 9: Evidencias de Pruebas Automatizadas")
    add_body_p(doc, "Resultado Certificado de Jest & Supertest:")
    add_callout(doc, "Resultado de Pruebas en Backend", "Test Suites: 12 passed, 12 total | Tests: 29 passed, 29 total | Snapshots: 0 | Time: 6.797 s | PASS al 100%")

    add_heading_2(doc, "Entregable 10: Presentación de Sustentación (15 Minutos)")
    add_body_p(doc, "La sustentación oficial ante el docente Mag. Ricardo Valcárcel Alvarado está estructurada en 20 diapositivas ejecutivas con una duración cronometrada de 15 minutos, cubriendo contexto (2 min), teoría y estrategias (2.5 min), ambientes y DevOps (2.5 min), arquitectura y configuración (3 min), procedimiento y pipeline (2.5 min), rollback y pruebas (1.5 min) y conclusiones (1 min).")

    # Guardar
    output_filename = "CONFIGURACION_AMBIENTES_Y_DESPLIEGUE_FINANCEFLOW.docx"
    doc.save(output_filename)
    print(f"Documento Word generado exitosamente: {output_filename}")

if __name__ == "__main__":
    build_word_document()
