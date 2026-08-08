# Visual / Search Experience (SXO) — análise via DOM

**Limitação declarada:** a captura de tela falhou — o painel do navegador não estava sendo exibido, então a página não compunha frames. A análise abaixo é de geometria de elementos e conteúdo medidos no DOM em produção, não de imagem. Não há screenshots nesta rodada.

## Acima da dobra (desktop, ~700 px)

Ordem real dos elementos:

1. Link de pular para o conteúdo (acessibilidade ✅)
2. Marca "lhs.oliveira" + nav (Projetos, Stack, Trajetória, Contato)
3. CTA "WHATSAPP"
4. Primeiro projeto: descrição, RESULTADO, "CONHECER PROJETO", "ABRIR SITE ↗"

**H1:** "PRODUTOS DIGITAIS PARA OPERAÇÕES REAIS."

A proposta de valor e o CTA de conversão estão ambos acima da dobra. O corredor 3D entrega projeto e ação sem exigir rolagem. Isso está certo.

**O que falta acima da dobra:** o nome da pessoa. A marca visível é "lhs.oliveira". Um visitante que chegou do LinkedIn procurando "Leandro Oliveira" não vê esse nome em lugar nenhum na primeira tela. Mesma raiz de A1, aqui com custo de confiança, não de ranking.

## Adequação tipo-de-página × intenção

| Intenção | Página que atende | Adequada? |
|---|---|---|
| Navegacional pelo nome | `/` | ⚠️ o nome não está no título |
| "quem é / o que faz" | `/` | ✅ |
| "exemplos de trabalho" | `/` (seção projetos) | ⚠️ sem hub `/projetos` |
| "crm para psicólogos" e afins | `/projetos/alinnea` | ⚠️ título não fala a categoria |
| Contratar | CTA WhatsApp | ✅ direto, sem formulário |

Duas incompatibilidades, ambas já mapeadas (A1, A2, A4). Nenhum descompasso de formato: nenhuma consulta comercial cai numa página de blog nem o contrário.

## Personas

**Cliente potencial (dono de operação, pouco técnico).** Encontra o problema descrito na linguagem dele ("agenda, prontuário e automações", "documentação de funcionários de obra"), vê produtos no ar e chega ao WhatsApp em um clique. Bem atendido. O que falta é prova numérica — só um projeto tem métrica.

**Recrutador técnico.** Stack explícita, trajetória desde 2014, GitHub linkado. Bem atendido. Sem currículo baixável e sem detalhe de arquitetura, mas para portfólio autoral é escolha legítima.

**Par / desenvolvedor.** As notas mostram julgamento, mas são três e curtas. Subatendido — é o público que o item B1 destrava.

## Alvos de toque (M6)

22 links com altura abaixo de 40 px:

| Elemento | Altura |
|---|---|
| Nav (Projetos, Stack, Trajetória, Contato) | 15 px |
| Marca "lhs.oliveira" | 15 px |
| "CONHECER PROJETO" / "ABRIR SITE ↗" | 11 px |

A recomendação do Google é ~48 px de área tocável. Os CTAs de 11 px são os mais críticos: são o caminho para as páginas de projeto.

**Fix:** padding vertical nos links. Não é preciso mexer no tamanho da fonte — a área clicável cresce sem alterar a tipografia.

## Acessibilidade observada

- ✅ Link "pular para o conteúdo"
- ✅ `viewport: width=device-width, initial-scale=1`
- ✅ `theme-color: #0b0b0b`
- ✅ H1 único, hierarquia sem saltos
- ✅ `rel="noopener noreferrer"` em 13/13 links externos
- ✅ Contraste da Stack corrigido (piso de opacidade 0,12 → 0,4)
- ⚠️ Alvos de toque (M6)

## Não verificado

Sem screenshots: enquadramento, sobreposições, comportamento do corredor em viewport móvel real e qualquer regressão puramente visual ficaram fora desta rodada. Se quiser essa cobertura, rode a auditoria com o painel do navegador visível.
