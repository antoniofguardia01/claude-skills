"""Genera un remolcador ASD en proyección oblicua (vista cenital con volumen) para la portada.
Coordenadas locales: proa hacia +x, babor hacia -y. Altura z se proyecta como (x + KX*z, y - KY*z)."""
KX, KY = .22, .6


def P(x, y, z=0):
    return f"{x + KX * z:.1f},{y - KY * z:.1f}"


def caja(x1, y1, x2, y2, z0, h, top, sur, oeste, extra=""):
    """Caja con cara superior, cara sur (+y) y cara oeste (-x) visibles."""
    z1 = z0 + h
    s = []
    s.append(f'<polygon points="{P(x1,y2,z0)} {P(x2,y2,z0)} {P(x2,y2,z1)} {P(x1,y2,z1)}" fill="{sur}"/>')
    s.append(f'<polygon points="{P(x1,y1,z0)} {P(x1,y2,z0)} {P(x1,y2,z1)} {P(x1,y1,z1)}" fill="{oeste}"/>')
    s.append(f'<polygon points="{P(x1,y1,z1)} {P(x2,y1,z1)} {P(x2,y2,z1)} {P(x1,y2,z1)}" fill="{top}" {extra}/>')
    return "\n".join(s)


def cilindro(cx, cy, r, z0, h, lado, tapa, borde=None):
    """Cilindro vertical: cuerpo (rectángulo entre elipses) + tapa."""
    x0, y0 = cx + KX * z0, cy - KY * z0
    x1, y1 = cx + KX * (z0 + h), cy - KY * (z0 + h)
    ry = r * .55
    s = [f'<path d="M{x0 - r:.1f},{y0:.1f} A{r},{ry} 0 0 0 {x0 + r:.1f},{y0:.1f} L{x1 + r:.1f},{y1:.1f} A{r},{ry} 0 0 1 {x1 - r:.1f},{y1:.1f} Z" fill="{lado}"/>',
         f'<ellipse cx="{x1:.1f}" cy="{y1:.1f}" rx="{r}" ry="{ry:.1f}" fill="{tapa}"' + (f' stroke="{borde}" stroke-width="1.2"' if borde else "") + '/>']
    return "\n".join(s)


# Casco (planta ASD: popa ancha, proa roma)
def casco(dx=0, dy=0, sx=1, sy=1):
    pts = [(-150, -50), (-135, -62), (70, -62), (125, -58), (152, -22), (156, 0), (152, 22), (125, 58), (70, 62), (-135, 62), (-150, 50)]
    q = [(x * sx + dx, y * sy + dy) for x, y in pts]
    d = f"M{q[0][0]:.1f},{q[0][1]:.1f} Q{-152*sx+dx:.1f},{-62*sy+dy:.1f} {q[1][0]:.1f},{q[1][1]:.1f} L{q[2][0]:.1f},{q[2][1]:.1f} "
    d += f"C{120*sx+dx:.1f},{-62*sy+dy:.1f} {150*sx+dx:.1f},{-40*sy+dy:.1f} {q[5][0]:.1f},{q[5][1]:.1f} "
    d += f"C{150*sx+dx:.1f},{40*sy+dy:.1f} {120*sx+dx:.1f},{62*sy+dy:.1f} {q[8][0]:.1f},{q[8][1]:.1f} "
    d += f"L{q[9][0]:.1f},{q[9][1]:.1f} Q{-152*sx+dx:.1f},{62*sy+dy:.1f} {q[10][0]:.1f},{q[10][1]:.1f} Z"
    return d


H_CASCO = 16   # francobordo visible
out = []
out.append('''<defs>
  <linearGradient id="tg-cubierta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b5b69"/><stop offset="1" stop-color="#2c3945"/></linearGradient>
  <linearGradient id="tg-casco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#23272b"/><stop offset="1" stop-color="#07090b"/></linearGradient>
  <linearGradient id="tg-blanco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e1e8"/></linearGradient>
  <linearGradient id="tg-cristal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d2a44"/><stop offset=".45" stop-color="#3f7fa6"/><stop offset=".55" stop-color="#9cd3ea"/><stop offset="1" stop-color="#123552"/></linearGradient>
  <linearGradient id="tg-chimenea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6c46e"/><stop offset="1" stop-color="#9c7a2c"/></linearGradient>
  <linearGradient id="tg-tambor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a97a3"/><stop offset=".5" stop-color="#dfe6ec"/><stop offset="1" stop-color="#6c7985"/></linearGradient>
  <radialGradient id="tg-luzR"><stop offset="0" stop-color="#ff5a64"/><stop offset="1" stop-color="#ff5a64" stop-opacity="0"/></radialGradient>
  <radialGradient id="tg-luzV"><stop offset="0" stop-color="#48f09a"/><stop offset="1" stop-color="#48f09a" stop-opacity="0"/></radialGradient>
  <radialGradient id="tg-luzB"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <filter id="tg-sombra" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="tg-ao" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>''')

