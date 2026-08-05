---
name: "Portfólio de Leandro Oliveira"
description: "Sistema editorial de alto contraste para apresentar produtos digitais em operações reais."
colors:
  black: "#050505"
  ink: "#0b0b0b"
  panel: "#111111"
  line: "#232323"
  line-strong: "#333333"
  paper: "#f2f2f0"
  mid: "#9a9c93"
  dim: "#85877f"
  mark: "#d4ff00"
  mark-press: "#bfe600"
typography:
  display:
    fontFamily: "var(--font-archivo), system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "var(--font-archivo), system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "var(--font-archivo), system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "var(--font-archivo), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-martian), ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.14em"
spacing:
  component: "1.5rem"
  component-wide: "2rem"
  gutter: "1.25rem"
  gutter-wide: "2.5rem"
  section: "5rem"
  section-wide: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.black}"
    typography: "{typography.label}"
    padding: "0.875rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.mark-press}"
    textColor: "{colors.black}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "0.875rem 1.5rem"
  button-inverted:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    typography: "{typography.label}"
    padding: "0.875rem 1.5rem"
  navigation-cta:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.black}"
    typography: "{typography.label}"
    height: "2.75rem"
    padding: "0 1rem"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.mid}"
    typography: "{typography.label}"
    padding: "0.3125rem 0.5625rem"
  project-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    padding: "1.5rem"
---

# Design System: Portfólio de Leandro Oliveira

## Overview

**Creative North Star: "Produto e operação"**

O sistema apresenta trabalho técnico com a clareza de um painel editorial: contraste alto, hierarquia incisiva e prova concreta antes de ornamento. A atmosfera é sóbria, direta e confiante; o verde-limão cria pontos de decisão dentro de uma base escura, sem competir com o conteúdo.

O cinema aparece como linguagem estrutural — enquadramento, ritmo, cortes retangulares e uma abertura breve — e não como vocabulário da interface. O conjunto evita tanto a grade genérica de portfólio quanto a simulação de controles de reprodução, mantendo produto e operação como assunto principal.

**Key Characteristics:**

- Alto contraste com um único acento cromático.
- Tipografia larga e condensada por hierarquia, não por decoração.
- Módulos retangulares articulados por linhas de um pixel.
- Assimetria controlada em telas largas e fluxo direto no mobile.
- Movimento ancorado no corredor, com uma coreografia própria por seção depois dele e conteúdo sempre disponível.

## Colors

A paleta usa neutros quase pretos para construir planos, branco quente para leitura e verde-limão como marca funcional.

### Primary

- **Verde de decisão:** aciona CTAs, links em destaque, indicadores positivos, foco e pequenos marcadores de leitura.
- **Verde pressionado:** responde ao hover dos controles preenchidos sem introduzir uma segunda cor de marca.

### Neutral

- **Preto profundo:** ancora seções alternadas e áreas de código.
- **Tinta:** é a superfície principal da página e o fundo padrão de cartões.
- **Painel:** separa imagens, código e superfícies internas por diferença tonal discreta.
- **Linha e linha forte:** estruturam divisores, contornos e estados sem criar caixas pesadas.
- **Papel quente:** sustenta títulos e texto de maior prioridade.
- **Cinza médio e cinza baixo:** organizam texto secundário e metadados preservando a hierarquia.

**The One Accent Rule.** O verde de decisão é o único acento; reserve-o para ação, estado, foco ou trecho essencial de uma tese.

**The Tonal Structure Rule.** Separe superfícies escuras com alternância tonal e linhas, nunca com uma coleção de cores decorativas.

## Typography

**Display Font:** Archivo (com system-ui e sans-serif como fallback)

**Body Font:** Archivo (com system-ui e sans-serif como fallback)

**Label/Mono Font:** Martian Mono (com ui-monospace e monospace como fallback)

**Character:** Archivo entra largo, pesado e compacto nos títulos, mas permanece neutro e legível no corpo. Martian Mono é uma voz auxiliar precisa, restrita a metadados, status, tecnologia e numeração.

### Hierarchy

- **Display** (800, `clamp(3rem, 8vw, 6rem)`, 0.92): tese da abertura, em caixa alta e com largura variável 112.
- **Headline** (800, 2.25rem no mobile até 3.75rem no desktop, 0.92): títulos de seção, em caixa alta e limitados a cerca de 14–17 caracteres por linha.
- **Title** (700, 1.25rem–2.25rem conforme o módulo, 1.02): nomes de projetos, etapas, notas e marcos.
- **Body** (400, 0.875rem–1.125rem, 1.5–1.75): explicação e prova, normalmente limitada a 46–75 caracteres por linha.
- **Label** (500, 0.6875rem–0.8125rem, 0.10em–0.14em): status, tecnologia, datas e índices em caixa alta com algarismos tabulares.

