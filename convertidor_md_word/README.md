# Convertidor Markdown a Word

Herramienta simple para convertir archivos `.md` a `.docx` y exportar la documentación de FinanceFlow a Word.

## Requisitos

```bash
pip install -r requirements.txt
```

## Uso

```bash
python convertidor_md_word.py "ruta\al\archivo.md" "ruta\al\salida.docx"
```

## Notas

- Soporta encabezados, tablas, listas, bloques de código, enlaces, imagenes y citas simples.
- Si una imagen referenciada en Markdown existe en disco, intenta insertarla en el documento Word.
- Para documentos grandes, conviene ejecutar el convertidor sobre una copia del archivo original.
