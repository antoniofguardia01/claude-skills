# Mis skills de Claude

Repo de mis skills personales. Este repo **es** la carpeta `~/.claude/skills`, así que no hay pasos de copiado.

## Skills

| Skill | Qué hace |
|---|---|
| `ppt-interactivo` | Convierte un .pptx en slides web interactivos (HTML/CSS/JS) para GitHub + Vercel |
| `examen-cinematico` | Exámenes de repaso interactivos con estética cinematográfica |
| `exam-prep-kit` | Guía de estudio en Word + examen práctico HTML a partir de apuntes |
| `pdf-study-summary` | Guía de estudio unificada en PDF a partir de apuntes/PDFs |

## Instalar en un dispositivo nuevo

Requiere `git`. Cierra Claude Code/Desktop, luego:

**Windows (PowerShell)**
```powershell
cd $env:USERPROFILE\.claude\skills   # créala si no existe
git init -b main
git remote add origin https://github.com/antoniofguardia01/claude-skills.git
git pull origin main
```

**macOS / Linux**
```bash
mkdir -p ~/.claude/skills && cd ~/.claude/skills
git init -b main
git remote add origin https://github.com/antoniofguardia01/claude-skills.git
git pull origin main
```

(Si el repo es privado, autentícate antes con `gh auth login`.)

Reinicia Claude y las skills aparecen solas.

## Día a día

```bash
cd ~/.claude/skills
git add -A && git commit -m "nueva skill: xxx" && git push   # subir cambios
git pull                                                     # traer cambios de otro equipo
```

Cualquier carpeta nueva en `~/.claude/skills` se sube automáticamente. Si instalas una skill de terceros
y **no** quieres subirla, añade su carpeta a `.gitignore`.
