export type MarcoCarreira = {
  periodo: string;
  titulo: string;
  descricao: string;
};

export const carreira: readonly MarcoCarreira[] = [
  {
    periodo: '2014',
    titulo: 'Código, suporte e requisito',
    descricao:
      'Comecei com Delphi e Firebird, apoiando suporte e validando requisitos diretamente com clientes.',
  },
  {
    periodo: '2016 — 2020',
    titulo: 'ERP por dentro da operação',
    descricao:
      'Passei por help desk, ERP e retaguarda, trabalhando com banco de dados, rotinas corporativas e problemas reais de implantação.',
  },
  {
    periodo: '2020 — 2024',
    titulo: 'Implantação e liderança de retaguarda',
    descricao:
      'Conduzi implantações, integrações e a evolução da retaguarda técnica, aproximando cliente, negócio e desenvolvimento.',
  },
  {
    periodo: '2025 — 2026',
    titulo: 'Projetos, dados e capacidade',
    descricao:
      'Ajudei a estruturar a Retaguarda da Implantação e construí dashboards, indicadores e ferramentas para planejar trabalho e recursos.',
  },
  {
    periodo: 'Hoje',
    titulo: 'Produto e operação no mesmo trabalho',
    descricao:
      'Atuo com liderança técnica e operacional, integrações, ferramentas internas, SaaS próprios e IA aplicada com validação humana.',
  },
] as const;

