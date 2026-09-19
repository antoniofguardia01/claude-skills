# Checklist de calidad — guía de estudio

Antes de entregar el .docx, verifica rápidamente:

1. **Conversión a PDF y revisión visual.** Convierte con
   `python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf archivo.docx`
   y renderiza 2-3 páginas representativas (portada, una página con tabla de dos columnas, la última página) con `pdftoppm -jpeg -r 90 archivo.pdf page` para revisarlas con la herramienta `view`. Confirma que las tablas no se corten mal, que el texto en negrita/color se vea legible, y que no haya celdas vacías por error.

2. **Cobertura de temas.** Cada encabezado H1 de la guía debería corresponder a un `topics` id usado en el examen interactivo — así el estudiante puede repasar la sección exacta y luego filtrar la práctica por ese mismo tema.

3. **Sección de "errores comunes / trampas de examen".** Siempre incluir una al final: pares de términos fáciles de confundir, mecanismos opuestos, o secuencias que suelen invertirse. Esta sección es la que más se usa la noche antes del examen — no la omitas por espacio.

4. **Consistencia con el examen interactivo.** Los términos, nombres y datos numéricos de la guía deben coincidir exactamente con los usados en las preguntas del HTML (mismas cifras, mismas grafías/tildes). Si cambias algo en uno, revisa el otro.

5. **Longitud razonable.** No hace falta un libro de texto — prioriza tablas comparativas y bullets sobre párrafos largos; es una guía de repaso rápido, no el material de clase completo.
