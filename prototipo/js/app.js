// Rayo de Luz · prototipo visual. Datos de ejemplo; el backend real los reemplaza.
const PRECIO_CENTAVOS = 100;   // provisional: $1.00 por boleto (lo define la cliente, por sorteo)
const MAX_BOLETOS = 1000;
const CODIGO_SORTEO = "01";

// ---------- Datos que el panel (CMS) administrará ----------
// Slides del carrusel del inicio: agregar, editar, ordenar y activar desde el panel.
const SLIDES = [
  {
    titulo: "Todos necesitamos un rayo de luz.",
    texto: "Adquiere una pieza de arte digital y forma parte de una oportunidad que podría transformar tu hogar, tus planes o tu futuro.",
    boton: "Compra para participar", enlace: "sorteo.html", posicion: "50% 40%",
  },
  {
    titulo: "Un Rayo Nuestro",
    texto: "Participa por un sistema solar o $50,000 en efectivo. Un arte nuevo cada mes.",
    boton: "Ver el sorteo", enlace: "sorteo.html", posicion: "15% 60%", imagen: "img/obra.jpeg",
  },
  {
    titulo: "Un arte nuevo cada mes.",
    texto: "Cada obra es un sorteo. Mira lo que viene y acompáñanos en vivo.",
    boton: "Ver todos los sorteos", enlace: "sorteos.html", posicion: "90% 30%",
  },
];

// Sorteos: uno por mes. El cierre es por fecha o por boletos vendidos.
const SORTEOS = [
  {
    slug: "un-rayo-nuestro", estado: "activo", mes: "diciembre",
    titulo: "Un Rayo Nuestro", premio: "Sistema solar o $50,000 en efectivo",
    resumen: "El San Pedrito, frente a nuestra bandera, representa la esencia de Puerto Rico: pequeña en tamaño, inmensa en fuerza.",
    premios: [
      ["1er premio", "Sistema solar o $50,000 en efectivo"],
      ["2do premio", "$10,000 en efectivo"],
      ["3er premio", "$5,000 en efectivo"],
    ],
    imagen: "img/obra.jpeg", vendidos: 3420, capacidad: 15000,
    inicio: "2026-10-22T09:00:00-04:00",
    cierre: { modo: "fecha", fecha: "2026-12-22T20:00:00-04:00" },   // ejemplo: en 2 meses
    // Otro modo posible: cierre: { modo: "boletos" }  (cierra al vender todos los boletos)
  },
  { slug: "proximo", estado: "proximo", mes: "enero", titulo: "Próximo arte", premio: "Lo anunciamos muy pronto" },
];
// Galería de la obra del sorteo. Con una sola imagen se muestran el arte completo y dos detalles;
// el panel permitirá subir todas las imágenes que se quieran.
const GALERIA = [
  { src: "img/obra.jpeg", alt: "Un Rayo Nuestro: el San Pedrito sobre una rama, frente a la bandera de Puerto Rico", fit: "contain" },
  { src: "img/familia-solar.jpg", alt: "Una pareja mira su casa con el sistema solar instalado: paneles en el techo y baterías en la pared" },
  { src: "img/dolares-maletin.jpg", alt: "Maletín plateado con billetes de cien dólares", fit: "contain", mezcla: true },
];
const ACTIVO = SORTEOS.find((s) => s.estado === "activo");

const dinero = (c) => (c / 100).toLocaleString("es-PR", { style: "currency", currency: "USD" });
const miles = (n) => n.toLocaleString("es-PR");
const fecha = (iso) => new Date(iso).toLocaleDateString("es-PR", { day: "numeric", month: "short", year: "numeric" });
const codigo = (n) => `RDL-${CODIGO_SORTEO}-${String(n).padStart(5, "0")}`;
const pct = (s) => Math.round((s.vendidos / s.capacidad) * 100);
const quedan = (s) => s.capacidad - s.vendidos;
const diaSiguiente = (iso) => new Date(new Date(iso).getTime() + 86400000).toISOString();

