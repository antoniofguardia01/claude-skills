# {{TITULO}}

Presentación web interactiva (HTML + CSS + JS, sin dependencias ni build).

## Ver en local
Abre `index.html` en el navegador, o sirve la carpeta:

```bash
npx serve .
```

## Controles
| Tecla | Acción |
|---|---|
| → / Espacio / clic en ▶ | Siguiente |
| ← | Anterior |
| O | Vista general de todas las slides |
| F | Pantalla completa |
| 1‑9 (dos dígitos rápidos) | Ir a una slide |
| ? | Ayuda |
| Deslizar (móvil) | Cambiar slide |

Cada slide tiene su URL: `…/#5` abre directamente la 5.
Para exportar a PDF: Imprimir → Guardar como PDF (una slide por página).

## Publicar
1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com → **Add New… → Project** → importa el repo.
3. Framework preset: **Other**. Sin build command. Output directory: `.` (raíz).
4. Deploy. Cada `git push` vuelve a publicar.
