/**
 * As seções da home são clipes numa linha do tempo, e a barra de transporte
 * é a navegação. Os rótulos são deliberadamente planos: o mundo da mesa de
 * edição aparece no material e no timecode, nunca na sinalização — quem tem
 * que se achar aqui é um dono de PME com pressa, não um editor.
 */
export const secoes = [
  { id: 'abertura', n: '00', nome: 'Abertura' },
  { id: 'processo', n: '01', nome: 'Processo' },
  { id: 'entregas', n: '02', nome: 'Entregas' },
  { id: 'quem-sou', n: '03', nome: 'Quem sou' },
  { id: 'notas', n: '04', nome: 'Notas' },
  { id: 'contato', n: '05', nome: 'Contato' },
] as const;

export type Secao = (typeof secoes)[number];