const iconos = {
  inicio: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  sorteos: '<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3zM14 6v12" stroke-dasharray="2 3"/>',
  ganadores: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
  rayo: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  mas: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  calendario: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  bandera: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  vivo: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M10 9l5 2.5-5 2.5z"/>',
  izquierda: '<path d="M15 5l-7 7 7 7"/>',
  derecha: '<path d="M9 5l7 7-7 7"/>',
};
const svg = (k, fill = "none") =>
  `<svg viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconos[k]}</svg>`;

const MENU = [
  ["index.html", "inicio", "Inicio"],
  ["sorteo.html", "sorteo", "Compra & Participa"],
  ["historia.html", "historia", "Nuestra Historia"],
  ["premios.html", "premios", "Premios"],
  ["preguntas.html", "preguntas", "Preguntas"],
  ["sorteos.html", "sorteos", "Sorteos"],
  ["ganadores.html", "ganadores", "Ganadores"],
];

// Redes sociales del footer. Los enlaces son las portadas genéricas que usa hoy la web de la cliente:
// reemplazar por los perfiles reales cuando se confirmen.
const REDES = [
  ["Facebook", "https://www.facebook.com/", '<path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>'],
  ["Instagram", "https://www.instagram.com/", '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/>'],
  ["YouTube", "https://www.youtube.com/", '<path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>'],
  ["X", "https://www.x.com/", '<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'],
  ["LinkedIn", "https://www.linkedin.com/", '<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'],
  ["TikTok", "https://www.tiktok.com/", '<path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'],
];
const redesHTML = () => `<p class="pie-redes">${REDES.map(([n, u, p]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}"><svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg></a>`).join("")}</p>`;

function montarMarco() {
  const pagina = document.body.dataset.pagina;
  const sinBarra = document.body.classList.contains("sin-barra");

  const enlaces = () => MENU.map(([href, id, texto]) =>
    `<a href="${href}" ${id === pagina ? 'aria-current="page"' : ""}>${texto}</a>`).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="cabecera">
      <a class="marca" href="index.html" aria-label="Rayo de Luz, inicio"><img src="img/logo-recortado.png" alt="Rayo de Luz" width="119" height="40"></a>
      <nav class="nav-principal" aria-label="Menú principal">${enlaces()}</nav>
      <div class="acciones-cabecera">
        <a class="boton" href="sorteo.html">Participar</a>
        <button class="menu-boton" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </header>
    <div class="menu-panel" id="menu-panel" role="dialog" aria-modal="true" aria-label="Menú" hidden>
      <div class="menu-cima">
        <span>Menú</span>
        <button class="menu-cerrar" type="button" aria-label="Cerrar menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
        </button>
      </div>
      <nav class="menu-enlaces" aria-label="Menú">${enlaces()}</nav>
      <a class="boton sol ancho" href="sorteo.html">Compra para participar</a>
    </div>`);

  const boton = document.querySelector(".menu-boton");
  const panel = document.getElementById("menu-panel");
  const abrir = (si) => {
    panel.hidden = !si;
    boton.setAttribute("aria-expanded", String(si));
    document.body.style.overflow = si ? "hidden" : "";
    (si ? panel.querySelector(".menu-cerrar") : boton).focus();
  };
  boton.addEventListener("click", () => abrir(true));
  panel.querySelector(".menu-cerrar").addEventListener("click", () => abrir(false));
  panel.addEventListener("click", (e) => { if (e.target.closest(".menu-enlaces a")) abrir(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) abrir(false); });

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="pie">
      <div class="pie-fila">
        <div>
          <p class="pie-titulo">Contacto</p>
          <p><a href="mailto:info@rayodeluzpr.com">info@rayodeluzpr.com</a><br>Dorado, Puerto Rico</p>
          ${redesHTML()}
        </div>
        <div>
          <p class="pie-titulo">Rayo de Luz</p>
          <p>Cada campaña opera bajo términos y condiciones publicados. Sorteos transmitidos en vivo y supervisados por notario público. Publicamos cada acta oficial.</p>
        </div>
      </div>
      <p class="pie-enlaces"><a href="preguntas.html">Preguntas</a> · <a href="historia.html">Nuestra historia</a> · <a href="ganadores.html">Ganadores</a></p>
      <p class="pie-enlaces"><a href="reglas.html">Reglas oficiales</a> · <a href="terminos.html">Términos y condiciones</a> · <a href="privacidad.html">Privacidad</a></p>
      <p class="pie-marca">Rayo de Luz</p>
      <p class="pie-aviso">Prototipo visual: precios, fechas y avances son de ejemplo.</p>
      <p class="pie-credito"><a href="https://www.erickhernandezarias.net/" target="_blank" rel="noopener">Diseño y desarrollo — Erick Hernández Arias</a></p>
    </footer>`);

  if (sinBarra) return;
  const tab = (href, id, etiqueta, icono = id, central = false) => `
    <a href="${href}" class="${central ? "central" : ""}" ${pagina === id ? 'aria-current="page"' : ""}>
      ${central ? `<span class="disco">${svg("rayo", "currentColor")}</span>` : svg(icono)}
      <span>${etiqueta}</span>
    </a>`;
  document.body.insertAdjacentHTML("beforeend", `
    <nav class="tabs" aria-label="Navegación principal">
      ${tab("index.html", "inicio", "Inicio")}
      ${tab("sorteos.html", "sorteos", "Sorteos")}
      ${tab("sorteo.html", "sorteo", "Participar", "rayo", true)}
      ${tab("ganadores.html", "ganadores", "Ganadores")}
      ${tab("mas.html", "mas", "Más")}
    </nav>`);
}

// ---------- Carrusel del inicio ----------
function pintarSlider() {
  const raiz = document.querySelector("[data-slider]");
  if (!raiz) return;
  raiz.setAttribute("role", "region");
  raiz.setAttribute("aria-roledescription", "carrusel");
  raiz.setAttribute("aria-label", "Destacados");
  raiz.innerHTML = `
    <div class="slider-pista" tabindex="0">
      ${SLIDES.map((s, i) => `
        <article class="slide ${s.imagen ? "con-imagen" : ""}" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${SLIDES.length}"
                 style="background-position:${s.posicion || "50% 40%"}">
          <div class="slide-contenido">
            ${s.imagen ? `<img class="slide-obra" src="${s.imagen}" alt="" width="200" height="300">` : ""}
            <h1>${s.titulo}</h1>
            <p>${s.texto}</p>
            <a class="boton sol" href="${s.enlace}">${s.boton}</a>
          </div>
        </article>`).join("")}
    </div>
    <button class="slider-flecha anterior" type="button" aria-label="Diapositiva anterior">${svg("izquierda")}</button>
    <button class="slider-flecha siguiente" type="button" aria-label="Diapositiva siguiente">${svg("derecha")}</button>
    <div class="slider-puntos" role="tablist" aria-label="Elegir diapositiva">
      ${SLIDES.map((_, i) => `<button type="button" role="tab" aria-label="Diapositiva ${i + 1}" aria-selected="${i === 0}"></button>`).join("")}
    </div>`;

  const pista = raiz.querySelector(".slider-pista");
  const puntos = [...raiz.querySelectorAll(".slider-puntos button")];
  let actual = 0;
  const ir = (i) => {
    actual = (i + SLIDES.length) % SLIDES.length;
    pista.scrollTo({ left: actual * pista.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  pista.addEventListener("scroll", () => {
    const i = Math.round(pista.scrollLeft / pista.clientWidth);
    actual = i;
    puntos.forEach((p, k) => p.setAttribute("aria-selected", String(k === i)));
  }, { passive: true });

  // Avance automático: se detiene al tocar, pasar el cursor o enfocar; respeta "reducir movimiento".
  let reloj = null;
  const parar = () => { clearInterval(reloj); reloj = null; };
  const iniciar = () => {
    if (reloj || matchMedia("(prefers-reduced-motion: reduce)").matches || SLIDES.length < 2) return;
    reloj = setInterval(() => ir(actual + 1), 6500);
  };
  raiz.querySelector(".anterior").addEventListener("click", () => { parar(); ir(actual - 1); });
  raiz.querySelector(".siguiente").addEventListener("click", () => { parar(); ir(actual + 1); });
  puntos.forEach((p, i) => p.addEventListener("click", () => { parar(); ir(i); }));
  pista.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { parar(); ir(actual + 1); }
    if (e.key === "ArrowLeft") { parar(); ir(actual - 1); }
  });
  ["pointerdown", "mouseenter", "focusin"].forEach((ev) => raiz.addEventListener(ev, parar));
  raiz.addEventListener("mouseleave", iniciar);
  iniciar();
}

// ---------- Galería del detalle (patrón de Don Rifa: imagen grande, flechas y miniaturas) ----------
function pintarGaleria() {
  const raiz = document.querySelector("[data-galeria]");
  if (!raiz) return;
  const imagen = (g, extra = "") => `<img src="${g.src}" alt="${extra ? "" : g.alt}" ${g.mezcla ? 'class="mezcla"' : ""} ${g.zoom ? `style="transform:scale(${g.zoom});transform-origin:${g.origen}"` : ""}>`;
  raiz.innerHTML = `
    <div class="galeria-pista" tabindex="0">
      ${GALERIA.map((g, i) => `<div class="galeria-slide" role="group" aria-roledescription="imagen" aria-label="${i + 1} de ${GALERIA.length}">${imagen(g)}</div>`).join("")}
    </div>
    <button class="galeria-flecha anterior" type="button" aria-label="Imagen anterior">${svg("izquierda")}</button>
    <button class="galeria-flecha siguiente" type="button" aria-label="Imagen siguiente">${svg("derecha")}</button>
    <div class="galeria-minis" role="tablist" aria-label="Elegir imagen">
      ${GALERIA.map((g, i) => `<button type="button" role="tab" aria-label="Imagen ${i + 1}" aria-selected="${i === 0}">${imagen(g, "mini")}</button>`).join("")}
    </div>`;
  const pista = raiz.querySelector(".galeria-pista");
  const minis = [...raiz.querySelectorAll(".galeria-minis button")];
  let actual = 0;
  const ir = (i) => {
    actual = (i + GALERIA.length) % GALERIA.length;
    pista.scrollTo({ left: actual * pista.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  pista.addEventListener("scroll", () => {
    actual = Math.round(pista.scrollLeft / pista.clientWidth);
    minis.forEach((m, k) => m.setAttribute("aria-selected", String(k === actual)));
  }, { passive: true });
  raiz.querySelector(".anterior").addEventListener("click", () => ir(actual - 1));
  raiz.querySelector(".siguiente").addEventListener("click", () => ir(actual + 1));
  minis.forEach((m, i) => m.addEventListener("click", () => ir(i)));
  pista.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") ir(actual + 1);
    if (e.key === "ArrowLeft") ir(actual - 1);
  });
}

// ---------- Cierre del sorteo: por fecha o por boletos ----------
function cierreHTML(s, clase = "") {
  if (s.cierre.modo === "fecha") {
    return `<div class="cuenta ${clase}" data-cuenta-regresiva="${s.cierre.fecha}" aria-label="Tiempo que falta para el sorteo"></div>`;
  }
  return `<div class="cierre-boletos ${clase}"><b>${miles(quedan(s))}</b><span>boletos para cerrar el sorteo</span></div>`;
}
const textoCierre = (s) => s.cierre.modo === "fecha"
  ? `Cierra el ${fecha(s.cierre.fecha)}`
  : `Cierra al vender los ${miles(s.capacidad)} boletos`;

// ---------- Tarjetas, avance e información del sorteo ----------
function bloqueAvance(s) {
  const p = pct(s);
  return `
    <div class="avance">
      <div class="barra-fila">
        <div class="pista" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="Boletos vendidos"><div class="relleno" data-ancho="${p}"></div></div>
        <strong>${p}%</strong>
      </div>
      <small>${miles(quedan(s))} boletos disponibles</small>
    </div>`;
}

function bloqueAvanceDetalle(s) {
  const p = pct(s);
  return `
    <div class="premio-fila">
      <div><small>Premio mayor</small><strong>${s.premios[0][1]}</strong></div>
      <b>${p}%</b>
    </div>
    <div class="avance">
      <div class="pista" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="Boletos vendidos"><div class="relleno" data-ancho="${p}"></div></div>
      <small>${miles(quedan(s))} boletos disponibles de ${miles(s.capacidad)}</small>
    </div>`;
}

function tarjeta(s) {
  if (s.estado === "proximo") {
    return `
      <article class="tarjeta-sorteo proximo">
        <div class="foto" role="img" aria-label="Espacio para el arte de ${s.mes}"></div>
        <div class="cuerpo">
          <p class="etiqueta-compra">Sorteo de ${s.mes}</p>
          <h3>${s.titulo}</h3>
          <p class="premio-linea">${s.premio}. Un arte nuevo cada mes.</p>
        </div>
      </article>`;
  }
  return `
    <a class="tarjeta-sorteo" href="sorteo.html">
      <div class="foto" style="background-image:url('${s.imagen}')" role="img" aria-label="${s.titulo}"></div>
      <div class="cuerpo">
        <p class="etiqueta-compra">Compra arte digital y participa</p>
        <h3>${s.titulo}</h3>
        <p class="premio-linea">${s.premio}</p>
        ${bloqueAvance(s)}
        ${cierreHTML(s)}
      </div>
    </a>`;
}

function pintarTarjetas() {
  document.querySelectorAll("[data-tarjetas]").forEach((c) => {
    const solo = c.dataset.tarjetas;
    c.innerHTML = SORTEOS.filter((s) => !solo || s.estado === solo).map(tarjeta).join("");
  });
}

// Columna de información junto a la tarjeta: título, texto y botón "Ver más"
function pintarInfoSorteo() {
  const c = document.querySelector("[data-sorteo-info]");
  if (!c) return;
  const s = ACTIVO;
  c.innerHTML = `
    <h3>${s.titulo}</h3>
    <p>${s.resumen}</p>
    <ul class="premios-mini">
      ${s.premios.map(([lugar, texto]) => `<li><b>${lugar}</b><span>${texto}</span></li>`).join("")}
    </ul>
    <p class="cierre-linea">${svg("calendario")}<span>${textoCierre(s)}</span></p>
    <a class="boton" href="sorteo.html">Ver más</a>`;
}

function animarAvance() {
  requestAnimationFrame(() => document.querySelectorAll("[data-ancho]").forEach((e) => (e.style.width = `${e.dataset.ancho}%`)));
}

// ---------- Cuenta regresiva ----------
function iniciarCuentas() {
  const cuentas = document.querySelectorAll("[data-cuenta-regresiva]");
  if (!cuentas.length) return;
  const celdas = (d, h, m, s) => [[d, "días"], [h, "hrs"], [m, "min"], [s, "seg"]]
    .map(([v, e]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${e}</span></div>`).join("");
  const tic = () => {
    cuentas.forEach((c) => {
      const falta = Math.max(0, new Date(c.dataset.cuentaRegresiva) - Date.now());
      const t = Math.floor(falta / 1000);
      c.innerHTML = celdas(Math.floor(t / 86400), Math.floor((t % 86400) / 3600), Math.floor((t % 3600) / 60), t % 60);
    });
  };
  tic();
  setInterval(tic, 1000);
}

