# Product

<!-- impeccable:product-schema 1 -->

## Platform and stack

Portfólio web em **Next.js 15 (App Router), TypeScript, Tailwind CSS v4, MDX e Three.js sobre WebGL2**. Projetos e notas são arquivos tipados em `content/`, e as capturas são descobertas em `public/projetos/` pelo nome do arquivo — publicar mais telas de um projeto é copiar arquivo para a pasta, sem tocar em componente.

O canvas WebGL não é decoração: ele desenha o corredor onde abertura e projetos acontecem, com carregamento e descarte progressivo de textura conforme a câmera avança. Fora do corredor não há biblioteca de animação — as seções seguintes usam `animation-timeline: view()`, sem JavaScript. Não há GSAP, Lenis, playhead nem interface de reprodução.

## Purpose

Portfólio pessoal e canal de aquisição de **Leandro Oliveira (`lhs.oliveira`)**, desenvolvedor full stack com atuação em produto e operações. A tese é direta: **Produtos digitais para operações reais.**

O sucesso principal é um visitante entender rapidamente a oferta, reconhecer provas reais de execução e abrir uma conversa no WhatsApp. LinkedIn, e-mail e Instagram são alternativas explícitas.

## Audiences

- Donos e responsáveis por operações que precisam substituir processos frágeis ou manuais.
- Fundadores e responsáveis por produto que precisam construir ou destravar software.
- Agências e times de tecnologia que procuram execução full stack confiável.
- Recrutadores e gestores que avaliam repertório técnico e experiência operacional.

## Evidence

Os sete projetos apresentados são reais:

- **Alinnea** — SaaS CRM para psicólogos, em operação.
- **Roadmap Projetos** — sistema interno em uso por uma área de aproximadamente 80 pessoas.
- **DocHub** — controle de documentação de funcionários de obra, entregue.
- **Gabriela Lorenson** — site profissional publicado.
- **Ébano** — demonstração pública de orçamento.
- **PetGest** — SaaS em construção.
- **Radar Fiscal** — SaaS fiscal em construção.

Capturas públicas ou sanitizadas só são usadas quando não expõem dados pessoais ou operacionais. Alinnea usa material visual seguro; Roadmap Projetos e DocHub têm capturas demonstrativas, e Radar Fiscal tem uma captura sanitizada para preservar a prova sem revelar informações internas. A ausência de imagem em qualquer outro caso continua sendo uma decisão editorial e de privacidade, não um convite a fabricar material.

## Contact and technology

- WhatsApp: `+55 44 99776-2271` (conversão principal).
- E-mail: `leandroappa@gmail.com`.
- LinkedIn: `linkedin.com/in/lhsoliveira`.
- Instagram: `@lhs.oliveira`.
- Tecnologias explicitadas: Python, Node.js, React, Next.js e C#, acompanhadas de banco de dados, integrações, automação e arquitetura quando relevantes ao trabalho.

## Content and voice

Português do Brasil, frases diretas e linguagem de negócio. Cada projeto parte do problema, registra o que foi entregue e informa honestamente seu estado. A tecnologia sustenta a prova, mas não substitui o resultado.

Cinema é linguagem estrutural: enquadramento, contraste, ritmo, composição, profundidade WebGL e coreografia de rolagem. Nomes de seções, controles e textos não simulam um set de filmagem.

## Visual system

- Preto profundo e grafite como base; branco quente para texto; verde-limão `#D4FF00` como único acento.
- Archivo para títulos largos e Martian Mono apenas em metadados e tecnologia.
- Bordas retas, módulos editoriais e assimetria controlada; sem cartões genéricos arredondados.
- Alinnea ocupa o principal espaço visual. Roadmap, DocHub e Radar Fiscal participam com material sanitizado, mantendo a prova visual segura.
- Projetos formam um momento espacial com pin no desktop de capacidade completa e permanecem uma sequência vertical direta no mobile ou em perfis compactos.

## Accessibility and constraints

- Conteúdo principal já existe no HTML e não depende de WebGL, pin ou animação para aparecer.
- O canvas WebGL é único, decorativo, invisível para tecnologias assistivas e não captura interação.
- A experiência escolhe entre os perfis `full`, `compact` e `static`: `full` habilita a coreografia espacial completa; `compact` reduz densidade, deslocamento e custo; `static` preserva o layout sem coreografia.
- `prefers-reduced-motion`, indisponibilidade do WebGL2 ou falha de inicialização levam ao perfil `static`, mantendo todo o conteúdo disponível.
- ScrollTrigger é usado somente na home e não transforma páginas de projeto ou notas em experiências dependentes de rolagem.
- Navegação por teclado, foco visível, contraste adequado e alvos de toque de pelo menos 44px.
- Layout mobile-first, sem rolagem horizontal.
- Não fabricar métricas, clientes, depoimentos, telas ou resultados.
- Não publicar capturas com nomes de clientes, pessoas ou dados internos.
