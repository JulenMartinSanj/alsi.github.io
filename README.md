# Simulador de monitor (Alsi)

Herramienta de simulación para formación. No es un dispositivo médico.

- `index.html` – menú de inicio
- `monitor.html` – monitor (tablet/portátil). Muestra un QR para enlazar al instructor.
- `instructor.html` – mando del instructor (móvil)

Funciona 100 % en el navegador (sin servidor propio): monitor e instructor se enlazan
por WebRTC mediante PeerJS. Ambos dispositivos necesitan conexión a internet, pero
NO tienen que estar en la misma red Wi-Fi.

## Publicar en GitHub Pages
1. Crea un repositorio llamado `<tu-usuario>.github.io` (p. ej. `alsi.github.io`).
2. Sube TODO el contenido de esta carpeta a la rama `main` (en la raíz).
3. Settings → Pages → Source: "Deploy from a branch" → `main` / `(root)`.
4. En 1-2 minutos estará en `https://<tu-usuario>.github.io/`.
