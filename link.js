// Enlace monitor <-> instructor mediante relés MQTT públicos (WebSocket seguro).
// No usa WebRTC, así que funciona entre redes distintas, datos móviles, Wi-Fi de centros, etc.
// Se conecta a VARIOS brokers a la vez y deduplica mensajes: basta con que uno funcione.
const Link = (() => {
  const BROKERS = window.LINK_BROKERS || [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081/',
    'wss://mqtt.eclipseprojects.io:443/mqtt',
  ];
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  // role: 'monitor' | 'instructor'.  onMsg(m) recibe mensajes del otro lado.
  function open({ id, role, onMsg, onStatus }) {
    const me = uid(), mine = 'alsisim/' + id + '/' + (role === 'monitor' ? 'm' : 'i'),
          theirs = 'alsisim/' + id + '/' + (role === 'monitor' ? 'i' : 'm');
    const seen = new Set(), order = [];
    const clients = BROKERS.map(() => ({ c: null, up: false }));
    const report = () => onStatus && onStatus({ up: clients.filter(x => x.up).length, total: BROKERS.length });

    const dup = i => {
      if (seen.has(i)) return true;
      seen.add(i); order.push(i);
      if (order.length > 300) seen.delete(order.shift());
      return false;
    };
    const pack = o => JSON.stringify({ ...o, i: uid(), f: me });

    BROKERS.forEach((url, n) => {
      const opts = { clientId: 'alsi_' + me + '_' + n, clean: true, keepalive: 15,
                     reconnectPeriod: 3000, connectTimeout: 8000 };
      if (role === 'instructor') opts.will = { topic: mine, payload: pack({ t: 'bye' }), qos: 0 };
      let c;
      try { c = mqtt.connect(url, opts); } catch (e) { return; }
      clients[n].c = c;
      c.on('connect', () => {
        clients[n].up = true; report();
        c.subscribe(theirs, { qos: 0 });
        if (role === 'instructor') c.publish(mine, pack({ t: 'hello' }));
      });
      const down = () => { clients[n].up = false; report(); };
      c.on('close', down); c.on('offline', down); c.on('error', () => {});
      c.on('message', (_, buf) => {
        let m; try { m = JSON.parse(buf.toString()); } catch (e) { return; }
        if (!m || typeof m !== 'object' || m.f === me || dup(m.i)) return;
        onMsg(m);
      });
    });

    return {
      send(o) {
        const p = pack(o);
        clients.forEach(x => { if (x.up) try { x.c.publish(mine, p); } catch (e) {} });
      },
      stats: () => ({ up: clients.filter(x => x.up).length, total: BROKERS.length }),
    };
  }
  return { open };
})();
