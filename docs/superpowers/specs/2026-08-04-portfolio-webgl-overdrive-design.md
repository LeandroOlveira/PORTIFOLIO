# Portfólio WebGL Overdrive — Design

## Objetivo

Transformar o portfólio em uma experiência espacial de alto impacto durante toda a rolagem, mantendo o hero atual, o conteúdo real e a leitura direta. A animação deve impressionar pela continuidade, profundidade e precisão técnica, sem recolocar metáforas de cinema na interface e sem depender de movimento para comunicar qualquer informação.

## Direção aprovada

A página passa a existir dentro de um campo operacional tridimensional. Um canvas WebGL único acompanha a rolagem e muda de estado conforme cada seção entra no foco. Os elementos HTML permanecem como a camada semântica e interativa; WebGL cria ambiente, profundidade e continuidade.

O verde-limão continua sendo o único acento. A geometria usa pontos, linhas, planos, grades e pulsos que evocam estrutura, fluxo e conexão — nunca estrelas, galáxias, claquetes, projetores ou controles de reprodução.

## Arquitetura

### Camada espacial

`ScrollExperience` será um componente cliente montado uma vez na página inicial. Ele contém um canvas fixo, `aria-hidden`, com `pointer-events: none`, posicionado entre o fundo e o conteúdo.

O renderizador será WebGL leve e carregado dinamicamente depois que o hero estiver disponível. A cena terá uma câmera, um campo de partículas/linhas e planos abstratos reutilizados entre estados. Não haverá um canvas por seção nem recriação contínua de contextos.

### Orquestração

GSAP ScrollTrigger, já distribuído pelo pacote GSAP instalado, ligará a progressão da página a duas camadas:

1. Uniformes e propriedades da cena: posição da câmera, profundidade, densidade, energia, rotação, cor e foco.
2. Elementos DOM: máscaras, escala, parallax, deslocamento, opacidade e desenho de linhas.

Cada seção expõe marcadores `data-motion-section` e `data-motion-*`. Um controlador central registra os estados e destrói timelines, listeners e recursos no unmount. O conteúdo nunca começa oculto no HTML; a preparação visual acontece somente depois que o runtime confirma que a animação está habilitada.

### Perfis de movimento

Uma função pura escolhe o perfil antes de inicializar a experiência:

- `full`: desktop ou dispositivo capaz, WebGL completo e coreografia espacial.
- `compact`: mobile ou capacidade limitada, menos partículas, DPR limitado e movimentos mais curtos.
- `static`: `prefers-reduced-motion`, ausência de WebGL ou falha de inicialização; canvas ausente e conteúdo montado.

`saveData`, largura da viewport, densidade de pixels e disponibilidade de WebGL participam da decisão. O perfil pode reduzir qualidade, mas nunca remover conteúdo ou ações.

## Coreografia por seção

### Hero

O hero e sua entrada automática permanecem. Quando a rolagem começa, o bloco ganha leve afastamento em profundidade e o campo espacial emerge por trás dele. A primeira impressão continua imediata e não exige scroll.

### Projetos

É o principal momento espacial. Alinnea abre a sequência como um plano largo, com imagem em parallax multicamada e leve inclinação controlada pela rolagem. Roadmap e DocHub entram como dois planos tipográficos em profundidades distintas. Os demais projetos formam uma sequência de superfícies que se aproxima e se estabiliza na grade existente.

No desktop, a seção pode usar um trecho sticky e progressão vertical longa, sem transformar a roda do mouse em rolagem horizontal. No mobile, os cartões permanecem verticais e recebem apenas perspectiva, máscara e parallax compactos.

### Stack

As tecnologias aparecem sobre uma malha tridimensional de pontos e conexões. Os itens HTML entram em cascata e pequenos pulsos percorrem as conexões do canvas. A malha serve como estrutura visual; não vira gráfico interativo nem sugere relações inexistentes entre tecnologias.

### Processo

As três etapas começam em distâncias diferentes e convergem para um mesmo plano. Linhas de um pixel são desenhadas progressivamente entre os módulos, reforçando sequência sem substituir os números e textos existentes.

### Trajetória

