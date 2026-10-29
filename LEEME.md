# paulaguerrachamorro.com – versión en código (HTML/CSS/JS)

Sitio estático, sin WordPress, sin plugins y sin base de datos.

## Cómo verlo en VS Code
1. Abre esta carpeta con **Archivo → Abrir carpeta**.
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho sobre `index.html` → **Open with Live Server**.

(También funciona haciendo doble clic en `index.html`.)

## Estructura
```
index.html      Inicio
galeria.html    Galería
blog.html       Blog
css/            index.css, galeria.css, blog.css (diseño original) + publicaciones.css (cards nuevas) + fonts.css
js/main.js      menú móvil, botón de WhatsApp y animaciones de entrada
fonts/          Poppins, Playfair Display y Cormorant Garamond (autoalojadas, sin Google Fonts)
img/            imágenes (misma estructura de carpetas que wp-content/uploads)
descargar_imagenes_pendientes.py
```

## Pendiente: 17 imágenes
Las imágenes de las secciones Colaboraciones, Talleres, Workshops y el fondo de
"Mis Exposiciones" todavía se cargan desde la web antigua. Para dejarlas en local,
con conexión a internet y desde esta carpeta:

    python descargar_imagenes_pendientes.py

(Si no funciona `python`, usa `py`.) Se puede repetir las veces que haga falta.
Hazlo antes de apagar o cambiar la web de WordPress.

## Notas
- Los CSS son los estilos originales del sitio, para garantizar el mismo diseño.
  En una segunda fase se pueden ordenar y reducir.
- Las cards de "Mis Publicaciones" son nuevas: su código está en `css/publicaciones.css`
  y en la sección `.pub-grid` de `index.html`.
- El botón de WhatsApp abre el chat con el número +34 628 044 032.
- `canonical`, `og:url` y `og:image` apuntan a https://www.paulaguerrachamorro.com/.
  Si cambian de dominio, hay que actualizarlos en el `<head>` de cada página.