// ---------- Detalle del sorteo ----------
function pintarDetalle() {
  const raiz = document.querySelector("[data-sorteo]");
  if (!raiz) return;
  const s = ACTIVO;
  const porFecha = s.cierre.modo === "fecha";

  raiz.querySelector("[data-cierre-titulo]").textContent = porFecha ? "Falta para el sorteo en vivo" : "Boletos para cerrar el sorteo";
  raiz.querySelector("[data-cierre-slot]").innerHTML = cierreHTML(s, "barra");

  const paso = (icono, titulo, valor, activo = false) =>
    `<li ${activo ? 'class="activo"' : ""}><span class="punto">${svg(icono)}</span><b>${titulo}</b><span>${valor}</span></li>`;
  raiz.querySelector("[data-linea-tiempo]").innerHTML =
    paso("calendario", "Venta abierta", fecha(s.inicio), true) +
    paso("bandera", "Cierra la venta", porFecha ? fecha(s.cierre.fecha) : "Al agotar boletos") +
    paso("vivo", "Sorteo en vivo", porFecha ? fecha(diaSiguiente(s.cierre.fecha)) : "Se anuncia al cerrar");

  const avance = raiz.querySelector("[data-avance-detalle]");
  if (avance) avance.innerHTML = bloqueAvanceDetalle(s);
}

