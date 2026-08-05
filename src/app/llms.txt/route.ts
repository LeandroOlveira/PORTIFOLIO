import { getNotas, getProjetos } from '@/lib/content';
import { site, stack } from '@/lib/site';

/**
 * `/llms.txt` — o site em texto puro, para quem lê por máquina.
 *
 * A home é uma experiência 3D e as páginas de projeto vivem atrás de rotas
 * dinâmicas; um crawler de LLM que não executa WebGL vê pouco. Este arquivo é
 * o mesmo conteúdo sem coreografia, gerado do mesmo `content/` que alimenta as
 * páginas — não há segunda fonte de verdade para desatualizar.
 */
export const dynamic = 'force-static';

export function GET(): Response {
  const projetos = getProjetos();
  const notas = getNotas();

  const linhas = [
    `# ${site.nomeCompleto}`,
    '',
    `> ${site.papel}. ${site.descricao}`,
    '',
    `Site: ${site.url}`,
    `Contato: ${site.email} · WhatsApp +${site.whatsapp}`,
    `Repositórios: ${site.github}`,
    `LinkedIn: ${site.linkedin}`,
    '',
    '## Repertório técnico',
    '',
    ...stack.map((item) => `- **${item.nome}**: ${item.descricao}`),
    '',
    '## Projetos',
    '',
    ...projetos.flatMap((projeto) => [
      `- [${projeto.titulo}](${site.url}/projetos/${projeto.slug}): ${projeto.resumo}`,
      `  - Tipo: ${projeto.tipo}`,
      `  - Problema: ${projeto.problema}`,
      `  - Resultado: ${projeto.resultado}`,
      ...(projeto.stack.length > 0 ? [`  - Stack: ${projeto.stack.join(', ')}`] : []),
      ...(projeto.url ? [`  - Ao vivo: ${projeto.url}`] : []),
    ]),
    '',
    '## Notas',
    '',
    ...notas.map(
      (nota) =>
        `- [${nota.titulo}](${site.url}/notas/${nota.slug}) (${nota.data}): ${nota.resumo}`,
    ),
    '',
  ];

  return new Response(linhas.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  });
}