Os marcos percorrem um eixo de profundidade. A linha temporal é construída conforme a rolagem avança, enquanto datas e descrições entram com alternância lateral discreta. O efeito enfatiza progressão profissional e não simula uma timeline de edição.

### Notas

A cena reduz densidade e velocidade. Os cartões editoriais entram com foco, deslocamento curto e uma mudança suave de plano. Esta pausa evita que o site fique uniformemente barulhento e prepara o clímax.

### Contato

O campo converge para o centro e o verde-limão domina a cena. As linhas se alinham aos canais de contato; cada link reage com deslocamento e inversão já existentes. O encerramento é forte, mas o texto e os quatro canais permanecem imediatamente utilizáveis.

## Interação

O cursor pode influenciar a câmera em poucos graus no perfil `full`, com suavização e limite rígido. Ele não move botões, não altera a posição de leitura e não existe em dispositivos de toque.

Não haverá áudio, rolagem suave artificial, scroll hijacking, controle de reprodução, cursor personalizado ou dependência de gesto para liberar conteúdo.

## Performance e ciclo de vida

- Um único `requestAnimationFrame`, pausado quando a aba está oculta.
- Canvas inicializado de forma tardia e destruído no unmount.
- DPR limitado a 1.5 no perfil `full` e 1 no `compact`.
- Quantidade de partículas e segmentos definida por perfil, sem alocação por frame.
- Apenas `transform`, `opacity`, `clip-path` controlado e propriedades WebGL durante a rolagem.
- Resize agrupado e recalculado sem criar novos listeners.
- Alvo de 60 fps em desktop e movimento estável em mobile intermediário; qualquer efeito que cause queda perceptível será simplificado.

## Acessibilidade e fallback

- O canvas é decorativo, sem foco e `aria-hidden="true"`.
- `prefers-reduced-motion: reduce` seleciona `static` antes de criar timelines ou WebGL.
- Sem JavaScript ou com erro no canvas, toda a página permanece visível e navegável.
- Foco, ordem DOM, links, headings e alvos de toque não mudam.
- Contraste e legibilidade não podem depender do canvas.
- Elementos preparados para animação recebem estado inicial somente depois da inicialização bem-sucedida.

## Testes e validação

### TDD automatizado

1. Testar a escolha dos perfis `full`, `compact` e `static` antes de criar o runtime.
2. Testar que movimento reduzido impede a inicialização de WebGL e mantém o conteúdo.
3. Testar que o canvas é decorativo e não captura interação.
4. Testar que todas as seções expõem os marcadores necessários sem alterar sua semântica.
5. Testar cleanup de listeners, timelines e frame de animação quando o controlador for desmontado.

### Browser QA

- Desktop 1440×900 e mobile 390×844.
- Primeira entrada, meio de cada seção e contato.
- Console sem erros ou warnings introduzidos.
- Sem overflow horizontal.
- Links e foco funcionais durante trechos sticky.
- Perfil compacto visualmente coerente.
- Movimento reduzido verificado mecanicamente quando a emulação visual não estiver disponível.
- Medição de frames e inspeção de long tasks durante uma rolagem completa.

O ciclo visual terá uma captura completa desktop/mobile, uma única correção em lote e no máximo uma confirmação, conforme o limite de acabamento do Impeccable.

## Critérios de aceite

- O hero aprovado permanece reconhecível e abre automaticamente.
- Todas as seis áreas após o hero recebem uma coreografia própria dentro de uma mesma linguagem espacial.
- Projetos formam o principal momento WebGL e contato encerra com o clímax visual.
- Nenhum conteúdo depende de animação, WebGL ou rolagem para existir.
- Não há scroll hijacking, metáforas cinematográficas na interface ou exposição de dados privados.
- Desktop e mobile não apresentam overflow, bloqueio de interação ou queda perceptível causada por excesso de renderização.
- `prefers-reduced-motion` e falha de WebGL entregam uma página completa e estática.
- Testes, typecheck e build passam antes do encerramento.

## Fora de escopo

- Alterar textos, projetos, contatos ou trajetória.
- Criar novas páginas ou funcionalidades de produto.
- Adicionar áudio, vídeo, WebGPU, física complexa ou navegação 3D interativa.
- Reintroduzir Lenis, um controlador que substitua a rolagem nativa ou ScrollTrigger fora do componente isolado da experiência.