// ---------- Detalle del sorteo: paquetes, cantidad y pestañas ----------
function iniciarSorteo() {
  const raiz = document.querySelector("[data-sorteo]");
  if (!raiz) return;
  const campo = raiz.querySelector("#cantidad");
  const error = raiz.querySelector("[data-error]");
  const totales = document.querySelectorAll("[data-total]");
  const resumenes = document.querySelectorAll("[data-resumen]");
  const botones = document.querySelectorAll("[data-continuar]");
  const paquetes = raiz.querySelectorAll("[data-paquete]");
  const leer = () => parseInt(campo.value, 10);
  const valida = (n) => Number.isInteger(n) && n >= 1 && n <= MAX_BOLETOS;

  function pintar() {
    const n = leer();
    const ok = valida(n);
    error.textContent = ok ? "" : `Elige entre 1 y ${miles(MAX_BOLETOS)} boletos.`;
    totales.forEach((t) => (t.textContent = ok ? dinero(n * PRECIO_CENTAVOS) : "—"));
    resumenes.forEach((r) => (r.textContent = ok ? `${miles(n)} ${n === 1 ? "boleto" : "boletos"}` : "Cantidad no válida"));
    botones.forEach((b) => (b.disabled = !ok));
    paquetes.forEach((p) => p.setAttribute("aria-pressed", String(ok && Number(p.dataset.paquete) === n)));
  }
  const poner = (n) => { campo.value = Math.min(MAX_BOLETOS, Math.max(1, n)); pintar(); };

  paquetes.forEach((p) => {
    const n = Number(p.dataset.paquete);
    p.querySelector("span").textContent = dinero(n * PRECIO_CENTAVOS);
    p.querySelector("small").textContent = `(${miles(n)} ${n === 1 ? "boleto" : "boletos"})`;
    p.addEventListener("click", () => poner(n));
  });
  raiz.querySelectorAll("[data-precio]").forEach((e) => (e.textContent = dinero(PRECIO_CENTAVOS)));
  raiz.querySelector("[data-menos]").addEventListener("click", () => poner((leer() || 1) - 1));
  raiz.querySelector("[data-mas]").addEventListener("click", () => poner((leer() || 0) + 1));
  campo.addEventListener("input", pintar);
  botones.forEach((b) => b.addEventListener("click", () => valida(leer()) && (location.href = `comprar.html?c=${leer()}`)));

  // "Premios" desde el menú abre ese acordeón
  const abrirPremios = () => {
    if (location.hash !== "#premios") return;
    const d = document.getElementById("acc-premios");
    d.open = true;
    d.scrollIntoView({ block: "start" });
  };
  abrirPremios();
  window.addEventListener("hashchange", abrirPremios);

  // Compartir
  const compartir = raiz.querySelector("[data-compartir]");
  compartir?.addEventListener("click", async () => {
    const datos = { title: "Rayo de Luz: Un Rayo Nuestro", url: location.href };
    if (navigator.share) { try { await navigator.share(datos); } catch (_) {} return; }
    try { await navigator.clipboard.writeText(location.href); compartir.textContent = "Enlace copiado"; } catch (_) {}
  });
  pintar();
}

