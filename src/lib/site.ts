/** Ponto único de verdade de contato, identidade e repertório técnico. */

export const site = {
  nome: 'lhs.oliveira',
  nomeCompleto: 'Leandro Oliveira',
  papel: 'Desenvolvedor full stack · Produto e operações',
  /**
   * O papel calibrado para `<title>`.
   *
   * `papel` inteiro somado ao nome dá 65 caracteres e o Google corta por volta
   * de 60. Cortar até "Desenvolvedor full stack" dava 43 e desperdiçava um
   * terço do campo. Com "e operações" o título fica em 55 — dentro da faixa e
   * carregando a palavra que separa este portfólio dos outros. O `papel`
   * completo continua no `jobTitle` do JSON-LD e no rodapé do card social.
   */
  papelCurto: 'Desenvolvedor full stack e operações',
  /**
   * Só metadado: alimenta a `meta description`, o `og:description` e o
   * `llms.txt`. Não aparece como texto na página, então pode usar os ~155
   * caracteres que o Google mostra sem negociar com o design. A primeira frase
   * é a tese; a segunda diz o que existe de concreto, que é o que decide o
   * clique quando o resultado aparece ao lado de outros seis.
   */
  descricao:
    'Produtos digitais e sistemas para operações reais, da descoberta ao código em produção. SaaS próprios, ferramentas internas e integrações.',
  /**
   * Quem assina as notas. Fica aqui, e não no componente, porque o mesmo texto
   * alimenta o rodapé de autoria e a descrição do `Person` em JSON-LD — e uma
   * biografia que diverge de si mesma entre a página e os dados estruturados é
   * pior do que não ter nenhuma.
   */
  bio:
    'Trabalho com software ligado a operação desde 2014 — ERP, implantação, integrações e ferramentas internas. Hoje construo SaaS próprios e sistemas para quem depende deles todo dia.',
  url: 'https://devleandrooliveira.com.br',
  locale: 'pt-BR',

  whatsapp: '5544997762271',
  whatsappMensagem:
    'Oi, Leandro. Vi seu portfólio e quero conversar sobre um projeto.',

  retrato: '',
  github: 'https://github.com/LeandroOlveira',
  linkedin: 'https://www.linkedin.com/in/lhsoliveira',
  instagram: 'https://www.instagram.com/lhs.oliveira',
  email: 'leandroappa@gmail.com',
} as const;

export const navegacao = [
  { href: '#projetos', label: 'Projetos' },
  { href: '#stack', label: 'Stack' },
  { href: '#trajetoria', label: 'Trajetória' },
  { href: '#contato', label: 'Contato' },
] as const;

export const stack = [
  {
    nome: 'Python',
    descricao: 'Análise de dados, dashboards, automações e pipelines com IA.',
  },
  {
    nome: 'Node.js',
    descricao: 'APIs, integrações e serviços que sustentam produtos web.',
  },
  {
    nome: 'React',
    descricao: 'Interfaces operacionais densas e experiências de produto.',
  },
  {
    nome: 'Next.js',
    descricao: 'Aplicações e sites rápidos, acessíveis e preparados para busca.',
  },
  {
    nome: 'C#',
    descricao: 'Ferramentas internas e integrações com sistemas corporativos.',
  },
] as const;

export function whatsappLink(mensagem: string = site.whatsappMensagem): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const contatoPendente = false;
