import { Abertura } from '@/components/Abertura';
import { Processo } from '@/components/Processo';
import { Entregas } from '@/components/Entregas';
import { QuemSou } from '@/components/QuemSou';
import { Notas } from '@/components/Notas';
import { Contato } from '@/components/Contato';
import { getNotas, getProjetos } from '@/lib/content';

export default function Home() {
  const projetos = getProjetos();
  const notas = getNotas();

  return (
    <>
      <Abertura />
      <Processo />
      <Entregas projetos={projetos} />
      <QuemSou />
      <Notas notas={notas} />
      <Contato />
    </>
  );
}
