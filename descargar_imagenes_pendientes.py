"""
Descarga a la carpeta img/ las imágenes que aún se cargan desde la web antigua
(https://www.paulaguerrachamorro.com/wp-content/uploads/...) y actualiza los
archivos .html y .css para que usen la copia local.

Uso (desde la carpeta del proyecto):
    python descargar_imagenes_pendientes.py

Solo usa la librería estándar de Python. Se puede ejecutar varias veces:
solo vuelve a intentar lo que falta.
"""
import re, sys, time, urllib.request
from pathlib import Path

RAIZ = Path(__file__).parent
PAT = r'https?://(?:www\.)?paulaguerrachamorro\.com/wp-content/uploads/([^"\')\s?]+)'

archivos = list(RAIZ.glob('*.html')) + list((RAIZ / 'css').glob('*.css'))
pendientes = {}
for f in archivos:
    txt = f.read_text(encoding='utf-8')
    # solo src="..." y url(...); no toca <meta og:image> ni JSON-LD
    for m in re.finditer(r'(?:src="|url\(["\']?)' + PAT, txt):
        pendientes[m.group(1)] = True

print(f'{len(pendientes)} imágenes por descargar\n')
ok, fallos = set(), []
for i, rel in enumerate(pendientes, 1):
    destino = RAIZ / 'img' / rel
    destino.parent.mkdir(parents=True, exist_ok=True)
    if destino.exists():
        ok.add(rel); continue
    url = 'https://www.paulaguerrachamorro.com/wp-content/uploads/' + rel
    for intento in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=60) as r:
                destino.write_bytes(r.read())
            print(f'[{i}/{len(pendientes)}] OK     {rel}'); ok.add(rel); break
        except Exception as e:
            if intento == 2:
                print(f'[{i}/{len(pendientes)}] ERROR  {rel} ({e})'); fallos.append(rel)
            else:
                time.sleep(3)

# reescribir referencias solo de lo que sí se descargó
for f in archivos:
    txt = f.read_text(encoding='utf-8')
    prefijo = '../img/' if f.suffix == '.css' else 'img/'
    def cambia(m):
        return m.group(1) + prefijo + m.group(2) if m.group(2) in ok else m.group(0)
    nuevo = re.sub(r'((?:src="|url\(["\']?))' + PAT, cambia, txt)
    if nuevo != txt:
        f.write_text(nuevo, encoding='utf-8')

print(f'\nListo: {len(ok)} correctas, {len(fallos)} con error.')
if fallos: print('Vuelve a ejecutar el script para reintentar las que fallaron.')
