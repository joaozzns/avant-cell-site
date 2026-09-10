/* Corrige o link "Saiba mais" do banner de cookies.
   O banner e injetado em tempo de execucao pelo script da RD Station e aponta
   para a politica de privacidade do dominio original — o destino esta na conta
   deles, nao em nenhum arquivo daqui. Entao reescrevemos o href assim que o
   banner aparece, reaproveitando o link do rodape (que ja tem o caminho
   relativo correto para a profundidade da pagina). */
(function () {
  "use strict";

  function destinoLocal() {
    var a = document.querySelector('a[href$="politica-de-privacidade/index.html"]');
    return a ? a.getAttribute("href") : null;
  }

  function ehDoDominioAntigo(href) {
    return /mercadophone\.app\.br\/politica-de-privacidade/i.test(href || "");
  }

  function corrige() {
    var destino = destinoLocal();
    if (!destino) return false;
    var n = 0;
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      if (ehDoDominioAntigo(links[i].getAttribute("href"))) {
        links[i].setAttribute("href", destino);
        n++;
      }
    }
    return n > 0;
  }

  if (corrige()) return;                      // ja estava no DOM

  var obs = new MutationObserver(function () {
    if (corrige()) obs.disconnect();          // banner chegou: corrige e para
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); }, 20000);   // trava de seguranca
})();
