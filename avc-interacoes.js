/* Avant Cell — liga o carrossel e as abas do Elementor sem depender de scripts
   externos. Antes, esses comportamentos vinham de arquivos hospedados no
   servidor do MercadoPhone; aqui usamos a biblioteca Swiper que já é carregada
   pelo próprio site, lendo as mesmas configurações que o Elementor gravou. */
(function () {
  "use strict";

  function numero(valor, padrao) {
    var n = parseInt(valor, 10);
    return isNaN(n) ? padrao : n;
  }

  function ligarCarrossel(widget) {
    var alvo = widget.querySelector(".e-n-carousel");
    if (!alvo || alvo.swiper || typeof window.Swiper !== "function") return;

    var cfg = {};
    try { cfg = JSON.parse(widget.getAttribute("data-settings") || "{}"); } catch (e) { cfg = {}; }

    var espaco = (cfg.image_spacing_custom && cfg.image_spacing_custom.size) || 10;
    var porTela = numero(cfg.slides_to_show, 3);
    var tablet = numero(cfg.slides_to_show_tablet, Math.min(2, porTela));
    var celular = numero(cfg.slides_to_show_mobile, 1);

    new window.Swiper(alvo, {
      slidesPerView: celular,
      spaceBetween: espaco,
      speed: numero(cfg.speed, 500),
      watchOverflow: true,
      autoHeight: false,
      breakpoints: {
        768: { slidesPerView: tablet, spaceBetween: espaco },
        1025: { slidesPerView: porTela, spaceBetween: espaco }
      },
      pagination: alvo.querySelector(".swiper-pagination")
        ? { el: alvo.querySelector(".swiper-pagination"), clickable: true } : undefined,
      navigation: alvo.querySelector(".elementor-swiper-button-next")
        ? { nextEl: alvo.querySelector(".elementor-swiper-button-next"),
            prevEl: alvo.querySelector(".elementor-swiper-button-prev") } : undefined
    });
  }

  function atualizarCarrosseis(escopo) {
    escopo.querySelectorAll(".e-n-carousel").forEach(function (c) {
      if (c.swiper) c.swiper.update();
    });
  }

  function ligarAbas(bloco) {
    var titulos = bloco.querySelectorAll(".e-n-tab-title");
    var paineis = bloco.querySelectorAll(".e-n-tabs-content > [role='tabpanel']");
    if (!titulos.length) return;

    function abrir(indice) {
      titulos.forEach(function (t, i) {
        var ativo = i === indice;
        t.setAttribute("aria-selected", ativo ? "true" : "false");
        t.setAttribute("tabindex", ativo ? "0" : "-1");
      });
      paineis.forEach(function (p, i) {
        p.classList.toggle("e-active", i === indice);
        if (i === indice) atualizarCarrosseis(p);
      });
    }

    titulos.forEach(function (t, i) {
      t.addEventListener("click", function () { abrir(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(i); }
        if (e.key === "ArrowRight") abrir((i + 1) % titulos.length);
        if (e.key === "ArrowLeft") abrir((i - 1 + titulos.length) % titulos.length);
      });
    });
  }

  function comSeguranca(fn) {
    // uma peça com problema não pode impedir as outras de funcionar
    return function (el) {
      try { fn(el); } catch (e) { if (window.console) console.warn("avc:", e); }
    };
  }


  /* ---- menu -------------------------------------------------------------
     O menu do topo usava um script hospedado fora daqui. Estas funções abrem
     o submenu no computador (ao passar o mouse ou pelo teclado) e o menu
     sanduíche no celular. */

  var ESTILO = [
    ".elementor-nav-menu--main .menu-item-has-children{position:relative}",
    ".elementor-nav-menu--main .menu-item-has-children>.sub-menu{display:none}",
    ".elementor-nav-menu--main .menu-item-has-children.avc-aberto>.sub-menu{display:block;position:absolute;top:100%;left:0;min-width:210px;z-index:999;padding:6px 0;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.18)}",
    ".elementor-nav-menu--main .sub-menu .sub-menu{position:static!important;display:block!important;box-shadow:none;padding:0}",
    ".elementor-nav-menu--dropdown .sub-menu{display:block!important;position:static!important}",
    ".elementor-nav-menu--dropdown.elementor-nav-menu__container.avc-painel{position:fixed!important;left:14px!important;right:14px!important;width:calc(100vw - 28px)!important;max-width:none!important;border-radius:16px!important;overflow:auto!important;transform:none!important}",
    ".avc-painel ul{width:100%!important}"
  ].join("");

  function aplicarEstilo() {
    if (document.getElementById("avc-estilo-menu")) return;
    var s = document.createElement("style");
    s.id = "avc-estilo-menu";
    s.textContent = ESTILO;
    document.head.appendChild(s);
  }

  function ligarSubmenus(nav) {
    nav.querySelectorAll("li.menu-item-has-children").forEach(function (li) {
      if (li.dataset.avcSubmenu) return;
      li.dataset.avcSubmenu = "1";
      li.addEventListener("mouseenter", function () { li.classList.add("avc-aberto"); });
      li.addEventListener("mouseleave", function () { li.classList.remove("avc-aberto"); });
      li.addEventListener("focusin", function () { li.classList.add("avc-aberto"); });
      li.addEventListener("focusout", function (e) {
        if (!li.contains(e.relatedTarget)) li.classList.remove("avc-aberto");
      });
      var link = li.querySelector(":scope > a");
      if (link && link.getAttribute("href") === "#") {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          li.classList.toggle("avc-aberto");
        });
      }
    });
  }

  function ligarSanduiche(botao) {
    if (botao.dataset.avcMenu) return;
    botao.dataset.avcMenu = "1";
    var painel = botao.nextElementSibling;
    function alternar() {
      var aberto = botao.classList.toggle("elementor-active");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
      if (painel) {
        painel.setAttribute("aria-hidden", aberto ? "false" : "true");
        // ancora o painel logo abaixo do cabeçalho, ocupando a largura da tela
        painel.classList.add("avc-painel");
        var barra = botao.closest(".e-con, header, .elementor-section") || botao;
        painel.style.top = Math.round(barra.getBoundingClientRect().bottom + 10) + "px";
        // o CSS do tema abre o menu com max-height: var(--menu-height);
        // essa altura era calculada pelo script antigo, então calculamos aqui
        var lista = painel.querySelector("ul");
        var altura = (lista ? lista.scrollHeight : painel.scrollHeight) + 20;
        painel.style.setProperty("--menu-height", altura + "px");
        painel.style.setProperty("max-height", aberto ? altura + "px" : "0px", "important");
      }
    }
    botao.addEventListener("click", alternar);
    botao.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(); }
    });
  }

  function iniciar() {
    aplicarEstilo();
    document.querySelectorAll(".elementor-nav-menu--main").forEach(comSeguranca(ligarSubmenus));
    document.querySelectorAll(".elementor-menu-toggle").forEach(comSeguranca(ligarSanduiche));
    document.querySelectorAll(".elementor-widget-n-carousel").forEach(comSeguranca(ligarCarrossel));
    document.querySelectorAll(".e-n-tabs").forEach(comSeguranca(ligarAbas));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
  window.addEventListener("load", iniciar);
})();