# sombra sobre el agua
out.append(f'<path d="{casco(14, 26, 1.02, 1.05)}" fill="#000" opacity=".55" filter="url(#tg-sombra)"/>')
# estela de popa (hélices azimutales) y ola de proa
out.append('''<g class="tg-estela" fill="none" stroke="#dff4fb" stroke-linecap="round">
  <path d="M-150,-30 C-200,-36 -250,-52 -320,-70" stroke-opacity=".35" stroke-width="2"/>
  <path d="M-150,30 C-200,36 -250,52 -320,70" stroke-opacity=".35" stroke-width="2"/>
  <ellipse class="tg-helice" cx="-168" cy="-24" rx="16" ry="9" stroke-opacity=".45" stroke-width="1.5"/>
  <ellipse class="tg-helice h2" cx="-168" cy="24" rx="16" ry="9" stroke-opacity=".45" stroke-width="1.5"/>
  <path d="M-175,-24 H-300 M-175,24 H-300" stroke-opacity=".18" stroke-width="6" stroke-dasharray="10 14" class="tg-espuma"/>
  <path d="M150,-40 C170,-30 178,-12 180,0 C178,12 170,30 150,40" stroke-opacity=".4" stroke-width="2"/>
  <path d="M140,-58 C175,-50 196,-30 204,-8 M140,58 C175,50 196,30 204,8" stroke-opacity=".2" stroke-width="1.5"/>
</g>''')
# casco: costado (negro) visible bajo la cubierta
out.append(f'<path d="{casco(0, H_CASCO)}" fill="url(#tg-casco)"/>')
out.append(f'<path d="{casco(0, H_CASCO * .55)}" fill="none" stroke="#e2313f" stroke-width="2.2" opacity=".9"/>')  # franja
out.append(f'<path d="{casco(0, H_CASCO)}" fill="none" stroke="#000" stroke-width="1"/>')
# defensa de goma perimetral
out.append(f'<path d="{casco()}" fill="#15191d" stroke="#050607" stroke-width="9" stroke-linejoin="round"/>')
out.append(f'<path d="{casco()}" fill="none" stroke="#3a4148" stroke-width="2" stroke-linejoin="round" transform="translate(0,-2)"/>')
# regala roja + cubierta
out.append(f'<path d="{casco(0, 0, .985, .97)}" fill="#b3202c"/>')
out.append(f'<path d="{casco(-3, 1, .93, .86)}" fill="url(#tg-cubierta)"/>')
# enjaretado / líneas de cubierta
out.append('<g stroke="#ffffff" stroke-opacity=".06" stroke-width="1">' + "".join(f'<path d="M{x},-50V50"/>' for x in range(-128, 110, 14)) + '</g>')
# bitas de popa y proa
for (x, y) in [(-128, -34), (-128, 34), (-112, -44), (-112, 44), (118, -30), (118, 30)]:
    out.append(cilindro(x, y, 4.5, 0, 7, "#1d242a", "#9aa6b1"))
# gancho / rodillo de popa
out.append(caja(-146, -16, -136, 16, 0, 6, "#c9d2da", "#6c7884", "#8995a1"))
# chigre de proa (tambor)
out.append(caja(84, -26, 110, 26, 0, 8, "#56636f", "#2a333b", "#3b4650"))
out.append(f'<rect x="{88 + KX*8:.1f}" y="{-20 - KY*8:.1f}" width="18" height="40" rx="5" fill="url(#tg-tambor)"/>')
out.append(f'<path d="M{97 + KX*8:.1f},{-20 - KY*8:.1f}v40" stroke="#4b5560" stroke-width="1"/>')
# cabo de remolque enrollado hacia la proa
out.append(f'<path d="M{106+KX*8:.1f},-8 C130,-8 140,-4 158,0" fill="none" stroke="#f1f5f8" stroke-width="2.4" stroke-dasharray="4 2"/>')

# superestructura nivel 1 (caseta)
Z1 = 22
out.append('<rect x="-70" y="-40" width="128" height="92" rx="6" fill="#000" opacity=".45" filter="url(#tg-ao)" transform="translate(6 6)"/>')
out.append(caja(-72, -44, 50, 44, 0, Z1, "url(#tg-blanco)", "#b5c0ca", "#cfd8e0"))
# portillos en la cara sur
for x in range(-60, 44, 16):
    out.append(f'<circle cx="{x + KX * 11:.1f}" cy="{44 - KY*11:.1f}" r="3.1" fill="#16324d" stroke="#8795a2" stroke-width=".8"/>')
# balsas salvavidas (cilindros blancos acostados) sobre nivel 1, popa
for y in (-30, 30):
    x0, y0 = -62 + KX * Z1, y - KY * Z1
    out.append(f'<rect x="{x0:.1f}" y="{y0 - 6:.1f}" width="20" height="12" rx="6" fill="#f4f6f8" stroke="#9aa6b1" stroke-width=".8"/>')
    out.append(f'<path d="M{x0 + 6:.1f},{y0 - 6:.1f}v12M{x0 + 14:.1f},{y0 - 6:.1f}v12" stroke="#e2313f" stroke-width="1.4"/>')
