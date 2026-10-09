# Simulador de monitor (Alsi)

Herramienta de simulación para formación. No es un dispositivo médico.

- `index.html` – menú de inicio
- `monitor.html` – monitor (tablet/portátil). Muestra un QR para enlazar al instructor.
- `instructor.html` – mando del instructor (móvil)
- `link.js` + `mqtt.min.js` – capa de enlace

Funciona 100 % en el navegador (sin servidor propio). Monitor e instructor se comunican a
través de brokers MQTT públicos por WebSocket seguro (conectan a 4 a la vez; basta con que
uno funcione). No hace falta que estén en la misma red, ni WebRTC: sirve Wi-Fi distinta,
datos móviles, redes de centros, etc. Ambos equipos necesitan internet.

Los mensajes viajan por un tema con un código aleatorio (el del QR). Los brokers son públicos:
no uses esto para nada confidencial (aquí solo viajan valores de simulación).

## Publicar en GitHub Pages
1. Crea un repositorio `<tu-usuario>.github.io`.
2. Sube TODO el contenido de esta carpeta a la rama `main` (en la raíz).
3. Settings → Pages → Deploy from a branch → `main` / `(root)`.
4. Abre `https://<tu-usuario>.github.io/` (necesita HTTPS, GitHub Pages ya lo da).

## Si no enlaza
- Monitor: pulsa Q; debe poner "Servicio de enlace: conectado (n/4)". Si pone 0, ese equipo
  no tiene salida a los brokers (firewall) → prueba con otra red/datos móviles.
- Instructor: el texto de estado indica si falla el servicio o si no encuentra el monitor.
- Tecla N en el monitor: genera un código nuevo.
