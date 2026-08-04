/**
 * LINHA DO TEMPO — a história de profissão.
 *
 * Biografia não é inventável. Todas as entradas abaixo estão marcadas com
 * `placeholder: true` e a interface mostra isso na cara do visitante, com
 * um aviso, até você substituir pelo que realmente aconteceu.
 *
 * Para publicar: reescreva os campos e apague `placeholder: true`. O aviso
 * some sozinho quando nenhuma entrada estiver marcada.
 */

export type Marca = {
  /** Rótulo curto de tempo. Vira o timecode da entrada. */
  tempo: string;
  titulo: string;
  texto: string;
  placeholder?: boolean;
};

export const carreira: Marca[] = [
  {
    tempo: 'ENTRADA',
    titulo: 'Onde isso começou',
    texto:
      'Substitua por como você entrou em desenvolvimento: o primeiro sistema que você mexeu, o problema que te fez aprender a programar, o ano.',
    placeholder: true,
  },
  {
    tempo: 'CORTE 01',
    titulo: 'Os anos de dentro',
    texto:
      'Substitua pelo tempo de empresa: onde trabalhou, que tipo de sistema, que tamanho de time, o que você aprendeu ali que ainda usa.',
    placeholder: true,
  },
  {
    tempo: 'CORTE 02',
    titulo: 'A virada para autônomo',
    texto:
      'Substitua pelo motivo real da virada. Essa é a parte que o visitante mais quer ler, porque é onde ele descobre se você escolheu isso ou caiu nisso.',
    placeholder: true,
  },
  {
    tempo: 'AGORA',
    titulo: 'Como eu trabalho hoje',
    texto:
      'Substitua por como o trabalho funciona hoje: sozinho ou com parceiros, que tipo de projeto você aceita, o que você recusa e por quê.',
    placeholder: true,
  },
];

export const carreiraTemPlaceholder = carreira.some((m) => m.placeholder);
