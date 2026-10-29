/*
 * Avisos de conversão para o Google Tag Manager (GTM-543H5GN9).
 * Cada aviso vira um "Evento personalizado" no GTM, que repassa ao GA4,
 * ao Google Ads ou ao Pixel conforme as tags configuradas no painel.
 *
 *   clique_whatsapp  { local: "flutuante" | "pagina" }
 *   clique_assinar   { plano: "essencial" | "profissional" | "premium" }
 *   envio_contato    { assunto }
 */
(function () {
	window.dataLayer = window.dataLayer || [];

	function avisar(evento, dados) {
		var item = { event: evento, pagina: location.pathname };
		for (var k in dados) item[k] = dados[k];
		window.dataLayer.push(item);
	}

	document.addEventListener("click", function (e) {
		var link = e.target.closest && e.target.closest("a[href]");
		if (!link) return;
		var href = link.getAttribute("href");

		if (href.indexOf("wa.me/") !== -1) {
			avisar("clique_whatsapp", { local: link.closest(".avc-zap") ? "flutuante" : "pagina" });
		} else if (href.indexOf("app.avantcell.com.br/cadastro") !== -1) {
			var plano = (href.match(/[?&]plano=([a-z]+)/) || [])[1] || "nenhum";
			avisar("clique_assinar", { plano: plano });
		}
	}, true);

	document.addEventListener("submit", function (e) {
		if (e.target.id !== "form-contato") return;
		var assunto = e.target.querySelector("[name=assunto]");
		avisar("envio_contato", { assunto: assunto ? assunto.value : "" });
	}, true);
})();