**The Two Voices Rule.** Use Archivo para mensagem e leitura; use Martian Mono apenas para dados curtos e classificações.

**The Compressed Thesis Rule.** Títulos principais são largos, pesados, em caixa alta e com entrelinha curta; parágrafos nunca imitam essa compressão.

## Layout

O conteúdo vive em um contêiner central de até 84rem, com respiro lateral de 1.25rem no mobile e 2.5rem a partir de 768px. Seções usam 5rem de espaço vertical no mobile e 8rem a partir do mesmo breakpoint; blocos internos recorrentes usam 1.5rem ou 2rem.

A composição começa em coluna única. Aos 640px surgem divisões simples para listas e metadados; aos 768px entram a navegação completa, o respiro ampliado e grades editoriais; aos 1024px aparecem assimetrias de duas colunas, trechos sticky e grades de três ou quatro colunas. A abertura, os títulos de seção, os projetos em destaque e o contato usam proporções assimétricas; listas de stack, trajetória e notas preservam uma leitura linear.

**The One-Pixel Grid Rule.** Construa grupos de módulos com fundo de linha e espaçamento de um pixel, deixando as próprias superfícies formarem a grade.

**The Mobile Sequence Rule.** No mobile, preserve a ordem argumento → prova → ação; não comprima a estrutura desktop em colunas estreitas.

## Elevation & Depth

Existem dois regimes de profundidade, e eles não se misturam.

**No documento**, o sistema é plano e não usa sombras. Profundidade vem da alternância entre preto profundo, tinta e painel, reforçada por linhas de um pixel.

**No corredor**, a profundidade é real: perspectiva, névoa exponencial e profundidade de campo por nível de mipmap. É o único lugar da página com eixo Z, e é o que sustenta a leitura de escala — a chapa enquadrada tem cerca de 62% da altura do quadro, a seguinte cerca de 40% dela, e a terceira ainda é reconhecível ao fundo.

**The Flat-by-Default Rule.** Fora do corredor, superfícies permanecem sem sombra; contraste tonal, linhas e recorte de imagem são os únicos mecanismos de profundidade.

**The One-Depth Rule.** Profundidade simulada não vaza para o documento: nada de parallax em seção de texto, card inclinado ou sombra imitando distância. Ou o elemento está no corredor, ou é plano.

## Shapes

O vocabulário formal é ortogonal: cantos retos, linhas finas, pontos quadrados e imagens recortadas em retângulos. Tags, botões, cartões e estados não recebem arredondamento. As duas faixas diagonais da abertura são uma assinatura de transição localizada, não uma licença para inclinar componentes funcionais.

**The Square Surface Rule.** Componentes funcionais não usam raio; hierarquia vem de proporção, cor e borda.

## Components

### Buttons

- **Shape:** retângulo de canto reto, conteúdo em linha e espaçamento interno de 0.875rem × 1.5rem.
- **Primary:** fundo verde de decisão, texto preto, label monoespaçada em caixa alta e seta que avança no hover.
- **Outline:** fundo transparente, contorno de linha forte e texto papel; no hover, contorno e texto assumem o acento.
- **Inverted:** fundo transparente e contorno preto de dois pixels para superfícies verdes; no hover, fica preto com texto verde.
- **Hover / Focus:** cor responde em 200ms; foco visível usa contorno verde de dois pixels com afastamento de três pixels.

### Chips

- **Style:** tags de tecnologia são retangulares, transparentes, com contorno forte de um pixel, label monoespaçada e padding compacto.
- **State:** a variante marcada troca contorno e texto para verde; estados de projeto usam um ponto quadrado cheio para publicado ou entregue e vazado para construção ou demonstração.

### Cards / Containers

- **Corner Style:** cantos retos.
- **Background:** superfície tinta sobre grade de linhas; imagens usam painel como fundo de segurança.
- **Shadow Strategy:** nenhuma sombra.
- **Border:** divisores de um pixel; o resultado de cartões menores recebe uma barra vertical verde.
- **Internal Padding:** 1.5rem no mobile e 2rem em destaques ou telas maiores.
- **Media:** fora do corredor, capturas aparecem em largura total com contorno de um pixel, em cor plena. Não há mais miniatura em escala de cinza: a captura é a prova, e prova reduzida a thumbnail não prova nada.
- **Galeria:** a página do projeto mostra **todas** as capturas do projeto empilhadas na grade de um pixel, cada uma na proporção do arquivo. O corredor continua mostrando a capa enquadrada com as secundárias passando como satélites — ele é a chamada, a página é o dossiê. Nenhuma delas é recortada: o enquadramento em 16/9 escondia a lateral das telas largas e metade das verticais, que é justamente o que a captura tinha a provar. Cada `<img>` carrega `width` e `height` lidos do arquivo em build, então a página não salta enquanto elas chegam.
- **Escopo:** cartão não é mais o esqueleto da home. Projetos vivem no corredor; o vocabulário de cartão sobrevive apenas em listas secundárias e páginas internas.