// ---------- Checkout ----------
function cantidadDeLaUrl(porDefecto) {
  const n = parseInt(new URLSearchParams(location.search).get("c"), 10);
  return Number.isInteger(n) ? Math.min(MAX_BOLETOS, Math.max(1, n)) : porDefecto;
}

function iniciarCompra() {
  const form = document.querySelector("[data-compra]");
  if (!form) return;
  const n = cantidadDeLaUrl(5);
  document.querySelector("[data-cant]").textContent = `${miles(n)} ${n === 1 ? "boleto" : "boletos"}`;
  document.querySelector("[data-unitario]").textContent = `${dinero(PRECIO_CENTAVOS)} por boleto`;
  document.querySelectorAll("[data-total]").forEach((t) => (t.textContent = dinero(n * PRECIO_CENTAVOS)));
  document.querySelector("[data-pagar]").addEventListener("click", () => form.requestSubmit());
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    location.href = `gracias.html?c=${n}`;
  });
}

// ---------- Gracias ----------
// Números únicos de demostración (el sistema real los toma del pool mezclado en la base de datos).
function numerosUnicos(n) {
  const usados = new Set();
  const buf = new Uint32Array(1);
  while (usados.size < n) {
    crypto.getRandomValues(buf);
    usados.add((buf[0] % ACTIVO.capacidad) + 1);
  }
  return [...usados];
}

