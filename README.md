# Avant Cell — site

Site estatico do Avant Cell, sistema de gestao para lojas e assistencias de celular.

Partiu de um espelho de mercadophone.app.br (capturado em 04/09/2026) e foi
rebrandeado: identidade, precos, textos e conteudo passaram a ser do Avant Cell.

## Rodar

```bash
./servir.sh          # http://localhost:8080
```

Ou: `python3 -m http.server 8080`

Use sempre um servidor HTTP. Via `file://` o `logo-adaptativa.js` nao consegue
ler pixels no canvas e a logo fica sempre branca.

## Conteudo

| | |
|---|---|
| Paginas HTML | 12 |
| CSS / JS | 19 / 14 |
| Imagens | 184 |
| Fontes | 50 |
| Tamanho | ~35 MB |

Paginas: `/` `/sobre/` `/recursos/` `/planos/` `/contato/` `/crmphone/`
`/crm-2-0/` `/evento-hub/` `/pagina-de-links/` `/home-mercado-phone/`
`/politica-de-privacidade/` `/termo-de-uso/`

## Estrutura

```
index.html              # home
<pagina>/index.html     # demais paginas
logo-adaptativa.js      # troca a logo branca/colorida conforme o fundo
wp-content/             # assets (caminhos originais do WordPress preservados)
  uploads/              # imagens, logos, favicons e fontes
  cache/wpo-minify/     # CSS e JS minificados do tema/Elementor
_ext/                   # Google Fonts localizadas (offline)
```

## Logo adaptativa

O header e `position: fixed` e transparente, entao passa sobre secoes claras e
escuras. O `logo-adaptativa.js` alterna entre `LOGO.png` (branca) e `LOGO2.png`
(colorida) testando sobreposicao geometrica com as secoes escuras, listadas em
`ZONAS` no proprio arquivo:

- `46deddd` — hero (imagem de fundo com `background-size: contain`)
- `4bec7af` — secao de planos (fundo `#080808`)

Paginas que nao declaram nenhuma zona sao de tema escuro inteiro e usam a logo
branca por padrao. **Se as secoes forem reorganizadas, esses `data-id` precisam
ser atualizados.**

## Limitacoes

- **Formularios nao enviam** — apontavam para o `admin-ajax.php` do WordPress
  e ficaram sem destino.
- Sem analytics: os rastreadores do site de origem foram removidos em
  15/09/2026 e nenhum GTM ou Pixel proprio entrou no lugar.

## Pendencias

Em ordem de urgencia.

1. Dois blocos ainda com altura minima herdada do layout antigo, no celular:
   a secao "IA AVANT" da home (225px de sobra) e o cartao Premium das duas
   paginas de plano (197px e 219px). O do Premium e proposital em parte -- ele
   e o cartao em destaque e sobe acima dos outros -- entao mexer ali pede olhar
   antes.
2. FAQ, listas de recursos e a pagina `/recursos/` ainda tem textos identicos
   aos do site de origem (64 iguais e 11 quase iguais na ultima comparacao).
3. Assets orfaos acumulados (fotos e SVGs de secoes removidas) ainda ocupam
   espaco.

O rotulo "ECONOMIZE 23%" das duas abas e escrito a mao no CSS do Elementor
(`.e-n-tabs-heading::after`, uma regra por aba). Ele nao acompanha os precos:
se os planos mudarem, esse numero precisa ser refeito junto.

Ja resolvido e que era pendencia antes: os ~800 links internos para o dominio
antigo, as chamadas a `wp-json`/`xmlrpc.php`, os rastreadores de terceiros e as
paginas orfas (`/crmphone/`, `/crm-2-0/`, `/evento-hub/`, `/pagina-de-links/`,
`/home-mercado-phone/`) e o WhatsApp da pagina de contato, que passou a ser
`5531990993306` em 28/09/2026, e o `entrar/config.js`, que passou a apontar para
`https://avant-cell-sistema.vercel.app` em 30/09/2026, e os doze botoes
"Quero o ...", que em 30/09/2026 passaram a apontar para os planos de assinatura
do Avant Cell no Mercado Pago em vez do checkout do concorrente, e o Instagram
do rodape, que passou a ser `avantcell.br`.
