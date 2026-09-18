# claude-skills

Mis skills personales de Claude Code, sincronizadas entre dispositivos con git.

## Estructura

Cada skill vive en su propia carpeta en la raíz de este repo, con el mismo
nombre que usa `~/.claude/skills/<nombre>/` en cada máquina:

```
claude-skills/
├── examen-cinematico/
│   └── scripts/
│       └── build_exam.mjs
└── (futuras skills aquí)
```

## Subir una skill existente desde tu máquina (una sola vez por skill)

```bash
cd ~/claude-skills          # este repo, ya clonado
git pull
mkdir -p examen-cinematico
cp -r ~/.claude/skills/examen-cinematico/* examen-cinematico/
git add -A
git commit -m "Agrega examen-cinematico"
git push
```

## Sincronizar en un dispositivo nuevo

```bash
git clone https://github.com/antoniofguardia01/claude-skills.git ~/claude-skills
ln -s ~/claude-skills/examen-cinematico ~/.claude/skills/examen-cinematico
# (repite el symlink por cada skill que quieras activa en esa máquina)
```

El symlink hace que editar en `~/claude-skills/...` o en
`~/.claude/skills/...` sea lo mismo: es el mismo archivo en disco.

## Actualizar después de un cambio

```bash
cd ~/claude-skills
git add -A && git commit -m "Describe el cambio"
git push
```

Y en cualquier otro dispositivo, para traer lo nuevo:

```bash
cd ~/claude-skills && git pull
```
