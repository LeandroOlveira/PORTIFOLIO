# Portfólio - produto e operação

## Objetivo

Reposicionar a home de `lhs.oliveira` como um portfólio de desenvolvimento focado em produtos digitais e operações reais. O visitante deve entender, ainda na primeira dobra, que Leandro Oliveira combina desenvolvimento full stack, leitura de negócio e experiência operacional para construir software usado de verdade.

Cinema continua sendo a linguagem estrutural da experiência: enquadramento, ritmo, contraste, cortes e movimento. O texto e a arquitetura de informação não usam cinema como metáfora recorrente. Termos como “bruto”, “corte”, “clipe”, “claquete”, “timecode” e “linha de reprodução” deixam de nomear seções ou explicar o trabalho.

## Resultado esperado

Em poucos segundos, um visitante deve conseguir responder:

1. Quem é Leandro: desenvolvedor full stack com experiência em produto, integrações, dados e liderança técnica.
2. O que ele faz: constrói produtos digitais e sistemas que resolvem operações reais.
3. Que provas existem: SaaS próprios, sistemas entregues, sites publicados e uma ferramenta interna usada por uma área de aproximadamente 80 pessoas.
4. Como entrar em contato: por WhatsApp, e-mail, LinkedIn ou Instagram, todos com dados reais.

## Direção visual

### Tese

**Produtos digitais para operações reais.**

O portfólio não se apresenta como uma interface de edição de cinema. Ele se comporta como uma peça cinematográfica: composição precisa, escala dramática, passagens com cortes firmes e alternância entre tensão e silêncio.

### Mundo visual

- Fundo preto profundo e superfícies em grafite.
- Branco levemente quente para texto e verde-limão `#D4FF00` como único acento.
- Tipografia sans de display, larga e assertiva, combinada com uma fonte de leitura neutra.
- Monoespaçada apenas para tecnologia, status e pequenos metadados; nunca para parágrafos inteiros.
- Linhas, máscaras retangulares e mudanças de escala substituem cards genéricos e ornamentos de câmera.
- Sem guias de visor, timecode persistente, barra de transporte ou terminologia de edição.
- Imagens reais dos projetos são a principal matéria visual.

### Movimento

A abertura acontece automaticamente, dura aproximadamente 900 a 1.200 ms e termina sem interação:

1. O nome e a proposta já existem no primeiro frame e continuam legíveis caso JavaScript falhe.
2. Uma máscara horizontal revela a composição em dois cortes curtos.
3. A headline e os projetos em destaque assentam na posição final.
4. Depois disso, o scroll é navegação comum; não é necessário rolar para “consertar” a primeira dobra.

`prefers-reduced-motion: reduce` elimina máscaras, deslocamentos e escalas. A página abre diretamente no estado final. Nenhuma animação pode controlar a visibilidade permanente do conteúdo.

## Arquitetura da home

### 1. Abertura

Conteúdo principal:

- Nome: **Leandro Oliveira**.
- Headline: **Produtos digitais para operações reais.**
- Apoio: desenvolvimento full stack, produto, integrações e automação orientados a problemas concretos de negócio.
- Ação primária: **Conversar sobre um projeto**, abrindo o WhatsApp em `+55 44 99776-2271`.
- Ação secundária: **Ver projetos**.

A primeira dobra usa uma composição assimétrica. A headline ocupa a maior área; uma faixa lateral ou inferior apresenta três provas curtas e factuais:

- Produtos próprios em construção e operação.
- Sistemas entregues para negócios reais.
- Ferramenta interna usada por uma área de aproximadamente 80 pessoas.

Não serão inventadas métricas de receita, usuários, tempo economizado ou clientes.

### 2. Projetos selecionados

Os projetos aparecem cedo, antes do processo de trabalho. Cada entrada responde de forma direta:

- O que é.
- Para quem ou para qual operação foi feito.
- Qual problema resolve.
- Estado atual: publicado, entregue, demonstração ou em construção.
- Tecnologias confirmadas, quando houver evidência local ou fornecida pelo autor.
- Link público ou estudo de caso, quando disponível.

Ordem inicial recomendada:

1. **Alinnea** - SaaS CRM para psicólogos; produto próprio publicado.
2. **Roadmap** - gestão de agenda e capacidade da implantação; sistema interno em uso por uma área de aproximadamente 80 pessoas.
3. **DocHub** - controle de documentação de funcionários de obra; sistema entregue.
4. **Radar Fiscal** - SaaS fiscal para escritórios de contabilidade; em construção.
5. **PetGest** - SaaS de gestão para petshops; em construção.
6. **Gabriela Lorenson** - site profissional publicado.
7. **Ébano** - demonstração de experiência digital com orçamento online; identificado explicitamente como demonstração.

Os projetos de maior profundidade usam imagem ampla e texto curto. Os demais entram numa grade editorial compacta. A distinção entre “entregue”, “publicado”, “em construção” e “demonstração” deve ser visível e não depender apenas de cor.

### 3. Stack em produção

A stack não aparece como uma nuvem de logotipos. Ela é apresentada como repertório aplicado:

- **Python** - análise de dados, dashboards, automações e pipelines com IA.
- **Node.js** - APIs, integrações e serviços de produto.
- **React** - interfaces operacionais e produtos web.
- **Next.js** - aplicações e experiências web publicadas.
- **C#** - ferramentas internas e integrações com sistemas corporativos.

Uma segunda linha pode citar NestJS, PostgreSQL, Prisma, SQL Server, APIs REST/SOAP e processamento de arquivos, desde que o texto permaneça secundário. A seção mostra capacidade técnica sem competir com os casos.

### 4. Como trabalho

Três etapas diretas, sem metáfora cinematográfica:

1. **Entendo a operação.** Observo o processo atual, suas exceções e quem depende dele.
2. **Defino o que resolve primeiro.** Transformo necessidade em escopo executável e priorizo a parte que entrega valor.
3. **Construo e acompanho o uso.** Entrego, valido com a operação e evoluo com evidência real.

Essa seção deve reforçar o diferencial “diagnóstico + construção”, sem prometer ausência de dependência, prazos ou resultados não comprovados.

### 5. Trajetória

A biografia deixa de ser um esqueleto com placeholders e passa a usar fatos do perfil profissional fornecido:

- **2014:** desenvolvimento em Delphi e Firebird, suporte e validação de requisitos.
- **2016-2020:** suporte e retaguarda de ERP, contato com clientes, banco de dados e validação de rotinas.
- **2020-2024:** implantação de sistemas, liderança de retaguarda e aprofundamento em integrações e processos.
- **2025-2026:** estruturação da Retaguarda da Implantação, projetos de integração, dashboards e indicadores.
- **Hoje:** liderança técnica e operacional, gestão de capacidade, ferramentas internas, SaaS próprios e IA aplicada com validação humana.

A apresentação não transforma a página num currículo. Ela conecta a trajetória ao modo atual de construir produto: Leandro conhece software tanto pelo código quanto pela operação que precisa usá-lo.

### 6. Notas

Mantém a área de artigos, mas o rótulo e a apresentação deixam de usar “cortes”. Os textos sustentam pensamento de produto, integração, IA aplicada, arquitetura e melhoria de processos.

### 7. Contato

Fechamento curto e direto:

> Tem uma operação que ainda depende de planilha, retrabalho ou conferência manual? Vamos conversar.

Regras:

- WhatsApp é a ação principal e usa o número `+55 44 99776-2271` (valor normalizado para link: `5544997762271`).
- E-mail: `leandroappa@gmail.com`.
- LinkedIn: `https://www.linkedin.com/in/lhsoliveira`.
- Instagram: `https://www.instagram.com/lhs.oliveira` (`@lhs.oliveira`).
- Nenhum placeholder aparece para visitantes.

## Componentes e dados

### Conteúdo de projetos

Os projetos continuam em arquivos MDX, mas o frontmatter passa a representar fatos reais:

- `titulo`
- `resumo`
- `problema`
- `resultado`
- `status`
- `tipo`
- `url`
- `imagem`
- `stack`
- `destaque`
- `ordem`

`status` aceita apenas valores conhecidos: `publicado`, `entregue`, `em-construcao` e `demonstracao`. O carregador valida dados ausentes ou inválidos durante o build.

### Dados pessoais e carreira

