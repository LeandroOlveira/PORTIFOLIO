# Content Quality / E-E-A-T — 68/100

**Subiu de 45.** As páginas de projeto deixaram de ser stubs; o problema agora é volume e prova, não estrutura.

## Volume por página

| URL | Palavras (render) |
|---|---|
| `/` | 748 |
| `/projetos/radar-fiscal` | 348 |
| `/projetos/dochub` | 303 |
| `/projetos/roadmap` | 301 |
| `/notas/escopo-nao-e-lista-de-desejo` | 309 |
| `/projetos/alinnea` | 268 |
| `/projetos/gabriela-lorenson` | 263 |
| `/projetos/ebano` | 258 |
| `/notas/refem-do-desenvolvedor` | 256 |
| `/notas/a-gambiarra-e-documentacao` | 246 |
| `/projetos/petgest` | 237 |
| `/notas` | 105 |

Nenhuma página abaixo do piso de conteúdo fino (as de projeto saíram de 48–56 para 237–348). `/notas` a 105 palavras é o único índice fino (B3).

## E-E-A-T

**Experience — forte.** Sete projetos reais, quatro com link para o produto no ar (`alinnea.com.br`, `petgest.com.br`, `gabrielalorenson.com.br`, demo Ébano). Trajetória com cinco etapas datadas desde 2014. Isso é experiência demonstrada, não declarada.

**Expertise — média.** O `knowsAbout` do JSON-LD lista cinco tecnologias e a seção Stack as descreve em uso. Os H2 das páginas de projeto mostram julgamento técnico de verdade ("Por que não é um robô de e-CAC", "Dado de terceiro exige cuidado explícito"). O que falta é profundidade — cada H2 desses sustentaria 300 palavras e recebe ~80.

**Authoritativeness — fraca.** Nenhum backlink conhecido (domínio novo). Nenhuma citação externa, palestra, contribuição open source referenciada, depoimento de cliente. O GitHub está linkado, o que ajuda.

**Trust — boa.** Autor identificado com nome, e-mail, WhatsApp, três perfis sociais. Notas datadas com autoria explícita. HTTPS + HSTS. Não há claim inflado — o texto é notavelmente sóbrio para um portfólio.

## Problemas

### B1 — Notas curtas e poucas
Três notas de ~200–260 palavras de corpo. Como opinião funcionam; como ativo de busca, não. Três posts não estabelecem autoria temática em nenhum assunto.
**Fix:** cadência de duas notas/mês, 600–900 palavras, ancoradas nos problemas que os projetos já resolvem. As notas existentes têm boas premissas subdesenvolvidas — dá para expandir em vez de começar do zero.

### Métricas concretas quase ausentes
Só o Roadmap tem número real ("~80 pessoas"). Os outros seis são qualitativos. Um dado verificável por projeto (quantos usuários, quanto tempo economizado, quantos documentos processados) é o reforço de E-E-A-T mais barato disponível.

### B3 — `/notas` sem contexto
105 palavras: um H1 e três links. Um parágrafo dizendo o que são as notas, para quem e com que frequência saem melhora leitura e ranking do índice.

## Corrigido desde 05/08

- ✅ **Template sameness eliminado.** Os sete projetos tinham o mesmo esqueleto de dois H2 (o segundo sempre "O que ele demonstra"). Hoje cada um tem H2 próprios e específicos.
- ✅ **Tempo de leitura falso removido.** Não há mais campo declarando 3–4 min para textos de 1 min — o frontmatter não declara mais leitura.
- ✅ **Autoria nas notas.** `BlogPosting.author` + bio compartilhada com o `Person` do JSON-LD, a partir de uma fonte única em `site.ts`.
- ✅ **Alt text descritivo** nas capturas dos projetos.

## Duplicação

Nenhuma. Doze títulos únicos, doze descriptions únicas, nenhum bloco de corpo repetido entre páginas.
