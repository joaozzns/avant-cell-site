/* Logo adaptativa AVANT CELL
   O header e fixo e transparente, entao passa sobre secoes claras e escuras.
   Em vez de inferir a cor pelo CSS (fragil: overlays, background-size, canvas
   assincrono), testamos SOBREPOSICAO GEOMETRICA com as secoes escuras conhecidas.
   Deterministico e avaliado direto no scroll. */
(function () {
  "use strict";

  var logos = document.querySelectorAll(".minha-logo img");
  if (!logos.length) return;

  /* Zonas escuras da pagina.
     modo "imagem": a secao pinta a imagem com background-size:contain, entao a
     area escura e menor que a caixa — calculamos onde a imagem realmente cai.
     modo "caixa": fundo solido escuro, vale o retangulo inteiro. */
  var ZONAS = [
    { id: "46deddd", modo: "imagem" },   // hero "Otimize sua operacao..."
    { id: "4bec7af", modo: "caixa"  },   // secao de planos (bg #080808)
    { id: "avcpass2", modo: "caixa" }    // secao "Do cadastro a primeira venda" (bg #080A18)
  ];

  function urlDe(img, arq) { return img.src.replace(/LOGO2?\.svg(\?.*)?$/, arq); }

  [ "LOGO.svg", "LOGO2.svg" ].forEach(function (a) {
    var p = new Image(); p.src = urlDe(logos[0], a);
  });

  var natCache = {};                       // url -> {w,h} naturais da imagem

  function frac(v) {
    if (v && /%$/.test(v)) return parseFloat(v) / 100;
    if (v === "left" || v === "top") return 0;
    if (v === "right" || v === "bottom") return 1;
    return 0.5;
  }

  /* Le a luminancia da imagem de FUNDO de um elemento no ponto exato do viewport,
     desenhando 1 pixel em um canvas. Devolve null quando nao da para ler (canvas
     sujo em file://, imagem ainda carregando, ponto fora da imagem) — a chamada
     tem sempre um plano B. */
  var imgCache = {}, ctx1 = null;
  function lumDoFundo(el, cx, cy) {
    var cs = getComputedStyle(el), r = el.getBoundingClientRect();
    var mu = /url\(["']?([^"')]+)["']?\)/.exec(cs.backgroundImage || "");
    if (!mu) return null;
    var im = imgCache[mu[1]];
    if (im === undefined) {
      im = imgCache[mu[1]] = new Image();
      im.onload = agendar;
      im.onerror = function () { imgCache[mu[1]] = null; };
      im.src = mu[1];
      return null;
    }
    if (!im || !im.complete || !im.naturalWidth) return null;

    var tam = (cs.backgroundSize || "").trim(), esc;
    if (tam === "cover")        esc = Math.max(r.width / im.naturalWidth, r.height / im.naturalHeight);
    else if (tam === "contain") esc = Math.min(r.width / im.naturalWidth, r.height / im.naturalHeight);
    else return null;

    var iw = im.naturalWidth * esc, ih = im.naturalHeight * esc;
    var pos = (cs.backgroundPosition || "50% 50%").split(/\s+/);
    var sx = (cx - r.left - (r.width  - iw) * frac(pos[0])) / esc;
    var sy = (cy - r.top  - (r.height - ih) * frac(pos[1] || pos[0])) / esc;
    if (sx < 0 || sy < 0 || sx >= im.naturalWidth || sy >= im.naturalHeight) return null;

    try {
      if (!ctx1) {
        var cv = document.createElement("canvas");
        cv.width = cv.height = 1;
        ctx1 = cv.getContext("2d", { willReadFrequently: true });
      }
      ctx1.clearRect(0, 0, 1, 1);
      ctx1.drawImage(im, sx | 0, sy | 0, 1, 1, 0, 0, 1, 1);
      var d = ctx1.getImageData(0, 0, 1, 1).data;
      if (d[3] < 128) return null;                         // transparente nesse ponto
      return (d[0] * 299 + d[1] * 587 + d[2] * 114) / 1000;
    } catch (e) { return null; }                           // canvas sujo (file://)
  }

  /* Retangulo realmente pintado pela imagem de fundo (respeita contain + position). */
  function caixaPintada(el) {
    var cs = getComputedStyle(el), r = el.getBoundingClientRect();
    var mu = /url\(["']?([^"')]+)["']?\)/.exec(cs.backgroundImage || "");
    if (!mu) return null;
    var nat = natCache[mu[1]];
    if (!nat) {                            // mede uma vez e reavalia quando carregar
      natCache[mu[1]] = { w: 0, h: 0 };
      var im = new Image();
      im.onload = function () {
        natCache[mu[1]] = { w: im.naturalWidth, h: im.naturalHeight };
        aplicar();
      };
      im.src = mu[1];
      return r;                            // enquanto nao sabe, usa a caixa toda
    }
    if (!nat.w || !nat.h) return r;
    if ((cs.backgroundSize || "").trim() !== "contain") return r;

    var esc = Math.min(r.width / nat.w, r.height / nat.h);
    var iw = nat.w * esc, ih = nat.h * esc;
    var pos = (cs.backgroundPosition || "50% 50%").split(/\s+/);
    return { left:  r.left + (r.width  - iw) * frac(pos[0]),
             top:   r.top  + (r.height - ih) * frac(pos[1] || pos[0]),
             width: iw, height: ih,
             get right()  { return this.left + this.width; },
             get bottom() { return this.top + this.height; } };
  }

  function dentro(cx, cy, r) {
    return r && cx >= r.left && cx <= r.left + r.width
             && cy >= r.top  && cy <= r.top + r.height;
  }

  /* Paginas que nao declaram nenhuma zona sao de tema escuro de ponta a ponta
     (planos, sobre, contato, crmphone, evento-hub, pagina-de-links...), entao a
     logo fica branca por padrao. As zonas so existem nas paginas de tema misto. */
  function temZonas() {
    for (var i = 0; i < ZONAS.length; i++)
      if (document.querySelector('[data-id="' + ZONAS[i].id + '"]')) return true;
    return false;
  }
  var PAGINA_ESCURA = null;                 // resolvido na 1a chamada

  /* Faixas CLARAS: descobertas sozinhas, lendo a cor de fundo dos containers do
     Elementor. Assim uma secao clara nova (ex.: "Inteligencia Artificial" em
     /recursos/) ja escurece a logo sem precisar entrar em nenhuma lista.
     Cada faixa e {el, de, ate} em fracao da altura do elemento. */
  var claras = null;

  function fundoClaro(el) {
    var m = /rgba?\(([^)]+)\)/.exec(getComputedStyle(el).backgroundColor);
    if (!m) return false;
    var p = m[1].split(",").map(parseFloat);
    if ((p.length > 3 ? p[3] : 1) < 0.5) return false;        // transparente
    return (p[0] * 299 + p[1] * 587 + p[2] * 114) / 1000 >= 140;
  }

  /* Divisor de secao: container sem cor propria, so com imagem de fundo (uma curva
     ou onda), usado para costurar uma secao na outra. Nao da pra ler a cor dele sem
     canvas, entao deduzimos pelos vizinhos: se emenda com uma secao clara, a metade
     virada para ela ja conta como clara. */
  function metadeDeDivisa(el) {
    var cs = getComputedStyle(el);
    if (cs.backgroundImage === "none" || fundoClaro(el)) return null;
    var m = /rgba?\(([^)]+)\)/.exec(cs.backgroundColor);
    if (m) {
      var p = m[1].split(",").map(parseFloat);
      if ((p.length > 3 ? p[3] : 1) >= 0.5) return null;       // tem cor propria: nao e divisa
    }
    var ant = el.previousElementSibling, dep = el.nextElementSibling;
    var claroDepois = dep && fundoClaro(dep), claroAntes = ant && fundoClaro(ant);
    if (claroDepois && !claroAntes) return { de: 0.5, ate: 1 };   // escuro -> claro
    if (claroAntes && !claroDepois) return { de: 0, ate: 0.5 };   // claro -> escuro
    return null;
  }

  function zonasClaras() {
    if (claras) return claras;
    claras = [];
    var els = document.querySelectorAll("[data-id]");
    for (var i = 0; i < els.length; i++) {
      if (fundoClaro(els[i])) { claras.push({ el: els[i], tipo: "cor" }); continue; }
      var meia = metadeDeDivisa(els[i]);
      if (meia) claras.push({ el: els[i], tipo: "divisa", de: meia.de, ate: meia.ate });
    }
    return claras;
  }

  function sobreEscuro(cx, cy) {
    /* zonas escuras declaradas vencem: sao recortes precisos dentro de areas claras */
    for (var i = 0; i < ZONAS.length; i++) {
      var el = document.querySelector('[data-id="' + ZONAS[i].id + '"]');
      if (!el) continue;
      var cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      var r = ZONAS[i].modo === "imagem" ? caixaPintada(el) : el.getBoundingClientRect();
      if (dentro(cx, cy, r)) return true;
    }
    var cl = zonasClaras();
    for (var j = 0; j < cl.length; j++) {
      var z = cl[j], cz = getComputedStyle(z.el);
      if (cz.display === "none" || cz.visibility === "hidden") continue;
      var b = z.el.getBoundingClientRect();
      if (z.tipo === "cor") {
        if (dentro(cx, cy, b)) return false;
        continue;
      }
      if (!dentro(cx, cy, b)) continue;
      /* divisa: le o pixel exato da curva; a metade so vale se a leitura falhar */
      var lum = lumDoFundo(z.el, cx, cy);
      if (lum !== null) return lum < 140;
      var faixa = { left: b.left, width: b.width,
                    top: b.top + b.height * z.de,
                    height: b.height * (z.ate - z.de) };
      if (dentro(cx, cy, faixa)) return false;
    }
    if (PAGINA_ESCURA === null) PAGINA_ESCURA = !temZonas();
    return PAGINA_ESCURA;
  }

  /* Amostra uma grade 3x3 sobre a marca em vez de so o centro. Nas divisas curvas a
     borda entra na diagonal e corta a propria logo ao meio; pelo voto da maioria a
     troca acontece quando a maior parte do desenho ja mudou de lado. */
  function maioriaEscura(r) {
    var votos = 0, total = 0;
    for (var a = 1; a <= 3; a++) {
      for (var b = 1; b <= 3; b++) {
        total++;
        if (sobreEscuro(r.left + r.width * a / 4, r.top + r.height * b / 4)) votos++;
      }
    }
    return votos * 2 > total;
  }

  function aplicar() {
    for (var i = 0; i < logos.length; i++) {
      var img = logos[i], r = img.getBoundingClientRect();
      if (!r.width || !r.height) continue;             // variante oculta
      var alvo = urlDe(img, maioriaEscura(r) ? "LOGO.svg" : "LOGO2.svg");
      if (img.src !== alvo) img.src = alvo;
    }
  }

  var agendado = false;
  function agendar() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(function () { agendado = false; aplicar(); });
  }

  function recalcular() { claras = null; agendar(); }

  addEventListener("scroll", agendar, { passive: true });
  addEventListener("resize", recalcular);
  addEventListener("load", recalcular);
  if (document.readyState !== "loading") agendar();
  else addEventListener("DOMContentLoaded", agendar);
})();
