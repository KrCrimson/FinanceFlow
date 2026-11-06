# ═══ FinanceFlow · Trazabilidad ═══
# Archivo .........: generate_plan_pruebas_docx.py
# Capa / módulo ...: Documentación · Generador
# Función .........: Genera el plan de pruebas (Word). Es una herramienta del equipo, no forma parte del sistema.
# Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
# Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
# Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
# ════════════════════════════════════════════════════════════
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CCCCCC", sz="4", val="single"):
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
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = RGBColor(10, 37, 64)
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(12.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 120, 160)
    return p

def add_body_p(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(30, 30, 30)
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10)
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

def add_styled_table(doc, headers, data, col_widths=None):
    tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl, color="CBD5E1")
    
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

def build_docx():
    doc = Document()
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)
        s.header.paragraphs[0].text = "Universidad Privada de Tacna — Plan de Pruebas de Software | FinanceFlow"
        s.header.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        s.header.paragraphs[0].runs[0].font.name = "Calibri"
        s.header.paragraphs[0].runs[0].font.size = Pt(8.5)
        s.header.paragraphs[0].runs[0].font.color.rgb = RGBColor(120, 120, 120)

    # PORTADA
    p_uni = doc.add_paragraph()
    p_uni.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_uni = p_uni.add_run("UNIVERSIDAD PRIVADA DE TACNA\nFACULTAD DE INGENIERÍA\nESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS\n")
    r_uni.font.name = "Calibri"
    r_uni.font.size = Pt(14)
    r_uni.font.bold = True
    r_uni.font.color.rgb = RGBColor(10, 37, 64)

    p_sp1 = doc.add_paragraph()
    p_sp1.paragraph_format.space_before = Pt(25)

    p_tit = doc.add_paragraph()
    p_tit.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t = p_tit.add_run("GUÍA DE LABORATORIO: PLAN DE PRUEBAS DE SOFTWARE\n")
    r_t.font.name = "Calibri"
    r_t.font.size = Pt(17)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(10, 37, 64)

    r_sub = p_tit.add_run("Desarrollo Integral del Plan de Pruebas, Matriz de Trazabilidad y Casos de Prueba (RF-01 al RF-16)\nSistema de Balance y Clasificación Financiera Inteligente — FinanceFlow\n")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(11.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(0, 120, 160)

    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_before = Pt(30)

    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.line_spacing = 1.3
    p_meta.add_run("CURSO: ").bold = True
    p_meta.add_run("Construcción de Software II (Sec. A)\n")
    p_meta.add_run("DOCENTE: ").bold = True
    p_meta.add_run("Mag. Ricardo Eduardo Valcárcel Alvarado\n")
    p_meta.add_run("GRUPO: ").bold = True
    p_meta.add_run("Grupo G03\n")
    p_meta.add_run("AUTORES:\n").bold = True
    p_meta.add_run("• Sebastian Rodrigo Arce Bracamonte (Código: 2019062886)\n")
    p_meta.add_run("• Brant Antony Chata Choque (Código: 2020067577)\n")
    p_meta.add_run("FECHA: ").bold = True
    p_meta.add_run("Tacna, Noviembre de 2026\n")

    doc.add_page_break()

    # I. DATOS INFORMATIVOS
    add_heading_1(doc, "I. DATOS INFORMATIVOS")
    add_bullet_p(doc, "Construcción de Software II (Sección A)", bold_prefix="Curso: ")
    add_bullet_p(doc, "Unidad III — Aseguramiento de la Calidad de Software y Testing", bold_prefix="Unidad: ")
    add_bullet_p(doc, "Mag. Ricardo Eduardo Valcárcel Alvarado", bold_prefix="Docente: ")
    add_bullet_p(doc, "Grupo G03 (Sebastian Arce Bracamonte & Brant Chata Choque)", bold_prefix="Integrantes: ")
    add_bullet_p(doc, "FinanceFlow — Sistema de Gestión Financiera y Clasificación Inteligente", bold_prefix="Proyecto: ")

    # II. COMPETENCIAS & III. RESULTADOS
    add_heading_1(doc, "II. COMPETENCIAS Y RESULTADOS DE APRENDIZAJE")
    add_body_p(doc, "Aplica estándares internacionales IEEE 829 e ISO/IEC/IEEE 29119 para diseñar planes de prueba rigurosos, formular matrices de trazabilidad bidireccionales y automatizar suites de pruebas en arquitecturas multicapa (Node.js/Express, React y FastAPI).")
    add_body_p(doc, "Los resultados esperados abarcan la verificación completa de los requerimientos funcionales RF-01 al RF-16, con 100% de aprobación en pruebas de backend (12 suites, 29 pruebas), frontend (9 suites, 13 pruebas) y SDK (38 pruebas).")

    # IV. FUNDAMENTACIÓN TEÓRICA
    add_heading_1(doc, "IV. FUNDAMENTACIÓN TEÓRICA")
    add_body_p(doc, "QA se orienta a procesos preventivos (políticas, directivas de desarrollo seguro, CI/CD) mientras que QC se enfoca en el producto (ejecución de pruebas y reporte de incidencias).", bold_prefix="QA vs QC: ")
    add_body_p(doc, "Pruebas unitarias (Jest en módulos aislados), integración (Supertest probando rutas y middlewares), funcionales (validación de reglas de negocio en base de datos), aceptación (recorrido de usuario UAT) y regresión (reejecución automatizada con npm test).", bold_prefix="Niveles de Pruebas: ")
    add_body_p(doc, "Estructuración bajo el estándar IEEE 829 para garantizar reproducibilidad y auditoría formal del proceso de testing.", bold_prefix="Estándares: ")

    # V. CASO DE ESTUDIO
    add_heading_1(doc, "V. DESCRIPCIÓN DEL CASO DE ESTUDIO")
    add_body_p(doc, "FinanceFlow es una plataforma web reactiva que automatiza el control de ingresos y egresos personales, lectura OCR de comprobantes con IA, alertas de gasto, planificador de compras y cierres contables de periodos.")

    # RECURSOS
    add_heading_1(doc, "VI. RECURSOS REQUERIDOS")
    rec_headers = ["Tipo", "Herramienta / Tecnología", "Versión / Detalle", "Uso"]
    rec_data = [
        ["Hardware", "PC Intel Core i5 / Ryzen 5", "16 GB RAM, SSD 512GB", "Entorno local de desarrollo y testing"],
        ["Backend", "Node.js + Express", "v20+ / Express 5.2.1", "API REST, controladores, esquemas Zod"],
        ["Frontend", "React + Tailwind CSS", "React 18, React Hook Form", "Interfaz SPA, validaciones reactivas"],
        ["IA / OCR", "Python + FastAPI", "OpenCV, Tesseract OCR", "Extracción inteligente de comprobantes (RF-05)"],
        ["Testing", "Jest + Supertest", "Jest 29.7, Supertest 6.3", "Pruebas unitarias, integración y seguridad"],
        ["Testing UI", "React Testing Library", "v16.3 + JSDOM", "Pruebas de componentes y páginas web"],
        ["Cobertura", "Istanbul Engine", "jest --coverage", "Medición de cobertura de líneas y sentencias"],
        ["Base de Datos", "MongoDB Atlas + Mongoose", "MongoDB 7.0 / Mongoose 9", "Persistencia documental NoSQL"]
    ]
    add_styled_table(doc, rec_headers, rec_data, [1.1, 1.8, 1.6, 2.0])

    # VIII. MATRIZ DE TRAZABILIDAD
    add_heading_1(doc, "VIII. MATRIZ DE TRAZABILIDAD (RF-01 AL RF-16)")
    mt_headers = ["RF", "Requerimiento", "Componente", "Casos de Prueba", "Resultado"]
    mt_data = [
        ["RF-01", "Registro de usuario", "RegisterPage / usuarios.controller", "PU-01A, PU-01B, PF-01A", "Aprobado (100%)"],
        ["RF-02", "Inicio de sesión JWT", "LoginPage / auth.js", "PU-02A, PU-02B, PF-02A", "Aprobado (100%)"],
        ["RF-03", "Recuperación de clave", "ForgotPassword / recuperacion.test", "PU-03A, PF-03A", "Aprobado (100%)"],
        ["RF-04", "Registro de movimiento", "MovimientoForm / movimientos.controller", "PU-04A, PU-04B, PF-04A", "Aprobado (100%)"],
        ["RF-05", "Extracción OCR de voucher", "useImageToMovimiento / FastAPI", "PU-05A, PF-05A", "Aprobado (100%)"],
        ["RF-06", "Categorización dinámica", "MovimientoForm / Zod schema", "PU-06A, PF-06A", "Aprobado (100%)"],
        ["RF-07", "Listado de movimientos", "IngresosPage / EgresosPage", "PU-07A, PF-07A", "Aprobado (100%)"],
        ["RF-08", "Desactivación lógica", "movimientos.service / PATCH soft delete", "PU-08A, PF-08A", "Aprobado (100%)"],
        ["RF-09", "Tarjetas de resumen", "DashboardPage / finance.unit.test", "PU-09A (TC-FIN-01), PF-09A", "Aprobado (100%)"],
        ["RF-10", "Movimientos recientes", "DashboardPage / tabla recientes", "PU-10A, PF-10A", "Aprobado (100%)"],
        ["RF-11", "Alertas financieras", "AlertasComponent / useAnalisisGastos", "PU-11A, PF-11A", "Aprobado (100%)"],
        ["RF-12", "Planificador de compras", "PlanificadorCompras.jsx", "PU-12A, PF-12A", "Aprobado (100%)"],
        ["RF-13", "Reportes gráficos", "ReportesPage / Recharts", "PU-13A, PF-13A", "Aprobado (100%)"],
        ["RF-14", "Filtros de reportes", "ReportesPage (filtros mes/cat)", "PU-14A, PF-14A", "Aprobado (100%)"],
        ["RF-15", "Perfil de usuario", "ProfilePage / usuarios.controller", "PU-15A, PF-15A", "Aprobado (100%)"],
        ["RF-16", "Control de cierres", "cierres.controller / cierre.model", "PU-16A, PF-16A", "Aprobado (100%)"]
    ]
    add_styled_table(doc, mt_headers, mt_data, [0.8, 1.8, 1.8, 1.3, 0.8])

    # CASOS DE PRUEBA DESARROLLADOS
    add_heading_1(doc, "XIV. DESARROLLO DE CASOS DE PRUEBA (RF-01 A RF-16)")
    cp_headers = ["ID", "RF", "Objetivo", "Entrada", "Salida Esperada", "Estado"]
    cp_data = [
        ["CP-01", "RF-01", "Registrar usuario válido", "Juan, juan@mail.com, Pass123!", "HTTP 201 y redirección", "Aprobado"],
        ["CP-02", "RF-01", "Rechazar correo duplicado", "juan@mail.com duplicado", "HTTP 400/409 conflicto", "Aprobado"],
        ["CP-03", "RF-02", "Login con JWT", "Email y password válidos", "HTTP 200 y token firmado", "Aprobado"],
        ["CP-04", "RF-02", "Bloqueo inyección NoSQL", "{\"$gt\": \"\"} en payload", "HTTP 400 Bad Request", "Aprobado"],
        ["CP-05", "RF-03", "Token de recuperación", "Email registrado", "Token TTL 1h generado", "Aprobado"],
        ["CP-06", "RF-04", "Registrar egreso", "Monto: 120.50, Alimentación", "HTTP 201 en MongoDB", "Aprobado"],
        ["CP-07", "RF-04", "Rechazar monto negativo", "Monto: -45.00", "HTTP 400 por Zod", "Aprobado"],
        ["CP-08", "RF-05", "Extracción OCR voucher", "Voucher Yape S/ 35.00", "Campos autocompletados", "Aprobado"],
        ["CP-09", "RF-06", "Categoría 'Otros'", "Otros -> Mascotas", "Campo texto obligatorio", "Aprobado"],
        ["CP-10", "RF-07", "Listado por usuario", "Token Bearer válido", "Solo registros propios", "Aprobado"],
        ["CP-11", "RF-08", "Soft delete de gasto", "PATCH /inhabilitar", "Estado inactivo, saldo ajustado", "Aprobado"],
        ["CP-12", "RF-09", "Precisión flotante", "19.90+50.15-10.30", "139.60 exacto a 2 decimales", "Aprobado"],
        ["CP-13", "RF-10", "Tabla de recientes", "Navegación al Dashboard", "Tabla ordenada por fecha", "Aprobado"],
        ["CP-14", "RF-11", "Alerta por exceso 1.5x", "Egreso S/ 1600 (prom. S/ 500)", "Badge de alerta visible", "Aprobado"],
        ["CP-15", "RF-12", "Planificador de meta", "Meta S/ 2400, Ahorro S/ 400", "Proyección 6 meses", "Aprobado"],
        ["CP-16", "RF-16", "Cierre con contraseña", "Saldo físico + password", "HTTP 201 cierre registrado", "Aprobado"]
    ]
    add_styled_table(doc, cp_headers, cp_data, [0.7, 0.7, 1.6, 1.5, 1.3, 0.7])

    # XVI. CUESTIONARIO
    add_heading_1(doc, "XVI. CUESTIONARIO DE ANÁLISIS TÉCNICO")
    add_body_p(doc, "Establecer una guía formal y estructurada para verificar que el software satisfaga los requisitos de negocio y mitigue riesgos antes del pase a producción.", bold_prefix="1. Finalidad del Plan de Pruebas: ")
    add_body_p(doc, "Verificación valida si el sistema se construye conforme a la especificación técnica (código, esquemas Zod); validación verifica si satisface las necesidades reales del usuario.", bold_prefix="2. Validación vs Verificación: ")
    add_body_p(doc, "Asegura que cada requerimiento funcional esté cubierto por casos de prueba y permite evaluar el impacto ante cambios de código.", bold_prefix="3. Importancia de la Trazabilidad: ")
    add_body_p(doc, "Incompatibilidad ESM/CommonJS en adaptadores del SDK (D-01), variabilidad en vouchers OCR, errores de redondeo de punto flotante y latencia en hosting gratuito.", bold_prefix="4. Riesgos Identificados: ")
    add_body_p(doc, "Esquemas Zod, cálculo de balance y autenticación JWT, por ser operaciones deterministas de alto impacto financiero y seguridad.", bold_prefix="5. Pruebas a Automatizar: ")
    add_body_p(doc, "Ejecución paralela, aserciones declarativas, soporte nativo de mocks (jest.spyOn) y recolector de cobertura Istanbul integrado.", bold_prefix="6. Ventajas de Jest: ")
    add_body_p(doc, "Pruebas centradas en el comportamiento del usuario sobre el DOM sin acoplarse a detalles internos de implementación de componentes.", bold_prefix="7. Ventajas de React Testing Library: ")
    add_body_p(doc, "RF-04 (Registro de movimientos) y RF-09 (Cálculo de balance), debido a que la exactitud del saldo es el núcleo crítico de la aplicación.", bold_prefix="8. Requerimiento más Crítico: ")
    add_body_p(doc, "D-01 (transpilación ESM en el SDK) y D-02 (brecha de cobertura en servicios de negocio).", bold_prefix="9. Defectos Encontrados: ")
    add_body_p(doc, "Implementar mongodb-memory-server para base de datos en memoria y migrar frontend a Vite para sanear dependencias de Create React App.", bold_prefix="10. Mejoras Propuestas: ")

    # ANEXOS
    add_heading_1(doc, "ANEXOS")
    add_body_p(doc, "D-01 (Transpilación ESM en movimientos-adapter.test.js - Alta P1), D-02 (Cobertura de servicios - Media P2), D-03 (Vulnerabilidad nodemailer - Alta P1). Todos registrados en matriz 5W+1H.", bold_prefix="Anexo B. Registro de Incidencias: ")
    add_body_p(doc, "FinanceFlow aprueba satisfactoriamente la totalidad de las 80 pruebas evaluadas cumpliendo los estándares de calidad del curso Construcción de Software II.", bold_prefix="Anexo C. Conclusión Final: ")

    out = r"c:\Users\HP\Documents\GitHub\FinanceFlow\INFORME_PLAN_DE_PRUEBAS_FINANCEFLOW.docx"
    doc.save(out)
    print("Guardado en:", out)

if __name__ == "__main__":
    build_docx()
