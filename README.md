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

- **Formularios nao enviam** — apontavam para o `admin-ajax.php` do WordPress.
- Chamadas a `wp-json/`, `feed/` e `xmlrpc.php` ficaram com URL absoluta
  apontando para o dominio original. Nao afetam nada visual.
- Analytics e pixels de terceiros ainda carregam dos dominios originais.
- Ha ~800 links internos ainda apontando para `mercadophone.app.br`
  (menu, botoes, rodape). Precisam do dominio do Avant Cell.

## Pendencias de conteudo

- **WhatsApp/Instagram** sao anunciados na tabela de
  planos e no FAQ, mas nao existem. A pagina `/crmphone/` inteira e sobre o
  CRM de WhatsApp/Instagram.
- Sobraram verdes da paleta antiga: badge "Melhor escolha", "ECONOMIZE 15%"
  (o desconto real do plano anual e 33%) e algumas pilulas de recurso.
- O card "Controle total da sua operacao" perdeu a coluna visual e o texto
  ficou desalinhado.
- Assets orfaos acumulados (fotos e SVGs removidos) ainda ocupam espaco.