# chimeneas (dos, costado a costado, a popa del puente)
for y in (-26, 26):
    out.append(cilindro(-44, y, 8, Z1, 24, "url(#tg-chimenea)", "#1a1a1a", "#c9a24c"))
    cx, cy = -44 + KX * (Z1 + 24), y - KY * (Z1 + 24)
    out.append(f'<ellipse class="tg-humo" cx="{cx:.1f}" cy="{cy:.1f}" rx="5" ry="3" fill="#cfd8e0" opacity="0"/>')

# puente de gobierno (nivel 2) con ventanas corridas
Z2 = 20
bx1, by1, bx2, by2 = -26, -36, 44, 36
out.append(f'<rect x="{bx1 + KX*Z1 + 4:.1f}" y="{by1 - KY*Z1 + 4:.1f}" width="{bx2-bx1:.1f}" height="{by2-by1:.1f}" rx="3" fill="#2b3a48" opacity=".35" filter="url(#tg-ao)"/>')
out.append(caja(bx1, by1, bx2, by2, Z1, Z2, "#eef2f5", "#aeb9c3", "#c7d1da"))
# banda de ventanas en cara sur y oeste
zb, zt = Z1 + 7, Z1 + 16
out.append(f'<polygon points="{P(bx1+3,by2,zb)} {P(bx2-3,by2,zb)} {P(bx2-3,by2,zt)} {P(bx1+3,by2,zt)}" fill="url(#tg-cristal)"/>')
out.append(f'<polygon points="{P(bx1,by1+3,zb)} {P(bx1,by2-3,zb)} {P(bx1,by2-3,zt)} {P(bx1,by1+3,zt)}" fill="url(#tg-cristal)" opacity=".9"/>')
for x in range(bx1 + 12, bx2 - 2, 11):
    out.append(f'<path d="M{x + KX*zb:.1f},{by2 - KY*zb:.1f} L{x + KX*zt:.1f},{by2 - KY*zt:.1f}" stroke="#dfe7ee" stroke-width="1.4"/>')
# visera del techo
ZT = Z1 + Z2
out.append(f'<path d="M{P(bx1-3,by1-3,ZT)} L{P(bx2+4,by1-3,ZT)} L{P(bx2+4,by2+3,ZT)} L{P(bx1-3,by2+3,ZT)} Z" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".45"/>')
# mástil + plataforma de radar
out.append(caja(2, -8, 16, 8, ZT, 5, "#e9eef2", "#9aa6b1", "#b9c3cc"))
rx, ry = 9 + KX * (ZT + 9), -KY * (ZT + 9)
out.append(f'<g class="tg-radar" style="transform-origin:{rx:.1f}px {ry:.1f}px"><rect x="{rx - 20:.1f}" y="{ry - 2.2:.1f}" width="40" height="4.4" rx="2.2" fill="#f6f8fa" stroke="#6c7884" stroke-width=".8"/></g>')
out.append(f'<circle cx="{rx:.1f}" cy="{ry:.1f}" r="2.6" fill="#6c7884"/>')
# proyectores en el techo, proa
for y in (-24, 24):
    out.append(cilindro(38, y, 3.5, ZT, 4, "#3a444d", "#fdf6d8"))
# luces de navegación: babor roja (-y), estribor verde (+y), tope blanca
lx = 30 + KX * (Z1 + 12)
out.append(f'<circle class="tg-nav" cx="{lx:.1f}" cy="{-40 - KY*(Z1 + 12):.1f}" r="11" fill="url(#tg-luzR)"/><circle cx="{lx:.1f}" cy="{-40 - KY*(Z1 + 12):.1f}" r="2.2" fill="#ff5a64"/>')
out.append(f'<circle class="tg-nav" cx="{lx:.1f}" cy="{40 - KY*(Z1 + 12):.1f}" r="11" fill="url(#tg-luzV)"/><circle cx="{lx:.1f}" cy="{40 - KY*(Z1 + 12):.1f}" r="2.2" fill="#48f09a"/>')
out.append(f'<circle class="tg-tope" cx="{rx:.1f}" cy="{ry - 8:.1f}" r="9" fill="url(#tg-luzB)"/>')

svg = "\n".join(out)
open(r"C:/Users/anton/AppData/Local/Temp/claude/C--Users-anton-OneDrive-Desktop-code/543a3359-2087-4a82-a26a-50fde9a37704/scratchpad/remolcador.svgfrag", "w", encoding="utf-8").write(svg)
# vista previa aislada
prev = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-340 -140 580 260" width="1160" height="520" style="background:#0a2440">{svg}</svg>'
open(r"C:/Users/anton/AppData/Local/Temp/claude/C--Users-anton-OneDrive-Desktop-code/543a3359-2087-4a82-a26a-50fde9a37704/scratchpad/remolcador.svg", "w", encoding="utf-8").write(prev)
print(len(svg))
