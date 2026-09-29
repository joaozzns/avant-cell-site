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

1. **Os botoes "Quero o ..." levam o cliente para o checkout do concorrente.**
   Os doze botoes das duas paginas de plano apontam para
   `celcash.celcoin.com.br/mercado-phone/...` e
   `subscription.mercadophone.tech`. Quem compra, compra de outra empresa. Os
   botoes do plano mensal ainda apontam para os links `...anual1`, entao nem o
   periodo confere. Precisam do checkout do Avant Cell antes de qualquer
   divulgacao.
2. **Instagram `mercadophone.hub`** no rodape de cinco paginas.
3. `entrar/config.js` aponta para `http://localhost:3000`; precisa da URL do
   sistema publicado.
4. "ECONOMIZE 15%" na aba Mensal ficou inconsistente com o "ECONOMIZE 23%" da
   aba Anual. Os dois sao escritos a mao no CSS do Elementor
   (`.e-n-tabs-heading::after`) e nao acompanham os precos.
5. FAQ, listas de recursos e a pagina `/recursos/` ainda tem textos identicos
   aos do site de origem (64 iguais e 11 quase iguais na ultima comparacao).
6. Assets orfaos acumulados (fotos e SVGs de secoes removidas) ainda ocupam
   espaco.

Ja resolvido e que era pendencia antes: os ~800 links internos para o dominio
antigo, as chamadas a `wp-json`/`xmlrpc.php`, os rastreadores de terceiros e as
paginas orfas (`/crmphone/`, `/crm-2-0/`, `/evento-hub/`, `/pagina-de-links/`,
`/home-mercado-phone/`) e o WhatsApp da pagina de contato, que passou a ser
`5531990993306` em 28/09/2026.