### Navigation

O cabeçalho tem 3.5rem de altura, fica fixo, usa fundo tinta quase opaco e linha inferior. A assinatura tipográfica permanece à esquerda, links diretos aparecem a partir de 768px e o CTA do WhatsApp permanece visível em todas as larguras. Links neutros clareiam no hover; o CTA verde escurece para o verde pressionado.

### Contact List

O bloco de contato inverte o sistema: superfície verde, texto e divisores pretos. Cada canal ocupa uma linha de pelo menos 3.5rem, inverte para preto no hover e move a seta um passo para a direita.

### A porta

O hero não é uma seção que rola para fora: ele **é** a porta do corredor. Ocupa a primeira tela inteira e, à primeira rolagem, se parte ao meio — as duas metades giram em torno da própria borda externa e são empurradas para dentro, para longe de quem olha, revelando o corredor que já estava atrás.

- **Composição desenhada em torno do corte.** A junta nunca atravessa conteúdo: no desktop o título ocupa a metade esquerda e a chamada a direita; no telefone o título fica na metade de cima, encostado na junta, e a chamada na de baixo. Por isso cada folha carrega conteúdo real e único — não há duplicação de markup nem título repetido para leitor de tela.
- **Eixo por largura.** Acima de 768px as folhas giram em `rotateY`; abaixo, em `rotateX`, porque num quadro estreito o corte horizontal tem muito mais curso para percorrer.
- **90° cheios.** A folha precisa terminar exatamente de perfil: a 84° ela ainda projeta uma faixa larga junto à dobradiça, que cobria as bordas do corredor. A opacidade também cai no último terço, então a tela inteira pertence ao corredor quando a primeira chapa chega.
- **Nenhuma marca na junta.** Fechada, a porta é uma tela preta inteira e nada denuncia que ela abre — a surpresa é o efeito. A face perde luz conforme se afasta do eixo da câmera, e é só isso que revela o volume durante o giro.
- **"Ver projetos" conduz a rolagem** em vez de saltar: a abertura acontece na frente de quem clicou, e qualquer gesto do visitante devolve o controle na hora.

### Corredor

O momento autoral da página, e o único. Depois da porta, projetos não são seções empilhadas: são estações de uma viagem única em que a rolagem empurra uma câmera, e as capturas são chapas suspensas no espaço.

- **Ritmo:** cada estação tem três tempos — aproximação (44% do segmento), retenção (24%) e travessia (32%). É a retenção que dá tempo de ler. Velocidade constante vira esteira.
- **Enquadramento:** a chapa é elevada acima do centro e o terço inferior fica livre para o texto. Isso não é composição por gosto: metade das interfaces do portfólio é clara, e texto branco sobre formulário branco não sobrevive a gradiente nenhum.
- **Moldura:** um fio de verde no perímetro de cada chapa, compensado pela distância para manter espessura constante em pixels. É a repetição desse fio fugindo para o ponto de fuga que faz o conjunto ler como corredor.
- **Tom da captura:** a interface aparece no tom em que foi desenhada. A textura não declara espaço de cor de propósito — com `SRGBColorSpace` a GPU decodifica para linear na amostragem, mas a conversão de volta só acontece nos materiais nativos do Three, e um shader próprio escreve direto no framebuffer. A névoa pesa menos de 3% na chapa enquadrada e a vinheta só entra perto da borda, pelo mesmo motivo: nada pode escurecer a prova.
- **Ótica por largura:** acima de 700px a chapa ocupa 86% da largura, os satélites entram e a câmera não centraliza por completo. Abaixo disso a chapa toma 90%, os satélites saem, a câmera centraliza quase inteiramente e o quadro ganha inclinação para subir o ponto de fuga acima do texto.
- **Saída:** a viagem termina com a última chapa ainda enquadrada. Sair do corredor para tela preta é anticlímax; o resto da página entra por cima do último quadro.
- **Véu:** vinheta e grão cobrem o quadro inteiro; o grão troca a cada cinco quadros, não a cada quadro.
- **Fallback:** sem WebGL2, com movimento reduzido ou sem JavaScript, o corredor não existe e o mesmo conteúdo aparece empilhado, com as capturas em largura total. Títulos, textos e links são HTML real nos dois modos.

### Movimento depois do corredor

Por um tempo, tudo depois do corredor entrou com uma única animação idêntica — o mesmo desvanecer com 18px de subida para uma pilha, uma sequência, uma linha do tempo, um índice e uma placa. Era defensável como restrição, mas na página lia como desistência: cinco seções de natureza diferente executando o mesmo gesto não é coreografia, é reflexo. O corredor continua sendo o momento autoral; o que vem depois dele é a prova, e prova apresentada sem convicção não convence.