function iniciarGracias() {
  const raiz = document.querySelector("[data-gracias]");
  if (!raiz) return;
  const n = cantidadDeLaUrl(3);
  const numeros = numerosUnicos(n);
  const lista = raiz.querySelector("[data-lista]");
  const boleto = (num) => `
    <article class="boleto sobre-noche">
      <div class="boleto-info"><b>${ACTIVO.titulo}</b><span>Sorteo de ${ACTIVO.mes}</span></div>
      <div class="boleto-num"><small>${codigo(num).slice(0, -5)}</small><strong>${String(num).padStart(5, "0")}</strong></div>
    </article>`;
  const MUESTRA = 5;
  const pintar = (todos) => (lista.innerHTML = (todos ? numeros : numeros.slice(0, MUESTRA)).map(boleto).join(""));
  pintar(false);

  raiz.querySelector("[data-cuenta]").textContent = n === 1 ? "1 boleto" : `${miles(n)} boletos`;
  raiz.querySelector("[data-total]").textContent = dinero(n * PRECIO_CENTAVOS);

  const mas = raiz.querySelector("[data-ver-todos]");
  if (n <= MUESTRA) mas.hidden = true;
  mas.textContent = `Ver los ${miles(n)} números`;
  mas.addEventListener("click", () => { pintar(true); mas.hidden = true; });

  raiz.querySelector("[data-csv]").addEventListener("click", () => {
    const filas = ["codigo", ...numeros.map(codigo)].join("\n");
    const url = URL.createObjectURL(new Blob([filas], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "mis-boletos-rayo-de-luz.csv" });
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ---------- Suscripción (Nuestra historia) ----------
// Demostración: valida y confirma en pantalla; no envía ni guarda nada.
function iniciarSuscripcion() {
  const form = document.querySelector("[data-suscripcion]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    form.querySelector("[data-suscripcion-ok]").hidden = false;
    form.reset();
  });
}

// ---------- Premios del inicio: las tarjetas aparecen al llegar a la vista ----------
// Sin JS o sin IntersectionObserver las tarjetas se ven siempre (solo se ocultan con .pr-anim).
function iniciarPremios() {
  const seccion = document.querySelector(".premios-ux");
  if (!seccion) return;
  const tarjetas = [...seccion.querySelectorAll(".pr-card")];
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  seccion.classList.add("pr-anim");
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add("visible"), i * 120);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  tarjetas.forEach((c) => io.observe(c));
}

montarMarco();
pintarSlider();
pintarGaleria();
pintarTarjetas();
pintarInfoSorteo();
pintarDetalle();
animarAvance();
iniciarCuentas();
iniciarSorteo();
iniciarCompra();
iniciarGracias();
iniciarSuscripcion();
iniciarPremios();