Identidade, contatos, stack e trajetória ficam em módulos TypeScript tipados. Links vazios não são renderizados. A ação principal de contato é resolvida por uma função única que gera o link do WhatsApp com o número normalizado e uma mensagem inicial curta.

### Imagens

- Sites públicos podem usar capturas próprias autorizadas pelo fato de serem trabalhos do autor.
- Sistemas privados usam imagens locais já aprovadas ou composições que ocultem dados sensíveis.
- Nenhuma tela de Roadmap, DocHub ou Radar Fiscal pode revelar nomes, documentos, CNPJs, credenciais ou informações operacionais reais.
- Toda imagem tem texto alternativo orientado ao que ela prova.

## Responsividade

- A primeira dobra termina dentro de `100svh`; não cria uma pista artificial de `175svh`.
- No celular, headline, apoio e ações aparecem sem exigir scroll horizontal ou zoom.
- Projetos destacados viram uma sequência vertical com imagem acima do texto.
- A stack mantém descrições curtas em vez de reduzir tudo a ícones.
- Navegação inferior persistente é removida. O cabeçalho superior é compacto e oferece acesso a Projetos, Trajetória e Contato.
- Alvos interativos têm pelo menos 44 px e foco visível.

## Acessibilidade e desempenho

- Conteúdo principal renderizado no servidor e visível antes da hidratação.
- Contraste mínimo WCAG AA.
- Navegação completa por teclado.
- `aria-current` apenas onde houver navegação real.
- Movimento reduzido abre no estado final.
- GSAP é usado somente na abertura e em transições de seção que precisem de coreografia; animações simples usam CSS.
- Lenis é removido se não houver benefício mensurável para a nova composição.
- Imagens usam dimensões explícitas, carregamento responsivo e prioridade apenas para a primeira dobra.
- Não há reprodução automática de vídeo ou áudio.

## Falhas e estados incompletos

- JavaScript indisponível: todo o conteúdo permanece visível e navegável.
- Imagem ausente: o projeto mantém título, resumo, status e link; não exibe quadro “pendente”.
- URL ausente: o caso continua legível sem botão quebrado.
- Contato inválido durante o desenvolvimento: testes e validação do build impedem a publicação de um link quebrado.
- Projeto em construção: o estado é explícito e não oferece CTA enganoso de cadastro ou compra.
- Conteúdo MDX inválido: o build falha com mensagem que identifica o arquivo e o campo.

## Estratégia de testes

### Testes automatizados

- Validar o schema dos projetos e todos os valores de `status`.
- Garantir ordenação e seleção dos projetos destacados.
- Testar a normalização do número e a geração do link real de WhatsApp.
- Testar que a abertura contém headline e ações no HTML inicial.
- Testar que tecnologias solicitadas aparecem na seção de stack.
- Testar que termos cinematográficos removidos não voltam como rótulos de navegação e seções.

### Verificação visual

- Capturas em desktop `1440 × 900` e mobile `390 × 844` numa única rodada.
- Conferir primeiro frame e estado final da animação automática.
- Conferir `prefers-reduced-motion` no estado final imediato.
- Conferir ausência de overflow horizontal, conteúdo cortado e sobreposição com o cabeçalho.
- Conferir contraste, foco de teclado e legibilidade dos status.

### Critérios de aceite

1. A abertura se completa sozinha e não parece quebrada no primeiro frame.
2. A headline comunica produto e operação sem metáfora de cinema.
3. Os sete projetos reais aparecem com estado honesto.
4. Python, Node.js, React, Next.js e C# aparecem com contexto de uso.
5. A trajetória usa fatos do perfil fornecido, sem placeholders públicos.
6. Nenhum contato, métrica ou cliente é inventado.
7. Desktop, celular, teclado e movimento reduzido funcionam.

## Fora de escopo

- CMS remoto, autenticação, formulário com backend e área administrativa.
- Depoimentos, números comerciais ou métricas não fornecidas.
- Tradução para outros idiomas.
- Vídeo de apresentação ou trilha sonora.
- Redesign dos produtos externos apresentados no portfólio.

## Pendências para publicação

- Retrato profissional, se o autor quiser aparecer na seção de trajetória.
- Seleção final de capturas sem dados sensíveis para Roadmap, DocHub e Radar Fiscal.
- Domínio definitivo do portfólio.