Agora cada seção move o que ela é. Nenhuma delas usa biblioteca: `animation-timeline: view()` é o navegador resolvendo, e todo progresso é uma propriedade registrada que **nasce no valor concluído**, então sem suporte, com movimento reduzido ou com o script fora do ar a página aparece montada.

- **Stack aplicada — a pilha se assenta.** As cinco linhas compartilham a linha do tempo do próprio `<ol>`; uma por item produziria o stagger decorativo de sempre, em que cada linha entra sozinha e nada se relaciona. O curso cresce para baixo (`--carga`), então a primeira é a âncora e as demais fecham contra ela. As réguas vivem em pseudo-elementos para poderem se estender da esquerda, e os numerais chegam depois delas: é o atraso que faz a chegada parecer peso assentando em vez de bloco deslizando.
- **Como eu trabalho — a linha avança.** Três etapas numeradas são uma sequência, e a ordem carrega informação. Uma linha percorre 01 → 02 → 03 (vertical no telefone, horizontal a partir de 1024px), acesa só na cabeça e neutra no trecho já percorrido. Cada quadro lê sua fatia do mesmo avanço, então o segundo literalmente espera o primeiro. Os quadros **não se deslocam**: a grade de um pixel é o fundo do `<ol>` aparecendo nas frestas, e mover as células faria a grade piscar. O texto também nunca desbota — uma rolagem parada no meio do curso não pode deixar parágrafo ilegível.
- **Trajetória — a régua marca posição.** O marco que cruza a faixa central acende a própria borda superior e planta um ponto quadrado na régua; a partir de 1024px a régua vertical se preenche com a leitura. Período, título e descrição ficam sempre na cor cheia: indicador de leitura não pode custar legibilidade.
- **Notas — o índice é cortado.** Cada linha abre por `clip-path` da esquerda para a direita, com uma lâmina acesa na frente do corte que se apaga quando ele termina. A lâmina é a ferramenta, não o resultado.
- **Contato — a chapa é aplicada.** A única superfície verde da página não desliza para dentro: ela sobe sobre o preto até cobrir a tela. Como o conteúdo é preto, ele não pode existir antes da chapa, então os dois derivam do mesmo progresso — a chapa fecha em 0,59 e o conteúdo só começa aí. Um progresso, duas leituras, nenhuma chance de dessincronizar.
- **Títulos — o eixo sob carga.** A assinatura comum não é uma entrada, é contínua: a Archivo estreita e aperta sob rolagem rápida e reabre em 112 quando a pessoa para para ler. Vale nos quatro títulos de seção, que são curtos e não trocam de quebra em nenhuma largura do eixo; não vale na pergunta do contato, de seis linhas, nem nos projetos, que pertencem ao corredor.

**The Earned-Motion Rule.** Uma seção só ganha movimento quando o movimento diz algo específico sobre o conteúdo dela. Movimento igual para coisas diferentes é reflexo, não sistema.

**The Legible-Indicator Rule.** O que acende é sempre a marcação — régua, ponto, numeral, lâmina —, nunca o texto. Uma rolagem interrompida no meio de qualquer curso tem que deixar tudo legível.

**The Narrow-Window Rule.** Marcar "a linha em leitura" numa lista curta foi descartado uma vez, e a objeção estava certa: com janela larga, três marcos acendem juntos e o indicador deixa de indicar — vira faixa verde. O que salva não é abandonar a ideia, é a largura da janela. Os marcos distam cerca de 10% do próprio curso, então a janela acesa vai de 36% a 68%: dois no máximo, o que lê como onda descendo a lista, não como pisca-pisca.

## Do's and Don'ts

### Do:

- **Do** mantenha o verde raro e funcional: ação, foco, estado ou argumento essencial.
- **Do** use linhas de um pixel e alternância tonal para organizar listas e módulos.
- **Do** preserve alvos interativos de pelo menos 44px e foco visível de alto contraste.
- **Do** trate projetos sem captura pública segura como composições tipográficas intencionais.
- **Do** mantenha toda informação essencial acessível antes e sem animação.

### Don't:

- **Don't** introduza cartões arredondados, sombras ou gradientes para simular profundidade.
- **Don't** empilhe um segundo momento de espetáculo depois do corredor. Foco cria impacto; excesso cria ruído.
- **Don't** trate o corredor como plano de fundo decorativo: as chapas são o conteúdo, não uma textura atrás dele.
- **Don't** transforme cinema em nomes de seção, controles de reprodução ou metáforas para explicar o trabalho.
- **Don't** use Martian Mono em parágrafos ou títulos de mensagem.
- **Don't** crie uma segunda cor de acento nem uma grade de logos de tecnologia.
- **Don't** publique capturas com dados pessoais ou operacionais identificáveis.
